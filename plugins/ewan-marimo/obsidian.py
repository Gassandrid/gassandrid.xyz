"""Obsidian extensions for the pinned marimo Markdown parser (also runs in Pyodide)."""
import html
import posixpath
import re
import threading
import unicodedata
from urllib.parse import unquote
from xml.etree import ElementTree as ET

from markdown import Extension, Markdown
from markdown.inlinepatterns import InlineProcessor
from markdown.preprocessors import Preprocessor
from markdown.treeprocessors import Treeprocessor
from markdown.util import AtomicString


def file_key(value):
    value = unquote(value).strip().strip("/")
    value = re.sub(r"\.(?:marimo\.py|md|html)$", "", value, flags=re.I)
    return re.sub(r"\s", "-", value).replace("&", "-and-").replace("%", "-percent").replace("?", "").lower()


def heading_slug(value, separator="-"):
    # Preserve Unicode letters, numbers, marks and underscores, as Quartz does.
    value = html.unescape(re.sub(r"<[^>]*>", "", value)).lower()
    return "".join(c for c in value if c in " -_" or unicodedata.category(c)[0] in "LNM").replace(" ", "-")


class Resolver:
    def __init__(self, context):
        self.current = context.get("currentSlug", "index")
        self.entries = context.get("files", [])
        self.keys = {}
        for entry in self.entries:
            for name in [entry["path"], entry["slug"], *entry.get("aliases", [])]:
                key = file_key(name)
                self.keys.setdefault(key, [])
                if entry not in self.keys[key]:
                    self.keys[key].append(entry)

    def resolve(self, target):
        target = unquote(target).strip()
        if re.match(r"^[a-zA-Z][\w+.-]*:", target) or target.startswith("//"):
            return target, None
        name, sep, fragment = target.partition("#")
        key = file_key(name)
        if not name:
            found = next((e for e in self.entries if e["slug"] == self.current), None)
        else:
            relative = file_key(posixpath.normpath(posixpath.join(posixpath.dirname(self.current), key)))
            if name.startswith(("./", "../")):
                matches = self.keys.get(relative, [])
            else:
                matches = self.keys.get(key, [])
                if not name.startswith("/") and (not matches or "/" not in key):
                    matches = [*matches, *[e for k, es in self.keys.items() if k.endswith("/" + key) for e in es]]
            matches = list({e["slug"]: e for e in matches}.values())
            # A note next to this notebook wins an otherwise ambiguous basename.
            nearby = [e for e in matches if posixpath.dirname(e["slug"]) == posixpath.dirname(self.current)]
            found = matches[0] if len(matches) == 1 else nearby[0] if len(nearby) == 1 else None
        if name and found is None:
            return None, None
        slug = found["slug"] if found else self.current
        simple = re.sub(r"(?:^|/)index$", "/", slug).rstrip("/")
        root = "../" * self.current.count("/") or "./"
        href = root + simple
        if slug.endswith("/index") or slug == "index":
            href = href.rstrip("/") + "/"
        if not name:
            href = ""
        if sep:
            if name.lower().endswith(".pdf"):
                anchor = fragment
            elif fragment.startswith("^"):
                anchor = fragment[1:].lower()
            else:
                anchor = (found or {}).get("headings", {}).get(fragment)
                if anchor is None:
                    anchor = heading_slug(fragment.split("#")[-1])
            href += "#" + anchor
        return href, found


