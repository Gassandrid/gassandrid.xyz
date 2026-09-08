import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { h } from "preact"
import { slugifyFilePath, transformLink } from "@quartz-community/utils/path"

const MARIMO_ISLANDS_VERSION = "0.23.9"
const OBSIDIAN_WIKILINK = /(?<!!)\[\[([^\[\]\n]+)\]\]/g
const RENDER_SCRIPT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "render.py")

let pythonMissingWarned = false
let versionMismatchWarned = false
const renderCache = new Map()

function parseWikiLink(raw) {
  const divider = raw.indexOf("|")
  const target = (divider === -1 ? raw : raw.slice(0, divider)).trim()
  const alias = divider === -1 ? "" : raw.slice(divider + 1).trim()
  const withoutAnchor = target.split("#", 1)[0]
  const fallbackLabel = withoutAnchor.split("/").at(-1) || target
  return { raw, target, label: alias || fallbackLabel }
}

export function buildObsidianContext(ctx, content) {
  const published = new Map(
    (content ?? []).map(([tree, file]) => [file.data.relativePath, { tree, data: file.data }]),
  )
  const files = (ctx.allFiles ?? []).flatMap((fp) => {
    if (fp.endsWith(".md") && content !== undefined && !published.has(fp)) return []
    const page = published.get(fp)
    const slug = page?.data.slug ?? slugifyFilePath(fp.replace(/\.marimo\.py$/, ".md"))
    const aliases = page?.data.frontmatter?.aliases ?? []
    const headings = {}
    const stack = []
    function text(node) {
      return node.value ?? (node.children ?? []).map(text).join("")
    }
    function visit(node) {
      if (/^h[1-6]$/.test(node.tagName) && node.properties?.id) {
        const depth = Number(node.tagName[1])
        const title = text(node)
        while (stack.length && stack.at(-1).depth >= depth) stack.pop()
        stack.push({ depth, title })
        headings[title] ??= node.properties.id
        headings[stack.map((h) => h.title).join("#")] = node.properties.id
      }
      for (const child of node.children ?? []) visit(child)
    }
    if (page) visit(page.tree)
    return [{ path: fp, slug, aliases: Array.isArray(aliases) ? aliases : [aliases], headings }]
  })
  return { files }
}

function resolveLinkedSlug(target, allSlugs, currentSlug) {
  const withoutAnchor = target.split("#", 1)[0]
  const canonical = slugifyFilePath(withoutAnchor)
  const matches = allSlugs.filter((slug) => {
    if (canonical.includes("/")) return slug === canonical || slug.endsWith(`/${canonical}`)
    return slug.split("/").at(-1) === canonical
  })
  const exact = matches.find((slug) => slug === canonical)
  const nearby = matches.filter(
    (slug) => path.posix.dirname(slug) === path.posix.dirname(currentSlug),
  )
  if (canonical.includes("/") && exact) return exact
  return matches.length === 1 ? matches[0] : nearby.length === 1 ? nearby[0] : null
}

export function compileObsidianLinks(src, currentSlug, allSlugs) {
  const parsed = Array.from(src.matchAll(OBSIDIAN_WIKILINK), (match) => parseWikiLink(match[1]))
  const replacements = {}
  const links = new Set()
  for (const link of parsed) {
    const resolved = resolveLinkedSlug(link.target, allSlugs, currentSlug)
    if (!resolved) continue
    const anchor = link.target.includes("#") ? link.target.slice(link.target.indexOf("#")) : ""
    replacements[link.raw] = {
      label: link.label,
      href: transformLink(currentSlug, resolved + anchor, { strategy: "absolute", allSlugs }),
    }
    links.add(resolved)
  }
  return { replacements, links: [...links] }
}

