import assert from "node:assert/strict"
import test from "node:test"
import EwanCharts from "./ewan-charts/index.js"
import EwanCitations from "./ewan-citations/index.js"
import EwanFonts, { LORA_STYLESHEET } from "./ewan-fonts/index.js"
import GaggiMatePage from "./ewan-gaggimate-page/index.js"
import { patchGraphRuntime } from "./ewan-graph/components.js"
import { LorenzBackground } from "./ewan-lorenz/components.js"
import { compileObsidianLinks } from "./ewan-marimo/index.js"
import MarimoResources from "./ewan-marimo-resources/index.js"
import MorrisLecarPage from "./ewan-morris-lecar-page/index.js"
import EwanMorrisLecar from "./ewan-morris-lecar/index.js"
import EwanRunPython from "./ewan-run-python/index.js"
import { Telemetry } from "./ewan-telemetry/components.js"
import { QuartzTOC } from "./ewan-quartz-toc/components.js"
import EwanSvgEmbeds, { buildSvgIndex, resolveSvgObjects } from "./ewan-svg-embeds/index.js"

function transformCode(plugin, node) {
  const tree = { type: "root", children: [node] }
  plugin.markdownPlugins()[0]()(tree)
  return tree.children[0]
}
test("RunPython emits escaped runnable blocks and lazy runtimes", () => {
  const p = EwanRunPython({ languages: ["python-r"] })
  const r = transformCode(p, { type: "code", lang: "python-r", value: 'print("<safe>")' })
  assert.match(r.value, /data-python-run=/)
  assert.match(r.value, /&lt;safe&gt;/)
  const s = p.externalResources().js[0].script
  assert.match(s, /loadPyodideRuntime/)
  assert.match(s, /loadEditorRuntime/)
  assert.equal(p.externalResources().js[0].src, undefined)
})
test("charts and CalPlot share demand-loaded D3", () => {
  const p = EwanCharts()
  const r = transformCode(p, { type: "code", lang: "chart", value: "source: /x.json\nx: t\ny: v" })
  assert.match(r.value, /data-chart-config=/)
  const s = p.externalResources().js[0].script
  assert.match(s, /\[data-calplot\]/)
  assert.match(s, /d3@7/)
  assert.match(s, /containers\.length === 0 && calendars\.length === 0/)
})
test("Marimo assets are pinned and conditional", () => {
  const s = MarimoResources().externalResources({
    allFiles: ["Thoughts/Eigenfish.marimo.py", "Thoughts/Regular.md"],
  }).js[0].script
  assert.match(s, /\.marimo-notebook-page/)
  assert.match(s, /\/thoughts\/eigenfish/)
  assert.match(s, /modulepreload/)
  assert.match(s, /pyodide\.asm\.wasm/)
  assert.match(s, /__MARIMO_EXPORT_CONTEXT__/)
  assert.match(s, /source: exportContextSource/)
  assert.match(s, /delete window\.__MARIMO_EXPORT_CONTEXT__/)
  assert.doesNotMatch(s, /untouched/)
  assert.doesNotMatch(s, /setTimeout\(function\(\) \{[\s\S]*location\.reload[\s\S]*\}, 250\)/)
  assert.match(s, /islands@0\.23\.9/)
  assert.doesNotMatch(s, /fonts\.googleapis/)
})

