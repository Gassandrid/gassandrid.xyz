# Obsidian Markdown in marimo pages

Write normal `mo.md(...)`, including f-strings, nested Markdown, and interpolated
marimo widgets. Rendering happens after Python evaluates the string, on every
reactive update. Notebook source strings and other Python output are not rewritten.

```python
mo.md(f"Value: {slider.value}. See [[Simone Conradi#Details|the note]].")
```

Links use the published Quartz file index, including folders, notebook routes,
frontmatter aliases, and actual heading IDs. Explicit paths disambiguate names;
a same-folder match wins for duplicate basenames. Missing, unpublished, or still
ambiguous targets render as unresolved text instead of guessed root links.

Supported additions to native marimo Markdown:

- `[[Note]]`, `[[Note.md]]`, `[[Folder/Note#Heading|Display]]`, nested heading
  paths, `[[#Heading]]`, and `[[Note#^block-id]]`.
- Standard Markdown note links with URL-encoded paths and fragments.
- `![[image.png|widthxheight]]`, audio/video, PDF page fragments, and published
  note/heading/block embeds. Note embeds fetch the rendered page, rebase its links,
  and refresh when their reactive target changes; failed fetches retain a link.
- `==highlights==`, inline/multiline `%%comments%%`, inline footnotes, block IDs,
  nested callouts, and `+`/`-` folding. Callout titles support Markdown.
- Mermaid fences through marimo's diagram renderer. Native tables, tasks, math,
  fenced code, and reference footnotes remain available. Obsidian custom task
  markers count as completed tasks; clicking a published task does not edit notes.

Escaped syntax and code examples stay literal, including escaped wikilink pipes
inside tables. The parser is an extension of marimo's native Markdown renderer;
`mo.md` still returns its native object with its original Markdown source.

The compiler inserts one hidden setup cell and an explicit dependency from every
notebook cell. Static previews and Pyodide execute the same transformed cells.
`obsidian.py` is bundled with that setup cell, so no extra browser Python package
or server is required. The bridge uses private parser/generator APIs in the pinned
marimo **0.23.9**; re-run all checks when upgrading.

Boundaries: this is published Markdown compatibility, not an Obsidian plugin
runtime. Dataview, search queries, Bases/Canvas content within Markdown, properties
editing, and Vault-wide autocomplete are not implemented here. Notebook embeds
remain links to avoid mounting a second Pyodide notebook. Embedding recursion is
bounded to four levels. Footnote definitions and duplicate-heading numbering are
scoped to each `mo.md` call; use distinct headings or explicit block IDs across
cells. Links created only at runtime do not add static graph/backlink edges.

Validation:

```sh
node --test plugins/ewan-marimo.test.js plugins/ewan-custom-plugins.test.js
npm run probe:markdown
MARIMO_PYTHON="$PWD/.venv-marimo/bin/python" npm run build
```

The browser probe builds both a preview and a deferred notebook, changes a real
slider, and checks link paths, heading/block embeds, callout folding, and literal
code. It uses Chrome and the pinned CDN/Pyodide runtime.

Syntax reference: [Obsidian formatting](https://obsidian.md/help/syntax),
[links](https://obsidian.md/help/links), [embeds](https://obsidian.md/help/embeds),
[callouts](https://obsidian.md/help/callouts), and
[advanced formatting](https://obsidian.md/help/advanced-syntax).
