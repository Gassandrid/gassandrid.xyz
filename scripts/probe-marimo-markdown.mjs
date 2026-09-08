import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { createServer } from "node:http"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import puppeteer from "puppeteer-core"
import { createMarimoLoader } from "../plugins/ewan-marimo-resources/index.js"

const python = process.env.MARIMO_PYTHON ?? ".venv-marimo/bin/python"
const files = [
  { path: "Thoughts/Demo.marimo.py", slug: "thoughts/demo" },
  { path: "People/Conradi.md", slug: "people/conradi" },
  { path: "Thoughts/Local.md", slug: "thoughts/local" },
]
function compile(staticPreview) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "marimo-markdown-probe-"))
  const notebook = path.join(scratch, "markdown.marimo.py")
  fs.copyFileSync("plugins/ewan-marimo/fixtures/markdown.marimo.py", notebook)
  let result
  try {
    result = spawnSync(python, ["plugins/ewan-marimo/render.py", notebook], {
      input: JSON.stringify({
        staticPreview,
        markdownContext: { currentSlug: "thoughts/demo", files },
      }),
      encoding: "utf8",
      timeout: 120000,
    })
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true })
  }
  assert.equal(result.status, 0, result.stderr)
  const output = JSON.parse(result.stdout.trim().split("\n").at(-1))
  assert.equal(output.error, undefined)
  return output
}
const preview = compile(true)
assert.ok(
  preview.body.includes("../people/conradi#details"),
  "preview resolves interpolated wikilinks",
)
const reactive = compile(false)
const pages = new Map()
for (const [mode, output] of [
  ["preview", preview],
  ["reactive", reactive],
]) {
  pages.set(
    `/thoughts/${mode}.html`,
    `<!doctype html><body><article><div class="marimo-notebook-page">${output.body}</div></article><script>${createMarimoLoader([])}</script></body>`,
  )
}
for (const route of ["/people/conradi", "/thoughts/local"]) {
  pages.set(
    route,
    `<article><h1>Source note</h1><h2 id="details">Details</h2><p>Embedded ${route} <a href="#note-block">Block</a></p><h2 id="stop">Excluded heading</h2><p id="note-block">Block ${route}</p></article>`,
  )
}
const server = createServer((req, res) => {
  const body = pages.get(req.url)
  res.writeHead(body ? 200 : 404, { "Content-Type": "text/html" })
  res.end(body ?? "Not found")
})
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
const origin = `http://127.0.0.1:${server.address().port}`
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox"],
  protocolTimeout: 240000,
})
try {
  for (const mode of ["preview", "reactive"]) {
    const page = await browser.newPage()
    const errors = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.goto(`${origin}/thoughts/${mode}.html`, { waitUntil: "domcontentloaded" })
    await page.waitForFunction(
      () => document.querySelector(".marimo-notebook-page")?.dataset.marimoState === "ready",
      { timeout: 180000 },
    )
    await page
      .waitForFunction(() => document.querySelectorAll('[data-embed-state="ready"]').length === 2)
      .catch(async (error) => {
        console.log(
          JSON.stringify(
            await page.evaluate(() => ({
              errors: [...document.querySelectorAll("marimo-island")].map((e) => e.dataset.status),
              output: [...document.querySelectorAll("marimo-cell-output")].map((e) =>
                e.innerHTML.slice(0, 12000),
              ),
              shadows: [...document.querySelectorAll("*")]
                .filter((e) => e.shadowRoot)
                .map((e) => ({ tag: e.tagName, html: e.shadowRoot.innerHTML.slice(0, 6000) })),
            })),
            null,
            2,
          ),
        )
        throw error
      })
    assert.equal(
      await page.$eval("a[data-obsidian-resolved]", (a) => a.getAttribute("href")),
      "../people/conradi#details",
    )
    assert.match(
      await page.$eval("details summary", (el) => el.innerHTML),
      /<strong>Reactive callout<\/strong>/,
    )
    assert.equal(await page.$eval("details", (el) => el.open), false)
    await page.click("details summary")
    assert.equal(await page.$eval("details", (el) => el.open), true)
    assert.equal(await page.$eval("pre.text-xs", (el) => el.textContent), "[[Conradi]]")
    assert.equal(await page.$eval("code", (el) => el.textContent), "[[Code stays literal]]")
    assert.equal(
      await page.$eval("[data-obsidian-embed]", (el) =>
        el.textContent.includes("Excluded heading"),
      ),
      false,
    )
    assert.equal(
      await page.$eval("[data-obsidian-embed] a", (a) => a.href),
      `${origin}/people/conradi#note-block`,
    )
    const slider = await page.$("marimo-slider")
    const control = await slider.evaluateHandle((el) =>
      el.shadowRoot.querySelector('[role="slider"], input[type="range"]'),
    )
    assert.ok(control.asElement(), "slider control hydrated")
    await control.asElement().focus()
    await page.keyboard.press("ArrowRight")
    await page.waitForFunction(
      () =>
        document.querySelector("a[data-obsidian-resolved]")?.getAttribute("href") ===
        "../thoughts/local#details",
      { timeout: 30000 },
    )
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("[data-obsidian-embed]")).every(
        (el) => el.dataset.embedState === "ready" && el.textContent.includes("/thoughts/local"),
      ),
    )
    assert.match(await page.$eval("details mark", (el) => el.textContent), /Value 1/)
    assert.deepEqual(errors, [])
    const href = await page.$eval("a[data-obsidian-resolved]", (a) => a.href)
    assert.equal((await fetch(href)).status, 200)
    await page.click("a[data-obsidian-resolved]")
    await page.waitForFunction(
      () => location.pathname === "/thoughts/local" && location.hash === "#details",
    )
    assert.equal(await page.$eval(":target", (el) => el.textContent), "Details")
    console.log(
      `${mode}: correct routes, headings, block embeds, folding, literal code, and live slider Markdown updates`,
    )
    await page.close()
  }
} finally {
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
}