class WikiLinks(InlineProcessor):
    def __init__(self, md, resolver):
        super().__init__(r"(?<!\\)(!?)\[\[([^\[\]\n]+)\]\]", md)
        self.resolver = resolver

    def handleMatch(self, match, data):
        raw = match.group(2).replace(r"\|", "|")
        target, divider, alias = raw.partition("|")
        target = target.strip()
        label = alias.strip() if divider else target.rsplit("/", 1)[-1].removesuffix(".md")
        href, entry = self.resolver.resolve(target)
        if href is None:
            el = ET.Element("span", {"class": "internal-link is-unresolved", "title": "Unpublished or ambiguous note: " + target})
            el.text = AtomicString(label)
            return el, match.start(0), match.end(0)
        if match.group(1):
            ext = posixpath.splitext(target.split("#")[0])[1].lower()
            if ext in {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif", ".bmp"}:
                el = ET.Element("img", {"src": href, "alt": label, "loading": "lazy"})
                dimensions = re.fullmatch(r"(\d+)(?:x(\d+))?", alias.strip())
                if dimensions:
                    el.set("width", dimensions[1])
                    if dimensions[2]:
                        el.set("height", dimensions[2])
            elif ext in {".mp3", ".wav", ".ogg", ".m4a", ".flac", ".mp4", ".webm", ".mov"}:
                tag = "video" if ext in {".mp4", ".webm", ".mov"} else "audio"
                el = ET.Element(tag, {"src": href, "controls": "", "preload": "metadata"})
            elif ext == ".pdf":
                el = ET.Element("iframe", {"src": href, "title": label, "loading": "lazy"})
            else:
                el = ET.Element("span", {"class": "marimo-obsidian-embed", "data-obsidian-embed": href})
                link = ET.SubElement(el, "a", {"href": href, "class": "internal"})
                link.text = AtomicString(label)
        else:
            el = ET.Element("a", {"href": href, "class": "internal", "data-obsidian-resolved": "true"})
            el.text = AtomicString(label)
        return el, match.start(0), match.end(0)


class RawCode(Preprocessor):
    def run(self, lines):
        text = "\n".join(lines)
        text = re.sub(r"<(code|pre)\b[^>]*>[\s\S]*?</\1>", lambda m: self.md.htmlStash.store(m[0]), text, flags=re.I)
        return text.split("\n")


class Comments(Preprocessor):
    def run(self, lines):
        # Superfences and HTML blocks have already stashed their contents. Protect
        # inline/indented code too; comments may otherwise span paragraphs.
        text = "\n".join(lines)
        definitions = []
        pattern = (
            r"(?P<code>(?P<ticks>`+)[\s\S]*?(?P=ticks)(?!`)|^(?: {4}|\t)[^\n]*)"
            r"|(?P<comment>(?<!\\)%%[\s\S]*?(?<!\\)%%)"
            r"|(?<!\\)\^\[(?P<footnote>(?:[^\[\]\n]|\[[^\]\n]*\])+)\]"
            r"|(?P<task>^[ \t]*[-*+] \[)[^ \]xX](?=\] )"
        )
        def replace(match):
            if match.group("code"):
                return match.group(0)
            if match.group("comment"):
                return ""
            if match.group("task"):
                return match.group("task") + "x"
            name = f"ewan-inline-{len(definitions) + 1}"
            definitions.append(f"[^{name}]: {match.group('footnote')}")
            return f"[^{name}]"
        text = re.sub(pattern, replace, text, flags=re.M)
        return (text + "\n\n" + "\n".join(definitions)).split("\n")



class Callouts(Treeprocessor):
    def run(self, root):
        # Before inline parsing so titles retain bold, links and other Markdown.
        for el in list(root.iter()):
            if el.tag != "blockquote" or not len(el) or el[0].tag != "p":
                continue
            first = el[0]
            match = re.match(r"^\[!([\w-]+)\]([+-]?)[ \t]*([^\n]*)(?:\n|$)", first.text or "")
            if not match:
                continue
            kind, fold, title = match.groups()
            el.tag = "details" if fold else "div"
            el.set("class", "callout")
            el.set("data-callout", kind.lower())
            if fold == "+":
                el.set("open", "")
            first.text = (first.text or "")[match.end():]
            title_el = ET.Element("summary" if fold else "div", {"class": "callout-title"})
            title_el.text = title or kind.capitalize()
            el.insert(0, title_el)
        return root


class ObsidianTree(Treeprocessor):
    def __init__(self, md, resolver):
        super().__init__(md)
        self.resolver = resolver

    def run(self, root):
        # After inline parsing: syntax in code and raw HTML remains literal.
        for parent in list(root.iter()):
            if parent.tag in {"code", "pre"}:
                continue
            for i, child in enumerate(list(parent)):
                if child.tag in {"p", "li", "blockquote"}:
                    parts = [(child, "text")] + [(e, "tail") for e in child.iter()]
                    for el, attr in reversed(parts):
                        text = getattr(el, attr)
                        if not text or not text.strip():
                            continue
                        marker = re.search(r"(?:^|\s)\^([A-Za-z0-9-]+)\s*$", text)
                        if marker:
                            setattr(el, attr, text[:marker.start()])
                            dest = child
                            if child.tag == "p" and not "".join(child.itertext()).strip() and i > 0:
                                dest = parent[i - 1]
                                parent.remove(child)
                            dest.set("id", marker[1].lower())
                        break
        for el in list(root.iter()):
            if el.tag == "p" and el.get("id"):
                # Native marimo rewrites bare <p> but every </p>; keep IDs valid.
                el.tag = "span"
                el.set("class", "paragraph")
            if el.tag in {"a", "img"} and not el.get("data-obsidian-resolved"):
                attr = "href" if el.tag == "a" else "src"
                url = el.get(attr, "")
                if el.tag == "img":
                    alt = el.get("alt", "")
                    dimensions = re.search(r"\|(\d+)(?:x(\d+))?$", alt)
                    if dimensions:
                        el.set("alt", alt[:dimensions.start()])
                        el.set("width", dimensions[1])
                        if dimensions[2]:
                            el.set("height", dimensions[2])
                # Footnotes and generated TOC anchors already use rendered IDs.
                if not url or (url.startswith("#") and ("footnote" in el.get("class", "") or url.startswith("#fn"))) or re.match(r"^[a-zA-Z][\w+.-]*:", url) or url.startswith("//"):
                    continue
                href, entry = self.resolver.resolve(url)
                if href is not None:
                    el.set(attr, href)
                    if el.tag == "a":
                        el.set("class", "internal")
                elif el.tag == "a":
                    el.attrib.pop("href", None)
                    el.tag = "span"
                    el.set("class", "internal-link is-unresolved")

        return root


class ObsidianExtension(Extension):
    def __init__(self, resolver):
        self.resolver = resolver
        super().__init__()

    def extendMarkdown(self, md):
        md.preprocessors.register(RawCode(md), "obsidian-raw-code", 24.5)
        md.preprocessors.register(Comments(md), "obsidian-comments", 19)
        md.inlinePatterns.register(WikiLinks(md, self.resolver), "obsidian-wikilinks", 181)
        md.treeprocessors.register(Callouts(md), "obsidian-callouts", 26)
        md.treeprocessors.register(ObsidianTree(md, self.resolver), "obsidian-tree", 6)


def install(context):
    import importlib
    import marimo
    native = importlib.import_module("marimo._output.md")
    extensions = [e for e in native._get_extensions() if e not in ("pymdownx.caret", "pymdownx.critic")]
    config = {k: dict(v) for k, v in native._get_extension_configs().items()}
    config["toc"] = {"slugify": heading_slug}
    config["pymdownx.tilde"] = {"subscript": False}
    config["pymdownx.superfences"]["custom_fences"] = [{
        "name": "mermaid", "class": "mermaid",
        "format": lambda source, language, class_name, options, md, **kwargs: marimo.mermaid(source).text,
    }]
    md = Markdown(extensions=[*extensions, "pymdownx.mark", ObsidianExtension(Resolver(context))], extension_configs=config)
    lock = threading.Lock()
    native._get_markdown = lambda: (md, lock)
