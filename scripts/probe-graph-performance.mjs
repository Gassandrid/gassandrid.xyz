import assert from "node:assert/strict"
import puppeteer from "puppeteer-core"

const origin = process.env.QUARTZ_PROBE_URL ?? "http://127.0.0.1:8196"
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox"],
})
const report = {}
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 900 })
    await page.setCacheEnabled(false)
    const errors = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.evaluateOnNewDocument(() => {
      window.__graphDraws = 0
      const request = window.requestAnimationFrame
      const graphCallbacks = new WeakMap()
      window.requestAnimationFrame = (callback) => {
        if (!graphCallbacks.has(callback)) {
          graphCallbacks.set(callback, callback.toString().includes("updatePositions()"))
        }
        if (graphCallbacks.get(callback)) window.__graphDraws++
        return request.call(window, callback)
      }
    })
    await page.goto(new URL("/thoughts/on-capturing-personal-data.html", origin).href, {
      waitUntil: "networkidle0",
      timeout: 60_000,
    })
    const resources = () =>
      page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .filter((resource) => /\/d3@|\/pixi\.js@/.test(resource.name))
          .map((resource) => ({
            url: resource.name,
            encodedBytes: resource.encodedBodySize,
            decodedBytes: resource.decodedBodySize,
          })),
      )

    if (width === 390) {
      assert.deepEqual(await resources(), [], "hidden mobile graph fetched drawing libraries")
      assert.equal(await page.$$eval(".graph canvas", (canvases) => canvases.length), 0)
      await page.setViewport({ width: 1440, height: 900 })
      await page.waitForSelector(".graph-container canvas", { timeout: 30_000 })
      report.mobile = { coldGraphRequests: 0, resizeLoadsGraph: true }
    } else {
      await page.waitForSelector(".graph-container canvas", { timeout: 30_000 })
      await pause(6500)
      const settledDraws = await page.evaluate(() => window.__graphDraws)
      assert.ok(settledDraws > 0, "production graph draw instrumentation did not run")
      await pause(1500)
      const idleDraws = await page.evaluate(() => window.__graphDraws)
      assert.equal(idleDraws, settledDraws, "settled graph kept requesting animation frames")
      const loaded = await resources()
      assert.ok(loaded.some((resource) => /pixi\.min\.js$/.test(resource.url)))
      report.desktop = {
        libraries: loaded,
        settledDraws,
        drawsDuringIdle: idleDraws - settledDraws,
      }
    }

    await page.click(".global-graph-icon")
    await page.waitForSelector(".global-graph-container canvas", { timeout: 30_000 })
    await page.keyboard.press("Escape")
    assert.equal(
      await page.$eval(".global-graph-outer", (el) => el.classList.contains("active")),
      false,
    )
    await page.evaluate(() => {
      window.__graphProbeDocument = true
      return window.spaNavigate(new URL("/thoughts/computational-neuroscience.html", location.href))
    })
    await page.waitForFunction(() => document.title.includes("Computational Neuroscience"))
    await page.waitForSelector(".graph-container canvas", { timeout: 30_000 })
    assert.equal(await page.evaluate(() => window.__graphProbeDocument), true)
    assert.equal(await page.$$eval(".graph canvas", (canvases) => canvases.length), 1)
    assert.deepEqual(errors, [], `graph page errors at width ${width}`)
    await page.close()
  }
} finally {
  await browser.close()
}

console.log(JSON.stringify(report, null, 2))
