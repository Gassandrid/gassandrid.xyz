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
npm --prefix private/tooling run probe:markdown
MARIMO_PYTHON="$PWD/.venv-marimo/bin/python" npm run build
```

The browser probe builds both a preview and a deferred notebook, changes a real
slider, and checks link paths, heading/block embeds, callout folding, and literal
code. It uses Chrome and the pinned CDN/Pyodide runtime.

Syntax reference: [Obsidian formatting](https://obsidian.md/help/syntax),
[links](https://obsidian.md/help/links), [embeds](https://obsidian.md/help/embeds),
[callouts](https://obsidian.md/help/callouts), and
[advanced formatting](https://obsidian.md/help/advanced-syntax).

## Wigglystuff and Plotly in browser Python

The islands runtime does not install arbitrary PyPI imports. The compiler now
checks actual Python imports and inserts an awaited browser-only `micropip`
bootstrap before any notebook cell runs. Imports of `wigglystuff` load
`wigglystuff==0.5.21`; imports of `plotly` load `plotly==5.24.1`. Wigglystuff brings
its AnyWidget/ipywidgets dependencies. Other notebooks incur no extra install.

The Plotly fallback matches the pinned islands renderer: Plotly 6 binary NumPy
arrays were not rendered correctly in the Lotka–Volterra page. A notebook's
PEP 723 declaration can override either UI package version; such overrides need
the same browser checks. Native scientific dependencies remain managed by
Pyodide, and marimo's own runtime version is never replaced by this bootstrap.
Local preview execution still uses the compiler environment's installed packages.

No installation cells or site-specific edits are required in the notebook.
The existing page-scoped AnyWidget export trust is retained. This supports
browser-compatible Wigglystuff widgets, including `TangleLatex`; it does not
supply local files, credentials, or hardware APIs for widgets requiring them.

`npm --prefix private/tooling run probe:lotka` compiles the actual Lotka–Volterra note into a temporary
page, verifies three hydrated equation editors and four plots, edits each linked
formula, checks synchronization and the mean-field next step, and restores the
initial parameter value. It leaves the notebook and its editor session untouched.

Authored links are the intended source for graph/backlink metadata. Reactive
link indexing is out of scope; reactive values in Markdown remain supported.

## Math and host themes

Markdown math stays on marimo's KaTeX renderer, the same rendering engine used
by ordinary Quartz notes. Plotly loads MathJax for chart labels; the resource
loader disables its automatic document scan before loading islands. Otherwise
MathJax reprocesses KaTeX's accessibility MathML and corrupts aligned equations.
Explicit MathJax chart typesetting remains available. Prose font overrides
exclude KaTeX's internal spans. Reactive `mo.md` math still renders after each
Python update.

The resource plugin bridges Quartz's initial theme and subsequent toggles into
marimo's existing host-theme observer. This adapter depends on the pinned
0.23.9 `data-vscode-theme-kind` listener and restores the previous attribute on
SPA teardown; recheck it when upgrading the runtime.

Plotly figures receive Quartz paper, text, grid and annotation colors through
the native `data-figure` input. Fresh React attribute writes are themed
synchronously before the pinned custom element reads them, avoiding an initial
white plot followed by a second themed draw on slider updates. The scoped input
adapter is restored on SPA teardown; DOM observers still cover initial markup
and other attribute writers. Cartesian subplots are included. The original
trace data, semantic colors, axes and templates are retained, and marimo keeps
its current zoom state. New Python figures get the current palette.
Mermaid receives native theme and theme-variable inputs and rerenders its SVG.
Wigglystuff TangleLatex uses Quartz CSS variables, including dark/light parameter
accents, without recreating its model or interrupting its exact-entry editor.
These are presentation changes in the published page; the notebook keeps its
standalone theme choices. Static plot images cannot be rethemed this way.

`LOTKA_BUILT=1 npm --prefix private/tooling run probe:lotka` tests the actual
built page in Chrome: all Markdown equations, linked editors, four Plotly
figures, light/dark/light toggles, chart zoom preservation, an in-progress
editor, Mermaid colors and SPA cleanup. All console errors fail the probe.
Private scripts, screenshots and receipts stay in ignored `private/tooling/`.


## Choosing a plotting library

The pinned browser runtime supports all three common paths. A local Chrome
probe rendered Altair, Plotly and Matplotlib together and changed all three
using one Python slider. This is basic rendering/reactivity coverage, not a
claim that every backend, chart type or dependency works in WebAssembly.

- **Altair / `mo.ui.altair_chart`**: a good fit for declarative statistical plots,
  linked brushing and selections that return dataframes to Python. The native
  Vega renderer follows the bridged light/dark theme (its own palette, not an
  exact Quartz palette). Explicit chart styling can override it. Transformed
  selection data may require VegaFusion; that extra browser dependency is not
  covered by the basic probe.
- **Plotly / `mo.ui.plotly`**: a good fit for simulation traces, hover inspection,
  zoom and scientific subplots. The resource adapter supplies Quartz colors.
  Browser Python currently defaults to Plotly 5.24.1 for the pinned islands
  renderer; newer Python serialization formats need separate validation.
  Supported reactive selections are narrower than supported chart display.
- **Matplotlib**: a good fit for precise scientific figures and export. Normal
  figures redraw when Python inputs change, but their rendered image does not
  change when Quartz's theme toggles. Native selection wrappers and
  `mo.mpl.interactive` are separate modes; their WebAssembly interactions have
  not been established by this basic probe. Do not infer live recoloring of an
  image from the surrounding controls following the theme.

Keep rapid hover/brush interactions in the browser when possible. Python slider
updates rerun dependent cells for all three libraries; expensive simulations
still benefit from caching, debouncing, or an explicit run control.

Reusable standalone notebooks and efficiency guidance live in
[`templates/`](templates/README.md). Generic appearance stays in the resource
plugin: palettes are read on theme changes, repeated figure inputs reuse cached
serialization, and internal SVG redraw mutations do not trigger widget scans.
No duplicate light/dark simulation or background figure generation is added.
