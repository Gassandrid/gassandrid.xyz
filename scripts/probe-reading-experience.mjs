import assert from "node:assert/strict"
import fs from "node:fs"
import puppeteer from "puppeteer-core"

const origin = process.env.QUARTZ_PROBE_URL ?? "http://localhost:8195"
const screenshots = process.env.QUARTZ_SCREENSHOT_DIR ?? "/tmp/ewan-reading"
fs.mkdirSync(screenshots, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
})
const result = {},
  errors = []
try {
  const page = await browser.newPage()
  page.on("pageerror", (error) => errors.push(error.message))
  await page.setViewport({ width: 1440, height: 1000 })
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }])
  await page.goto(`${origin}/thoughts/on-capturing-personal-data.html`, {
    waitUntil: "networkidle0",
  })
  await page.evaluate(async () => {
    await document.fonts.ready
    scrollTo(0, 0)
  })
  await page.waitForFunction(() =>
    document.querySelector(".toc-row")?.style.getPropertyValue("--toc-y"),
  )
  const layout = () =>
    page.evaluate(() => {
      const rows = [...document.querySelectorAll(".toc-row.label-visible .toc-link")].map((e) => {
        const r = e.getBoundingClientRect()
        return { top: r.top, bottom: r.bottom }
      })
      rows.sort((a, b) => a.top - b.top)
      const explorer = document.querySelector(".sidebar.right .explorer")
      return {
        rows: document.querySelectorAll(".toc-row").length,
        labels: rows.length,
        collisions: rows.slice(1).filter((row, i) => row.top < rows[i].bottom + 5).length,
        scrollHeight: document.querySelector(".quartztoc-track").scrollHeight,
        viewport: document.querySelector(".quartztoc-track").clientHeight,
        explorerBackground: getComputedStyle(explorer).backgroundColor,
        fontLoaded: document.fonts.check('14px "ewanfont"'),
        current: document.querySelectorAll('.toc-link[aria-current="location"]').length,
        overflow: document.documentElement.scrollWidth > innerWidth,
      }
    })
  await page.waitForFunction(() => document.querySelector("#neural-canvas")?.dataset.neuralDrawMs, {
    timeout: 20_000,
  })
  result.flow = await page.$eval("#neural-canvas", (e) => ({
    quality: e.dataset.neuralQuality,
    drawMs: Number(e.dataset.neuralDrawMs),
  }))
  assert.ok(result.flow.drawMs < 12)
  const backlinks = await page.$eval(".sidebar.right .backlinks", (e) => ({
    clipped: e.scrollHeight > e.clientHeight + 1,
    links: e.querySelectorAll("a").length,
  }))
  assert.equal(backlinks.clipped, false, "Explorer squeezed the backlinks panel")
  result.desktop = await layout()
  assert.equal(result.desktop.collisions, 0)
  assert.equal(result.desktop.current, 1)
  assert.equal(result.desktop.overflow, false)
  assert.equal(result.desktop.fontLoaded, true)
  assert.notEqual(result.desktop.explorerBackground, "rgba(0, 0, 0, 0)")
  result.projection = []
  for (const fraction of [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1]) {
    await page.evaluate(
      (fraction) =>
        scrollTo({
          top: fraction * (document.documentElement.scrollHeight - innerHeight),
          behavior: "instant",
        }),
      fraction,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    const projection = await page.evaluate(() => {
      const toc = document.querySelector(".quartztoc"),
        track = toc.querySelector(".quartztoc-track").getBoundingClientRect()
      const article = document.querySelector("article").getBoundingClientRect()
      const bar = toc.querySelector(".quartztoc-rail-thumb").getBoundingClientRect()
      const header = document.querySelector(".sticky-header-bar").getBoundingClientRect()
      const top = header.top <= 1 && header.bottom > 0 ? header.bottom : 0
      const project = (offset) =>
        track.top + Math.max(0, Math.min(1, offset / article.height)) * track.height
      let maxMarkerError = 0
      const rows = [...toc.querySelectorAll(".toc-row")]
      rows.forEach((row) => {
        const h = document.getElementById(row.dataset.for)
        const expected = project(h ? h.getBoundingClientRect().top - article.top : 0)
        maxMarkerError = Math.max(
          maxMarkerError,
          Math.abs(row.getBoundingClientRect().top - expected),
        )
      })
      const active = toc.querySelector(".is-active")
      const visibleStart = Math.max(article.top, top),
        visibleEnd = Math.min(article.bottom, innerHeight)
      const center = (visibleStart + Math.max(visibleStart, visibleEnd)) / 2
      const headingPositions = rows.map(
        (row) =>
          document.getElementById(row.dataset.for)?.getBoundingClientRect().top ?? article.top,
      )
      const visible = headingPositions
        .map((y, i) => ({ y, i }))
        .filter(({ y }) => y >= visibleStart && y <= visibleEnd)
      const expectedActive = visible.length
        ? visible.toSorted((a, b) => Math.abs(a.y - center) - Math.abs(b.y - center))[0].i
        : Math.max(
            0,
            headingPositions.findLastIndex((y) => y <= center),
          )
      return {
        fraction: scrollY / (document.documentElement.scrollHeight - innerHeight),
        maxMarkerError,
        barTopError: Math.abs(bar.top - project(top - article.top)),
        barBottomError: Math.abs(bar.bottom - project(innerHeight - article.top)),
        correctActive: rows.indexOf(active) === expectedActive,
        visibleHeadings: visible.length,
        activeHeading: active.dataset.for,
      }
    })
    assert.ok(projection.maxMarkerError < 1, "Heading markers drifted from article positions")
    assert.ok(projection.barTopError < 1 && projection.barBottomError < 1, "Viewport bar drifted")
    assert.equal(projection.correctActive, true)
    result.projection.push(projection)
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (theme) => document.documentElement.setAttribute("saved-theme", theme),
      theme,
    )
    await new Promise((resolve) => setTimeout(resolve, 250))
    await page.screenshot({ path: `${screenshots}/${theme}.png` })
  }
  await page.click(".sidebar.right .desktop-explorer")
  assert.equal(
    await page.$eval(".sidebar.right .explorer-content", (e) => getComputedStyle(e).display),
    "none",
  )
  await page.click(".sidebar.right .desktop-explorer")
  assert.notEqual(
    await page.$eval(".sidebar.right .explorer-content", (e) => getComputedStyle(e).display),
    "none",
  )

  await page.evaluate(() => {
    const track = document.querySelector(".quartztoc-track"),
      article = document.querySelector("article")
    for (let i = 0; i < 80; i++) {
      const h = document.createElement("h3")
      h.id = `dense-${i}`
      h.textContent = `Nearby heading ${i}`
      article.appendChild(h)
      const row = document.createElement("div")
      row.className = "toc-row toc-level-3"
      row.dataset.for = h.id
      const a = document.createElement("a")
      a.className = "toc-link"
      a.dataset.for = h.id
      a.href = `#${h.id}`
      a.textContent = `A longer heading for collision testing and text wrapping ${i}`
      row.appendChild(a)
      track.appendChild(row)
    }
    document.dispatchEvent(new CustomEvent("nav", { detail: { url: document.body.dataset.slug } }))
  })
  await page.waitForFunction(() =>
    document.querySelector('[data-for="dense-79"]').style.getPropertyValue("--toc-y"),
  )
  await page.hover(".quartztoc")
  result.dense = await layout()
  assert.equal(result.dense.collisions, 0)
  assert.ok(
    result.dense.scrollHeight <= result.dense.viewport + 1,
    "Proportional rail became a scrolling outline",
  )
  await page.$eval('a[data-for="dense-79"]', (e) => {
    e.focus()
    e.click()
  })
  await page.waitForFunction(() => location.hash === "#dense-79")
  await page.click("#neural-controls > summary")
  await page.select("#neural-controls [data-motion]", "auto")
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
  await page.waitForFunction(
    () => document.querySelector("#neural-canvas").dataset.neuralQuality === "off",
  )
  assert.equal(await page.$eval("#neural-canvas", (e) => getComputedStyle(e).opacity), "0")
  await page.select("#neural-controls [data-motion]", "on")
  await page.waitForFunction(() => document.querySelector("#neural-canvas").dataset.neuralDrawMs, {
    timeout: 20000,
  })
  const manual = await page.$eval("#neural-canvas", (canvas) => ({
    quality: canvas.dataset.neuralQuality,
    opacity: getComputedStyle(canvas).opacity,
    painted: canvas
      .getContext("2d")
      .getImageData(0, 0, canvas.width, canvas.height)
      .data.some((value, i) => i % 4 === 3 && value > 0),
  }))
  assert.notEqual(manual.quality, "off", "Explicit On was overridden by reduced motion")
  assert.ok(Number(manual.opacity) > 0 && manual.painted, "Explicit On did not paint the canvas")
  result.manualFlow = manual
  await page.select("#neural-controls [data-motion]", "off")
  await page.waitForFunction(
    () => getComputedStyle(document.querySelector("#neural-canvas")).opacity === "0",
  )
  await page.select("#neural-controls [data-motion]", "auto")
  assert.equal(await page.$eval("#neural-canvas", (e) => e.dataset.neuralQuality), "off")
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(`${origin}/thoughts/on-capturing-personal-data.html`, {
    waitUntil: "networkidle0",
  })
  result.mobile = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    quality: document.querySelector("#neural-canvas").dataset.neuralQuality,
  }))
  assert.equal(result.mobile.overflow, false)
  assert.equal(result.mobile.quality, "off")
  await page.screenshot({ path: `${screenshots}/mobile.png` })
  await page.goto(`${origin}/notes/neuropharmacology/nootropic-compounds.base.html`, {
    waitUntil: "networkidle0",
  })
  result.compounds = await page.$$eval(".base-card", (cards) => cards.length)
  assert.ok(
    result.compounds > 20,
    `Compound Base is empty or unexpectedly small: ${result.compounds}`,
  )
  assert.deepEqual(errors, [])
  console.log(JSON.stringify(result, null, 2))
} finally {
  await browser.close()
}