test("Marimo markdown compiles Obsidian links with Quartz shortest-path semantics", () => {
  const compiled = compileObsidianLinks(
    'mo.md("Inspired by [[Simon Conradi|Conradi]] and [[Personal Canon]].")',
    "thoughts/eigenfish",
    ["thoughts/eigenfish", "people/simon-conradi", "personal-canon"],
  )
  assert.deepEqual(compiled.replacements, {
    "Simon Conradi|Conradi": { label: "Conradi", href: "../people/simon-conradi" },
    "Personal Canon": { label: "Personal Canon", href: "../personal-canon" },
  })
  assert.deepEqual(compiled.links, ["people/simon-conradi", "personal-canon"])
})
test("custom pages expose canonical slugs and frames", () => {
  const g = GaggiMatePage(),
    m = MorrisLecarPage()
  assert.equal(g.generate()[0].slug, "pages/gaggimate-extractions")
  assert.equal(g.layout, "content")
  assert.equal(m.generate()[0].slug, "pages/morris-lecar")
  assert.equal(m.frame, "full-width")
})
test("expensive runtimes are guarded", () => {
  assert.match(EwanMorrisLecar().externalResources().js[0].script, /phase-canvas/)
  const l = LorenzBackground()
  assert.match(l.afterDOMLoaded, /prefers-reduced-motion/)
  assert.match(l.afterDOMLoaded, /deviceMemory/)
  assert.match(l.afterDOMLoaded, /hardwareConcurrency/)
  assert.match(Telemetry().afterDOMLoaded, /data-ewan-telemetry/)
})

test("v4 typography and proportional TOC remain available", () => {
  assert.equal(EwanFonts().externalResources().css[0].content, LORA_STYLESHEET)
  assert.match(LORA_STYLESHEET, /Lora:ital,wght/)
  const toc = QuartzTOC()
  assert.match(toc.css, /quartztoc-rail-thumb/)
  assert.match(toc.afterDOMLoaded, /--toc-y/)
})

test("citations retain the v4 bibliography structure and external-link labels", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "span",
        properties: { id: "citation--paper--1" },
        children: [
          {
            type: "element",
            tagName: "a",
            properties: { href: "#bib-paper" },
            children: [{ type: "text", value: "Paper, 2026" }],
          },
        ],
      },
      {
        type: "element",
        tagName: "div",
        properties: { className: ["references"], role: "doc-bibliography" },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["csl-entry"], id: "bib-paper" },
            children: [
              {
                type: "text",
                value: "E. Author (2026). A paper. https://arxiv.org/abs/2401.01234v2",
              },
            ],
          },
        ],
      },
    ],
  }

  for (const transformer of EwanCitations().htmlPlugins()) transformer()(tree)

  assert.equal(tree.children[0].tagName, "cite")
  assert.equal(tree.children[0].children[0].properties["data-bib"], true)
  assert.equal(tree.children[0].children[0].properties["data-no-popover"], true)
  assert.equal(tree.children[1].tagName, "section")
  assert.deepEqual(tree.children[1].properties.className, ["bibliography"])
  assert.equal(tree.children[1].children[0].tagName, "h2")
  assert.equal(tree.children[1].children[0].children[0].value, "Bibliography")
  assert.equal(tree.children[1].children[1].children[0].tagName, "li")
  assert.match(JSON.stringify(tree.children[1]), /arXiv preprint arXiv:2401\.01234/)
  assert.match(JSON.stringify(tree.children[1]), /\[arXiv\]/)
})

test("Obsidian SVG embeds resolve unique attachment basenames", () => {
  const index = buildSvgIndex([
    "attachments/florilegium-banner.svg",
    "attachments/other.svg",
    "duplicates/other.svg",
  ])
  assert.equal(index.get("florilegium-banner.svg"), "attachments/florilegium-banner.svg")
  assert.equal(index.has("other.svg"), false)
  assert.equal(
    resolveSvgObjects(
      '<object data="florilegium-banner.svg" type="image/svg+xml"></object>',
      "index",
      index,
    ),
    '<object data="./attachments/florilegium-banner.svg" type="image/svg+xml"></object>',
  )
  assert.equal(EwanSvgEmbeds().name, "EwanSvgEmbeds")
})

test("graph compatibility patch excludes .base nodes", () => {
  const original = "before for(var Ju in Ku)eu.set(Fu(Ju),Ku[Ju]) after"
  const patched = patchGraphRuntime(original)
  assert.match(patched, /\\\.base/)
  assert.match(patched, /continue/)
  assert.throws(() => patchGraphRuntime("changed upstream"), /runtime changed/)
})
