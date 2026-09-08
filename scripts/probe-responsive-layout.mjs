import puppeteer from "puppeteer-core"

const base = process.env.QUARTZ_PROBE_URL ?? "http://localhost:8080"
// The production output is served by a plain static server in release checks,
// so address the emitted file directly instead of relying on a dev-server rewrite.
const articlePath = "/thoughts/on-capturing-personal-data.html"
const screenshotDir = process.env.QUARTZ_SCREENSHOT_DIR

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
})

const failures = []
const results = {}

function check(condition, message) {
  if (!condition) failures.push(message)
}

async function inspect(name, viewport) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.goto(new URL(articlePath, base), {
    waitUntil: "networkidle0",
    timeout: 60_000,
  })
  await page.waitForSelector(".sticky-header-bar .breadcrumb-container")
  await page.evaluate(() => scrollTo(0, 0))

  const initial = await page.evaluate(() => {
    const bar = document.querySelector(".center > .sticky-header-bar")
    const breadcrumbs = bar?.querySelector(".breadcrumb-container")
    const controls = bar?.querySelector(".flex-component")
    const graphSidebar = document.querySelector(".sidebar.left")
    const graph = graphSidebar?.querySelector(".graph")
    const center = document.querySelector(".center")
    const rect = (element) => {
      const box = element?.getBoundingClientRect()
      return box
        ? { top: box.top, right: box.right, bottom: box.bottom, left: box.left, width: box.width }
        : null
    }

    return {
      viewportWidth: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bar: rect(bar),
      breadcrumbs: rect(breadcrumbs),
      controls: rect(controls),
      center: rect(center),
      barPosition: bar ? getComputedStyle(bar).position : null,
      dividerWidth: bar ? getComputedStyle(bar).borderBottomWidth : null,
      graphSidebarDisplay: graphSidebar ? getComputedStyle(graphSidebar).display : null,
      graphVisible: graph ? graph.getClientRects().length > 0 : false,
      explorerVisible: [...document.querySelectorAll(".explorer")].some(
        (element) => element.getClientRects().length > 0,
      ),
    }
  })

  if (screenshotDir) {
    await page.screenshot({ path: `${screenshotDir}/${name}.png`, fullPage: false })
  }

  return { page, initial }
}

try {
  const desktop = await inspect("quartz-header-desktop", { width: 1440, height: 1000 })
  results.desktop = desktop.initial
  check(desktop.initial.bar, "desktop sticky header bar is missing")
  check(desktop.initial.breadcrumbs, "desktop breadcrumbs are missing from the header bar")
  check(desktop.initial.controls, "desktop controls are missing from the header bar")
  check(desktop.initial.dividerWidth === "1px", "desktop header divider is missing")
  check(
    Math.abs(
      (desktop.initial.breadcrumbs.top + desktop.initial.breadcrumbs.bottom) / 2 -
        (desktop.initial.controls.top + desktop.initial.controls.bottom) / 2,
    ) < 8,
    "desktop breadcrumbs and controls are not on the same row",
  )
  check(
    desktop.initial.controls.right > desktop.initial.bar.right - 8,
    "desktop controls are not aligned to the right edge",
  )
  await desktop.page.close()

  const compact = await inspect("quartz-header-compact", { width: 1000, height: 900 })
  results.compact = compact.initial
  check(compact.initial.graphSidebarDisplay === "none", "compact left sidebar is visible")
  check(!compact.initial.graphVisible, "compact graph is visible")
  check(
    compact.initial.center?.width > 800,
    `compact content did not reclaim the graph column (${compact.initial.center?.width}px)`,
  )
  await compact.page.close()

  const mobile = await inspect("quartz-header-mobile", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await mobile.page.evaluate(() => scrollTo(0, 700))
  await new Promise((resolve) => setTimeout(resolve, 100))
  const stickyTop = await mobile.page.$eval(".center > .sticky-header-bar", (bar) =>
    Math.round(bar.getBoundingClientRect().top),
  )
  results.mobile = { ...mobile.initial, stickyTop }
  check(mobile.initial.documentWidth <= mobile.initial.viewportWidth, "mobile page overflows")
  check(mobile.initial.barPosition === "sticky", "mobile header bar is not sticky")
  check(mobile.initial.dividerWidth === "1px", "mobile header divider is missing")
  check(mobile.initial.graphSidebarDisplay === "none", "mobile left sidebar is visible")
  check(!mobile.initial.graphVisible, "mobile graph is visible")
  check(!mobile.initial.explorerVisible, "mobile Explorer is visible")
  check(stickyTop === 0, `mobile header did not remain at the top after scrolling (${stickyTop}px)`)
  await mobile.page.close()
} finally {
  await browser.close()
}

console.log(JSON.stringify(results, null, 2))
if (failures.length > 0) {
  console.error(`Responsive layout probe failed:\n- ${failures.join("\n- ")}`)
  process.exitCode = 1
}
