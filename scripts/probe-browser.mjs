import puppeteer from "puppeteer-core"

const base = process.env.QUARTZ_PROBE_URL ?? "http://localhost:8195"
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
})

const failures = []
const results = {}

function check(condition, message) {
  if (!condition) failures.push(message)
}

async function inspect(path, readiness, viewport) {
  const page = await browser.newPage()
  if (viewport) await page.setViewport(viewport)
  const consoleErrors = []
  const pageErrors = []
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })
  page.on("pageerror", (error) => pageErrors.push(error.message))
  await page.goto(new URL(path, base).href, { waitUntil: "domcontentloaded", timeout: 60_000 })
  if (readiness) await readiness(page)
  return { page, consoleErrors, pageErrors }
}

try {
  {
    const { page, pageErrors } = await inspect(
      "/thoughts/on-capturing-personal-data.html",
      async (current) => {
        await current.waitForSelector("article .markdown-preview-view.markdown-rendered")
        await current.waitForFunction(
          () => document.querySelector("#neural-canvas")?.dataset.neuralQuality,
          { timeout: 10_000 },
        )
      },
    )
    results.markdown = await page.evaluate(() => ({
      articleWidth: Math.round(document.querySelector("article").getBoundingClientRect().width),
      breadcrumbs: document.querySelectorAll(".breadcrumb-container a").length,
      neuralQuality: document.querySelector("#neural-canvas")?.dataset.neuralQuality,
      neuralReason: document.querySelector("#neural-canvas")?.dataset.neuralReason,
      neuralControls: Boolean(document.querySelector("#neural-controls")),
      d3Loaded: Boolean(document.querySelector("script[data-ewan-d3]")),
      pyodideLoaded: Boolean(document.querySelector('script[data-ewan-runtime="pyodide"]')),
      headingStyle: (() => {
        const style = getComputedStyle(document.querySelector("h1.article-title"))
        return { color: style.color, family: style.fontFamily, size: style.fontSize }
      })(),
      paragraphStyle: (() => {
        const style = getComputedStyle(document.querySelector("article p"))
        return { color: style.color, family: style.fontFamily, size: style.fontSize }
      })(),
    }))
    check(results.markdown.breadcrumbs > 0, "standard Markdown page has no breadcrumbs")
    check(
      results.markdown.neuralQuality !== "off" ||
        /Auto paused/i.test(results.markdown.neuralReason ?? ""),
      "desktop neural background was disabled without an adaptive-client reason",
    )
    check(results.markdown.neuralControls, "desktop neural background controls were not mounted")
    check(!results.markdown.d3Loaded, "D3 loaded on a page with no chart")
    check(!results.markdown.pyodideLoaded, "Pyodide loaded on a page with no Python runner")
    check(pageErrors.length === 0, `standard Markdown page errors: ${pageErrors.join("; ")}`)
    await page.close()
  }

  {
    const { page, pageErrors } = await inspect(
      "/thoughts/on-capturing-personal-data.html",
      (current) =>
        current.waitForFunction(
          () => document.querySelector("#neural-canvas")?.dataset.neuralQuality,
          { timeout: 10_000 },
        ),
      { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    )
    results.mobile = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewport: innerWidth,
      neuralQuality: document.querySelector("#neural-canvas")?.dataset.neuralQuality,
      controlsDisplay: getComputedStyle(document.querySelector("#neural-controls")).display,
    }))
    check(results.mobile.width <= results.mobile.viewport, "mobile page overflows horizontally")
    check(
      results.mobile.neuralQuality === "low",
      "mobile neural background did not start at low quality by default",
    )
    check(results.mobile.controlsDisplay !== "none", "mobile neural background controls are hidden")
    check(pageErrors.length === 0, `mobile Markdown page errors: ${pageErrors.join("; ")}`)
    await page.close()
  }

  {
    const { page, pageErrors } = await inspect("/thoughts/eigenfish.html", async (current) => {
      await current.waitForFunction(
        () => document.querySelector(".marimo-notebook-page")?.dataset.marimoState === "ready",
        { timeout: 180_000, polling: 500 },
      )
    })
    results.marimo = await page.evaluate(() => ({
      version: document.querySelector(".marimo-notebook-page")?.dataset.marimoVersion,
      matrices: [...document.querySelectorAll("marimo-matrix")].filter(
        (e) => e.shadowRoot?.innerHTML.length > 200,
      ).length,
      preview: Boolean(document.querySelector('.eigenfish-figure img[src^="data:image/png"]')),
    }))
    check(results.marimo.version === "0.23.9", "Marimo compiler pin changed")
    check(results.marimo.matrices === 2, "Eigenfish matrix controls did not hydrate")
    check(results.marimo.preview, "Eigenfish preview is missing")
    check(pageErrors.length === 0, `Marimo page errors: ${pageErrors.join("; ")}`)
    // Verify that the notebook's global CSS and scoped export trust leave with it.
    await page.evaluate(() =>
      window.spaNavigate(new URL("/thoughts/on-capturing-personal-data.html", location.href)),
    )
    await page.waitForFunction(
      () => !document.querySelector(".marimo-notebook-page") && !window.__MARIMO_EXPORT_CONTEXT__,
    )
    check(
      await page.$eval("link[data-ewan-marimo-css]", (e) => e.disabled),
      "Marimo styles leaked onto ordinary Markdown",
    )
    await page.close()
  }

  {
    const { page, pageErrors } = await inspect(
      "/notes/programming/testing-in-languages.html",
      async (current) => {
        await current.waitForSelector("[data-python-run]")
        await current.waitForFunction(
          () =>
            Boolean(document.querySelector("[data-python-run] .CodeMirror")) ||
            getComputedStyle(document.querySelector("[data-python-run] textarea")).display !==
              "none",
          { timeout: 30_000 },
        )
      },
    )
    results.runPython = await page.evaluate(() => ({
      blocks: document.querySelectorAll("[data-python-run]").length,
      editors: document.querySelectorAll("[data-python-run] .CodeMirror").length,
      textareas: [...document.querySelectorAll("[data-python-run] textarea")].filter(
        (element) => getComputedStyle(element).display !== "none",
      ).length,
      buttonsEnabled: [...document.querySelectorAll(".python-run-button")].every(
        (button) => !button.disabled,
      ),
      pyodideLoaded: Boolean(document.querySelector('script[data-ewan-runtime="pyodide"]')),
    }))
    check(results.runPython.blocks > 0, "RunPython emitted no runnable blocks")
    check(
      results.runPython.editors === results.runPython.blocks ||
        results.runPython.textareas >= results.runPython.blocks,
      "RunPython did not initialize every editor or fallback textarea",
    )
    check(results.runPython.buttonsEnabled, "RunPython left run buttons disabled")
    check(!results.runPython.pyodideLoaded, "RunPython eagerly loaded Pyodide before Run")
    check(pageErrors.length === 0, `RunPython page errors: ${pageErrors.join("; ")}`)
    await page.close()
  }

  {
    const { page, pageErrors } = await inspect(
      "/pages/gaggimate-extractions.html",
      async (current) => {
        await current.waitForSelector("[data-calplot] .calplot-grid svg", { timeout: 30_000 })
        await current.waitForSelector("[data-calplot] .calplot-profile svg", { timeout: 30_000 })
      },
    )
    results.gaggimate = await page.evaluate(() => ({
      calendarCells: document.querySelectorAll(".calplot-grid rect").length,
      profilePaths: document.querySelectorAll(".calplot-profile path").length,
      stats: document.querySelectorAll(".calplot-day-stats .stat-card").length,
      d3Loaded: Boolean(document.querySelector("script[data-ewan-d3]")),
      breadcrumbs: document.querySelectorAll(".breadcrumb-container a").length,
    }))
    check(results.gaggimate.calendarCells >= 28, "GaggiMate calendar did not render")
    check(results.gaggimate.profilePaths >= 4, "GaggiMate extraction profile did not render")
    check(results.gaggimate.stats === 4, "GaggiMate extraction statistics did not render")
    check(results.gaggimate.d3Loaded, "GaggiMate did not demand-load D3")
    check(results.gaggimate.breadcrumbs > 0, "GaggiMate page has no breadcrumbs")
    check(pageErrors.length === 0, `GaggiMate page errors: ${pageErrors.join("; ")}`)
    await page.close()
  }

  {
    const { page, pageErrors } = await inspect("/pages/morris-lecar.html", async (current) => {
      await current.waitForFunction(
        () =>
          Boolean(window._mlApp) &&
          document.querySelectorAll("#sidebar .sidebar-section").length > 0,
        { timeout: 30_000 },
      )
    })
    results.morrisLecar = await page.evaluate(() => ({
      runtimeLoaded: Boolean(document.querySelector("script[data-ewan-morris-lecar]")),
      appReady: Boolean(window._mlApp),
      sidebarSections: document.querySelectorAll("#sidebar .sidebar-section").length,
      phaseSize: {
        width: document.querySelector("#phase-canvas").width,
        height: document.querySelector("#phase-canvas").height,
      },
    }))
    check(results.morrisLecar.runtimeLoaded, "Morris-Lecar runtime did not demand-load")
    check(results.morrisLecar.appReady, "Morris-Lecar app did not initialize")
    check(results.morrisLecar.sidebarSections > 0, "Morris-Lecar sidebar did not render")
    check(results.morrisLecar.phaseSize.width > 0, "Morris-Lecar phase canvas has no width")
    check(results.morrisLecar.phaseSize.height > 0, "Morris-Lecar phase canvas has no height")
    check(pageErrors.length === 0, `Morris-Lecar page errors: ${pageErrors.join("; ")}`)
    await page.close()
  }
} finally {
  await browser.close()
}

console.log(JSON.stringify(results, null, 2))
if (failures.length) {
  throw new Error(`Browser probe failed:\n- ${failures.join("\n- ")}`)
}
console.log(
  "Browser probe passed: Markdown parity, adaptive neural background, Marimo widgets, RunPython, GaggiMate, and Morris-Lecar.",
)
