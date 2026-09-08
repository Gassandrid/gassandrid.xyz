import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
const root = path.resolve(process.argv[2] ?? "public"),
  read = (f) => fs.readFileSync(path.join(root, f), "utf8"),
  exists = (f) => fs.existsSync(path.join(root, f))
function standardShell(html, title) {
  assert.match(html, new RegExp(`<h1 class="article-title">${title}</h1>`))
  assert.match(html, /<article class="popover-hint/)
  assert.match(html, /markdown-preview-view markdown-rendered/)
  assert.match(html, /class="breadcrumb-container"/)
}
const index = read("index.html")
assert.match(index, /id="neural-canvas"/)
assert.match(index, /data-ewan-telemetry-anchor/)
assert.match(index, /class="florilegium-banner"/)
assert.match(index, /<img src="\.\/attachments\/florilegium-banner\.svg"[^>]+alt="Sailing boats/)
assert.doesNotMatch(index, /<object[^>]+data="\.\/attachments\/florilegium-banner\.svg"/)
assert.ok(exists("attachments/florilegium-banner.svg"))
assert.doesNotMatch(index, /<h1 class="article-title"|class="content-meta"|class="tags"/)
assert.doesNotMatch(index, /note-properties|metadata-properties/)
assert.doesNotMatch(index, /<script[^>]+(?:pyodide|codemirror|d3(?:\.min)?\.js|morris-lecar\.js)/i)
assert.doesNotMatch(index, /<link[^>]+@marimo-team\/islands/i)
assert.match(index, /property="og:image" content="https:\/\/ewan\.my\/index-og-image\.webp"/)
assert.ok(exists("index-og-image.webp"))
const referenceArticle = read("thoughts/on-capturing-personal-data.html")
standardShell(referenceArticle, "On Capturing Personal Data")
assert.match(referenceArticle, /class="quartztoc"/)
assert.match(referenceArticle, /data-for="__top__"/)
assert.doesNotMatch(referenceArticle, /class="toc"|note-properties|metadata-properties/)
assert.match(referenceArticle, /fonts\.googleapis\.com\/css2\?family=Lora/)
assert.match(referenceArticle, /on-capturing-personal-data-og-image\.webp/)
assert.ok(exists("thoughts/on-capturing-personal-data-og-image.webp"))
const citationArticle = read("thoughts/computational-neuroscience.html")
standardShell(citationArticle, "Computational Neuroscience")
assert.match(
  citationArticle,
  /<cite[^>]*id="citation--pathakbiomimeticmodelcorticostriatal2024--1"[^>]*>\(<a href="#bib-pathakbiomimeticmodelcorticostriatal2024"[^>]*data-no-popover="true"[^>]*data-bib="true">Pathak et al\., 2024<\/a>\)<\/cite>/,
)
assert.match(citationArticle, /id="bib-pathakbiomimeticmodelcorticostriatal2024"/)
assert.match(citationArticle, /<section class="bibliography" data-references/)
assert.match(citationArticle, /<h2 id="reference-label">Bibliography<\/h2>/)
assert.match(citationArticle, /<ul>\s*<li class="csl-entry"/)
assert.match(citationArticle, /class="csl-external-link"/)
assert.doesNotMatch(citationArticle, /<div class="references"/)
const curationBase = read("a-limited-curation.base.html")
assert.match(curationBase, /<h1 class="article-title">A Limited Curation<\/h1>/)
assert.equal((curationBase.match(/class="base-card"/g) ?? []).length, 14)
assert.equal((curationBase.match(/class="base-card-image-link/g) ?? []).length, 14)
assert.equal((curationBase.match(/class="base-card-title-link"/g) ?? []).length, 14)
assert.equal((curationBase.match(/background-size:contain/g) ?? []).length, 14)
assert.match(curationBase, /class="base-card-group-header">\(empty\)<\/h3>/)
assert.doesNotMatch(curationBase, /<a[^>]+class="[^"]*\bbases-card\b[^"]*"/)
const postscriptPath = index.match(/src="\.\/(postscript(?:-[^"]+)?\.js)"/)?.[1]
assert.ok(postscriptPath, "expected the generated page to reference a postscript bundle")
const postscript = read(postscriptPath)
const importedScripts = [...postscript.matchAll(/import\("\.\/(.+?\.js)"\)/g)].map((match) =>
  read(match[1]),
)
assert.match([postscript, ...importedScripts].join("\n"), /\.base\(\?:\\\/index\)\?\$/)
const python = read("notes/programming/testing-in-languages.html")
standardShell(python, "Testing In Languages")
assert.match(python, /data-python-run=/)
assert.doesNotMatch(python, /<script[^>]+(?:pyodide|codemirror)/i)
const chart = read("thoughts/chart-demo.html")
assert.match(chart, /data-chart-config=/)
assert.doesNotMatch(chart, /<script[^>]+d3(?:\.min)?\.js/i)
const compounds = read("notes/neuropharmacology/nootropic-compounds.base.html")
assert.ok(
  (compounds.match(/class="base-card"/g) ?? []).length > 0,
  "Compound Base must not silently render empty",
)
const eigenfish = read("thoughts/eigenfish.html")
assert.match(eigenfish, /data-marimo-runtime="0\.23\.9"/)
assert.match(eigenfish, /eigenfish-figure/)
assert.match(eigenfish, /marimo-matrix/)

let marimoPagesProbed = 0
for (const [file, title, islands] of [
  ["notes/programming/marimo-test.html", "Marimo Islands Test", 5],
  ["notes/programming/marimo-widgets.html", "Marimo Widgets Smoke Test", 7],
]) {
  if (!exists(file)) continue
  const html = read(file)
  standardShell(html, title)
  assert.match(html, /class="popover-hint marimo-page"/)
  assert.match(html, /data-marimo-runtime="0\.23\.9"/)
  assert.match(html, /data-marimo-version="0\.23\.9"/)
  assert.match(html, new RegExp(`data-marimo-islands="${islands}"`))
  assert.equal((html.match(/<marimo-island\b/g) ?? []).length, islands)
  marimoPagesProbed += 1
}
const showcasePath = "notes/programming/marimo-wigglystuff-showcase.html"
if (exists(showcasePath)) {
  const showcase = read(showcasePath)
  standardShell(showcase, "The Reactive Garden — Marimo × WigglyStuff")
  assert.match(showcase, /class="popover-hint marimo-page"/)
  assert.match(showcase, /data-marimo-runtime="0\.23\.9"/)
  assert.match(showcase, /data-marimo-version="0\.23\.9"/)
  assert.match(showcase, /data-showcase-hero/)
  assert.match(showcase, /data-component-coverage/)
  assert.match(showcase, /WigglyStuff 0\.5\.21 export/)
  assert.match(showcase, /WIGGLY_COMPONENTS/)
  assert.ok(
    (showcase.match(/<marimo-island\b/g) ?? []).length >= 25,
    "showcase emitted too few Marimo islands",
  )
  marimoPagesProbed += 1
}
const legacyNotesRoot = path.join(root, "Notes")
if (fs.readdirSync(root).includes("Notes")) {
  const legacyRedirects = []
  const collectRedirects = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const target = path.join(dir, entry.name)
      if (entry.isDirectory()) collectRedirects(target)
      else legacyRedirects.push(target)
    }
  }
  collectRedirects(legacyNotesRoot)
  assert.ok(legacyRedirects.length > 0)
  for (const redirect of legacyRedirects) {
    assert.equal(path.extname(redirect), ".html")
    const html = fs.readFileSync(redirect, "utf8")
    assert.match(html, /<link rel="canonical" href="[^"]+">/)
    assert.match(html, /<meta name="robots" content="noindex">/)
    assert.match(html, /<meta http-equiv="refresh" content="0; url=[^"]+">/)
  }
}
const gaggi = read("pages/gaggimate-extractions.html")
standardShell(gaggi, "GaggiMate Extractions")
assert.match(gaggi, /data-calplot=/)
assert.ok(exists("static/data/gaggimate-calendar.json"))
const morris = read("pages/morris-lecar.html")
standardShell(morris, "Morris-Lecar Phase Plane")
assert.match(morris, /data-frame="full-width"/)
for (const id of ["phase-canvas", "ts-canvas", "bifurc-canvas", "sidebar"])
  assert.match(morris, new RegExp(`id="${id}"`))
assert.doesNotMatch(morris, /<script[^>]+morris-lecar\.js/i)
assert.ok(exists("static/js/morris-lecar.js"))
const htmlFiles = []
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith(".html")) htmlFiles.push(p)
  }
}
walk(root)
const tikzPages = htmlFiles.filter((f) => /tikzjax|tikz-container/.test(fs.readFileSync(f, "utf8")))
assert.ok(
  tikzPages.length >= 10,
  `expected at least 10 TikZ-bearing pages, found ${tikzPages.length}`,
)
console.log(
  `Build probe passed: ${htmlFiles.length} HTML pages, ${tikzPages.length} TikZ pages, ${marimoPagesProbed} optional Marimo fixtures, v4 layout and Bases card parity, graph hygiene, RunPython, charts, GaggiMate, Morris-Lecar, telemetry, and adaptive neural background.`,
)
