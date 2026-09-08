import assert from "node:assert/strict"
import puppeteer from "puppeteer-core"
import { createMarimoLoader } from "../plugins/ewan-marimo-resources/index.js"

const origin = process.env.EIGENFISH_ORIGIN ?? "http://localhost:8080"
const targetPath = "/thoughts/eigenfish.html"
const consoleErrors = []
const pageErrors = []
const failedRequests = []

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
  protocolTimeout: 600_000,
  defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
})

try {
  // Exercise loader states independently of CDN timing. A running cell must
  // never count as ready, and leaving a notebook must release page resources.
  const fixture = await browser.newPage()
  await fixture.setRequestInterception(true)
  fixture.on("request", (request) =>
    request.respond({
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      contentType: request.resourceType() === "stylesheet" ? "text/css" : "application/javascript",
      body: "",
    }),
  )
  await fixture.setContent(
    '<div class="marimo-notebook-page" data-marimo-state="loading"><span class="marimo-loading-text"></span><marimo-island data-reactive="true" data-status="running"></marimo-island><marimo-island data-reactive="true" data-status="idle"></marimo-island></div>',
  )
  await fixture.addScriptTag({ content: createMarimoLoader([]) })
  assert.equal(
    await fixture.$eval(".marimo-notebook-page", (e) => e.dataset.marimoState),
    "loading",
  )
  await fixture.$eval('marimo-island[data-status="running"]', (e) => (e.dataset.status = "idle"))
  await fixture.waitForFunction(
    () => document.querySelector(".marimo-notebook-page").dataset.marimoState === "ready",
  )
  await fixture.evaluate(() => {
    document.querySelector(".marimo-notebook-page").remove()
    window.__ewanMarimoLoader.ensure()
  })
  assert.equal(await fixture.evaluate(() => window.__MARIMO_EXPORT_CONTEXT__), undefined)
  assert.equal(await fixture.$eval("link[data-ewan-marimo-css]", (e) => e.disabled), true)
  await fixture.close()

  const page = await browser.newPage()
  page.on("console", (message) => {
    if (message.type() === "error" && consoleErrors.length < 50) {
      consoleErrors.push(message.text())
    }
  })
  page.on("pageerror", (error) => pageErrors.push(error.message))
  page.on("requestfailed", (request) => {
    if (!request.url().startsWith("https://giscus.app/")) {
      failedRequests.push(`${request.url()}: ${request.failure()?.errorText ?? "failed"}`)
    }
  })

  await page.goto(origin, { waitUntil: "domcontentloaded", timeout: 60_000 })
  await page.waitForFunction(() => typeof window.spaNavigate === "function", {
    timeout: 30_000,
  })
  await page.evaluate(() => {
    window.__eigenfishSpaSentinel = crypto.randomUUID()
    window.__eigenfishProbeStarted = performance.now()
    window.spaNavigate(new URL("/thoughts/eigenfish.html", window.location.href))
  })

  await page.waitForFunction(
    () =>
      location.pathname.endsWith("/thoughts/eigenfish.html") &&
      document
        .querySelector(".eigenfish-figure img")
        ?.getAttribute("src")
        ?.startsWith("data:image/png"),
    { timeout: 60_000, polling: 100 },
  )
  const previewMs = await page.evaluate(() => performance.now() - window.__eigenfishProbeStarted)

  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("marimo-matrix")].filter(
        (matrix) => (matrix.shadowRoot?.innerHTML?.length ?? 0) > 200,
      ).length === 2,
    { timeout: 300_000, polling: 500 },
  )
  await page.waitForFunction(
    () => document.querySelector(".marimo-notebook-page")?.dataset.marimoState === "ready",
    { timeout: 300_000, polling: 500 },
  )

  const state = await page.evaluate(() => {
    const notebook = document.querySelector(".marimo-notebook-page")
    const matrices = [...document.querySelectorAll("marimo-matrix")]
    const conradi = [...document.querySelectorAll("a")].find(
      (anchor) => anchor.textContent?.trim() === "Simone Conradi",
    )
    const resources = performance.getEntriesByType("resource")
    const resource = (fragment) => resources.find((entry) => entry.name.includes(fragment)) ?? null
    const describe = (entry) =>
      entry && {
        durationMs: Math.round(entry.duration),
        transferBytes: entry.transferSize,
        decodedBytes: entry.decodedBodySize,
      }
    return {
      url: location.href,
      spaSentinelSurvived: typeof window.__eigenfishSpaSentinel === "string",
      navigationEntries: performance.getEntriesByType("navigation").length,
      readyMs: Math.round(performance.now() - window.__eigenfishProbeStarted),
      marimoState: notebook?.dataset.marimoState,
      runtime: notebook?.dataset.marimoRuntime,
      compiler: notebook?.dataset.marimoVersion,
      matrices: matrices.length,
      hydratedMatrices: matrices.filter(
        (matrix) => (matrix.shadowRoot?.innerHTML?.length ?? 0) > 200,
      ).length,
      visibleMatrices: matrices.filter((matrix) => matrix.getBoundingClientRect().height > 80)
        .length,
      conradiText: conradi?.textContent?.trim(),
      conradiHref: conradi?.getAttribute("href"),
      conradiResolvedHref: conradi?.href,
      literalWikilinkVisible: document.body.innerText.includes("[[Simone Conradi]]"),
      staticPreviewVisible:
        (document.querySelector(".eigenfish-figure img")?.getBoundingClientRect().height ?? 0) >
        200,
      runtimeResource: describe(resource("@marimo-team/islands@0.23.9/dist/main.js")),
      workerResource: describe(resource("worker-ip3AI_sN.js")),
      pyodideResource: describe(resource("pyodide.asm.wasm")),
      bodyHeight: document.body.scrollHeight,
    }
  })

  assert.equal(state.spaSentinelSurvived, true, "SPA navigation reloaded the browsing context")
  assert.equal(state.navigationEntries, 1, "SPA navigation created another document navigation")
  assert.equal(state.marimoState, "ready")
  assert.equal(state.runtime, "0.23.9")
  assert.equal(state.compiler, "0.23.9")
  assert.equal(state.matrices, 2)
  assert.equal(state.hydratedMatrices, 2)
  assert.equal(state.visibleMatrices, 2)
  assert.equal(state.conradiText, "Simone Conradi")
  assert.match(state.conradiResolvedHref ?? "", /\/thoughts\/simone-conradi$/)
  assert.equal(state.literalWikilinkVisible, false)
  assert.equal(state.staticPreviewVisible, true)
  assert.deepEqual(pageErrors, [])
  assert.deepEqual(failedRequests, [])

  await page.screenshot({ path: "/tmp/eigenfish-desktop.png", fullPage: true })

  // Use a fresh mobile document: Quartz computes responsive sidebar state at
  // startup, so merely resizing the already-scrolled desktop probe is not a
  // faithful phone test.
  const mobilePage = await browser.newPage()
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  await mobilePage.goto(`${origin}${targetPath}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  })
  await mobilePage.waitForFunction(
    () => document.querySelector(".marimo-notebook-page")?.dataset.marimoState === "ready",
    { timeout: 300_000, polling: 500 },
  )
  const mobileState = await mobilePage.evaluate(() => {
    const matrices = [...document.querySelectorAll("marimo-matrix")].map((matrix) => {
      const rect = matrix.getBoundingClientRect()
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }
    })
    return {
      matrices,
      viewportWidth: document.documentElement.clientWidth,
      notebookWidth: document.querySelector(".marimo-notebook-page")?.getBoundingClientRect().width,
      controls: [...document.querySelectorAll("marimo-dropdown, marimo-slider")].filter(
        (control) => control.getBoundingClientRect().height > 10,
      ).length,
    }
  })
  assert.equal(mobileState.matrices.length, 2)
  assert.equal(mobileState.controls, 4)
  assert.ok(
    mobileState.matrices.every(
      (matrix) => matrix.left >= 0 && matrix.right <= mobileState.viewportWidth + 1,
    ),
    `a matrix overflows the mobile viewport: ${JSON.stringify(mobileState)}`,
  )
  assert.ok(
    mobileState.matrices[1].top >= mobileState.matrices[0].bottom,
    "mobile matrices did not stack vertically",
  )
  const mobileArticle = await mobilePage.$("article")
  assert.ok(mobileArticle, "mobile article was not rendered")
  await mobileArticle.screenshot({ path: "/tmp/eigenfish-mobile.png" })
  await mobilePage.close()

  console.log(
    JSON.stringify(
      {
        ...state,
        staticPreviewMs: Math.round(previewMs),
        mobile: mobileState,
        consoleErrors,
        pageErrors,
        failedRequests,
        screenshots: ["/tmp/eigenfish-desktop.png", "/tmp/eigenfish-mobile.png"],
      },
      null,
      2,
    ),
  )
} catch (error) {
  console.error(JSON.stringify({ consoleErrors, pageErrors, failedRequests }, null, 2))
  throw error
} finally {
  await browser.close()
}