function filenameToTitle(name) {
  return name
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseAppTitle(src) {
  const match = src.match(/marimo\.App\s*\([^)]*app_title\s*=\s*["']([^"']+)["']/)
  return match ? match[1] : null
}

function parseDescription(src) {
  const match = src.match(/^#\s*description:\s*(.+)$/m)
  return match ? match[1].trim() : null
}

function parseTags(src) {
  const match = src.match(/^#\s*tags:\s*(.+)$/m)
  if (!match) return []
  return match[1]
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function parseStaticPreview(src) {
  return /^#\s*static-preview:\s*true\s*$/im.test(src)
}

function parseRenderJson(stdout) {
  const lines = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  for (const line of lines.reverse()) {
    try {
      return JSON.parse(line)
    } catch {}
  }
  return null
}

function escapeHtmlAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
}

function resolvePython() {
  const candidates = [
    process.env.MARIMO_PYTHON,
    "/opt/homebrew/Caskroom/miniconda/base/bin/python3",
    "/opt/homebrew/Caskroom/miniconda/base/bin/python",
    "python3",
  ].filter(Boolean)
  return (
    candidates.find((candidate) => candidate === "python3" || fs.existsSync(candidate)) ?? "python3"
  )
}

function renderIsland(
  notebookPath,
  { failOnError, runtimeVersion, markdownContext, staticPreview },
) {
  const stat = fs.statSync(notebookPath)
  const compilerStamp = [
    RENDER_SCRIPT_PATH,
    path.join(path.dirname(RENDER_SCRIPT_PATH), "obsidian.py"),
  ]
    .map((fp) => fs.statSync(fp).mtimeMs)
    .join(":")
  const cacheKey = `${compilerStamp}:${stat.mtimeMs}:${runtimeVersion}:${staticPreview}:${JSON.stringify(markdownContext)}`
  const cached = renderCache.get(notebookPath)
  if (cached?.key === cacheKey) return cached.value

  function fail(message) {
    if (failOnError) throw new Error(`[marimo] ${notebookPath}: ${message}`)
    console.warn(`[marimo] ${notebookPath}: ${message}`)
    return null
  }

  const result = spawnSync(resolvePython(), [RENDER_SCRIPT_PATH, notebookPath], {
    encoding: "utf8",
    input: JSON.stringify({ markdownContext, staticPreview }),
    env: {
      ...process.env,
      EWAN_MARIMO_STATIC_PREVIEW: staticPreview ? "1" : "",
    },
    maxBuffer: 50 * 1024 * 1024,
    timeout: 120_000,
  })
  if (result.error) {
    if (result.error.code === "ENOENT" && !pythonMissingWarned) {
      console.warn("[marimo] python not found - skipping all marimo notebooks.")
      pythonMissingWarned = true
    }
    return fail(result.error.message)
  }
  const parsed = parseRenderJson(result.stdout ?? "")
  if (!parsed) {
    return fail(
      `could not parse generator output (exit ${result.status ?? "unknown"})\nstdout: ${result.stdout ?? ""}\nstderr: ${result.stderr ?? ""}`,
    )
  }
  if (parsed.error) return fail(parsed.error)

  const body = String(parsed.body ?? "")
  const marimoVersion = typeof parsed.marimoVersion === "string" ? parsed.marimoVersion : null
  if (marimoVersion && marimoVersion !== runtimeVersion) {
    const message = `local marimo ${marimoVersion} does not match islands runtime ${runtimeVersion}`
    if (failOnError) return fail(message)
    if (!versionMismatchWarned) {
      console.warn(`[marimo] ${message}.`)
      versionMismatchWarned = true
    }
  }
  const rendered = {
    body,
    marimoVersion,
    islandCount:
      typeof parsed.islandCount === "number"
        ? parsed.islandCount
        : (body.match(/<marimo-island/g) ?? []).length,
    reactiveIslandCount:
      typeof parsed.reactiveIslandCount === "number"
        ? parsed.reactiveIslandCount
        : (body.match(/data-reactive="true"/g) ?? []).length,
  }
  if (rendered.islandCount === 0) return fail("compiler emitted no marimo islands")
  renderCache.set(notebookPath, { key: cacheKey, value: rendered })
  return rendered
}

function marimoHtml(rendered, runtimeVersion, slug) {
  const loading = `<div class="marimo-loading" aria-live="polite"><span class="marimo-loading-spinner" aria-hidden="true"></span><span class="marimo-loading-text">Starting interactive Python…</span></div>`
  const versionAttr = rendered.marimoVersion
    ? ` data-marimo-version="${escapeHtmlAttr(rendered.marimoVersion)}"`
    : ""
  return `<div class="marimo-notebook-page" data-marimo-page="${escapeHtmlAttr(slug)}" data-marimo-state="loading" data-marimo-runtime="${escapeHtmlAttr(runtimeVersion)}"${versionAttr} data-marimo-islands="${rendered.islandCount}" data-marimo-reactive-islands="${rendered.reactiveIslandCount}">${loading}${rendered.body}</div>`
}

function MarimoBody() {
  function Component({ fileData }) {
    const classes = fileData.frontmatter?.cssclasses ?? []
    return h(
      "article",
      { class: ["popover-hint", ...classes].join(" ") },
      h("div", {
        class: "markdown-preview-view markdown-rendered marimo-page-body",
        dangerouslySetInnerHTML: { __html: fileData.marimoHtml ?? "" },
      }),
    )
  }
  Component.displayName = "MarimoBody"
  return Component
}

export default function MarimoPageType(opts = {}) {
  const runtimeVersion = opts.version ?? MARIMO_ISLANDS_VERSION
  const failOnError = opts.failOnError ?? true
  return {
    name: "MarimoPageType",
    priority: 10,
    match: () => false,
    generate({ ctx, content }) {
      const contentRoot = ctx.argv.directory
      const markdownContext = buildObsidianContext(ctx, content)
      const allSlugs = markdownContext.files.map((file) => file.slug)
      return (ctx.allFiles ?? [])
        .filter((fp) => fp.endsWith(".marimo.py"))
        .flatMap((fp) => {
          const src = path.join(contentRoot, fp)
          const basename = path.basename(fp, ".marimo.py")
          const slug = slugifyFilePath(fp.replace(/\.marimo\.py$/, ".md"))
          let title = filenameToTitle(basename)
          let description = `Interactive marimo notebook: ${title}`
          let tags = []
          let fileContent = ""
          try {
            fileContent = fs.readFileSync(src, "utf8")
            title = parseAppTitle(fileContent) ?? title
            description = parseDescription(fileContent) ?? description
            tags = parseTags(fileContent)
          } catch {}
          const obsidianLinks = compileObsidianLinks(fileContent, slug, allSlugs)
          const rendered = renderIsland(src, {
            failOnError,
            runtimeVersion,
            markdownContext: { ...markdownContext, currentSlug: slug },
            staticPreview: parseStaticPreview(fileContent),
          })
          if (!rendered?.body) return []
          const stat = fs.statSync(src)
          return [
            {
              slug,
              title,
              data: {
                slug,
                relativePath: fp,
                filePath: fp,
                dates: { created: stat.birthtime, modified: stat.mtime, published: stat.birthtime },
                defaultDateType: "created",
                frontmatter: { title, tags, description, cssclasses: ["marimo-page"] },
                text: `${title}. ${description}`,
                description,
                links: obsidianLinks.links,
                isMarimo: true,
                marimoHtml: marimoHtml(rendered, runtimeVersion, slug),
              },
            },
          ]
        })
    },
    layout: "content",
    body: MarimoBody,
  }
}
