import assert from "node:assert/strict"
import puppeteer from "puppeteer-core"

const base = process.env.QUARTZ_PROBE_URL ?? "http://127.0.0.1:8196"
const articleSlug = "thoughts/on-capturing-personal-data"
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
})
const results = {},
  pageErrors = []

async function open(width, javascript = true, path = "/") {
  const page = await browser.newPage()
  await page.setViewport({ width, height: 844, isMobile: width <= 800, hasTouch: width <= 800 })
  await page.setJavaScriptEnabled(javascript)
  page.on("pageerror", (error) => pageErrors.push(`${width}px: ${error.message}`))
  if (javascript) {
    await page.evaluateOnNewDocument(() => {
      window.__mobileNavProbe = { navigations: 0 }
      document.addEventListener("nav", () => window.__mobileNavProbe.navigations++)
    })
  }
  const response = await page.goto(new URL(path, base).href, { waitUntil: "load", timeout: 60_000 })
  assert.equal(response.ok(), true, `could not load ${path}`)
  if (javascript) {
    await page.waitForFunction(
      () => window.__mobileNavProbe.navigations > 0 && document.querySelector(".results-container"),
    )
    await page.evaluate(() => document.fonts.ready)
  }
  return page
}

async function mobileLayout(page) {
  const state = await page.evaluate(() => {
    const explorers = [...document.querySelectorAll(".page > #quartz-body .explorer")]
    const buttons = explorers.flatMap((explorer) => [...explorer.querySelectorAll("button")])
    return {
      explorers: explorers.length,
      explorerRects: explorers.reduce(
        (total, explorer) => total + explorer.getClientRects().length,
        0,
      ),
      visibleExplorerButtons: buttons.filter((button) => button.getClientRects().length > 0).length,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    }
  })
  assert.ok(state.explorers > 0, "fixture no longer contains an Explorer to test")
  assert.equal(state.explorerRects, 0, "mobile Explorer occupies layout space")
  assert.equal(state.visibleExplorerButtons, 0, "mobile Explorer buttons are visible")
  assert.equal(state.horizontalOverflow, false, "mobile page overflows horizontally")
  return state
}

async function backlinks(page) {
  const state = await page.$eval(".backlinks", (element) => ({
    visible: element.getClientRects().length > 0,
    links: [...element.querySelectorAll("a")].filter((link) => link.getClientRects().length > 0)
      .length,
    clipped: element.scrollHeight > element.clientHeight + 1,
  }))
  assert.equal(state.visible, true, "mobile backlinks disappeared")
  assert.ok(state.links > 0, "reference article has no visible backlinks")
  assert.equal(state.clipped, false, "mobile backlinks are clipped")
  return state
}

async function search(page) {
  await page.click(".search-button")
  await page.waitForSelector(".search-container.active .search-bar", { visible: true })
  await page.type(".search-container.active .search-bar", "capturing personal data")
  await page.waitForFunction(
    (slug) =>
      [...document.querySelectorAll(".search-container.active .result-card")].some(
        (link) => new URL(link.href).pathname === `/${slug}` && link.getClientRects().length > 0,
      ),
    {},
    articleSlug,
  )
  await page.keyboard.press("Escape")
  await page.waitForFunction(() => !document.querySelector(".search-container.active"))
  return { matchingResult: true, escapeCloses: true }
}

async function waitForRoute(page, slug, previousCount) {
  await page.waitForFunction(
    (slug, count) =>
      document.body.dataset.slug === slug &&
      window.__mobileNavProbe?.navigations > count &&
      !document.querySelector(".navigation-progress"),
    {},
    slug,
    previousCount,
  )
  await page.evaluate(() => document.fonts.ready)
}

try {
  for (const width of [390, 800]) {
    const noScript = await open(width, false, `/${articleSlug}`)
    try {
      results[`${width}pxWithoutJavaScript`] = {
        ...(await mobileLayout(noScript)),
        backlinks: await backlinks(noScript),
      }
    } finally {
      await noScript.close()
    }

    const page = await open(width)
    try {
      const mobile = (results[`${width}px`] = { initial: await mobileLayout(page) })
      mobile.search = await search(page)
      const linkSelector = `article a[data-slug="${articleSlug}"]`
      await page.$eval(linkSelector, (link) =>
        link.scrollIntoView({ block: "center", behavior: "instant" }),
      )
      const before = await page.evaluate(() => ({
        scroll: scrollY,
        navigations: window.__mobileNavProbe.navigations,
        timeOrigin: performance.timeOrigin,
      }))
      assert.ok(before.scroll > 0, "home navigation fixture must begin below the top")
      await page.click(linkSelector)
      await waitForRoute(page, articleSlug, before.navigations)
      mobile.article = {
        ...(await mobileLayout(page)),
        backlinks: await backlinks(page),
      }
      assert.equal(
        await page.evaluate(() => performance.timeOrigin),
        before.timeOrigin,
        "link caused a full reload",
      )
      // The site's smooth scrolling can outlast the SPA nav event.
      await page.waitForFunction(() => scrollY <= 1)
      await page.evaluate(() => scrollTo({ top: 700, behavior: "instant" }))
      await page.waitForFunction(() => scrollY >= 699)
      mobile.articleScroll = await mobileLayout(page)
      const count = await page.evaluate(() => window.__mobileNavProbe.navigations)
      await page.goBack({ waitUntil: "domcontentloaded" })
      await waitForRoute(page, "index", count)
      // Wait for the rendered route and browser scroll restoration to settle.
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      )
      mobile.back = {
        ...(await mobileLayout(page)),
        expectedScroll: before.scroll,
        actualScroll: await page.evaluate(() => scrollY),
      }
      assert.equal(
        await page.evaluate(() => performance.timeOrigin),
        before.timeOrigin,
        "Back caused a full reload",
      )
      await page.evaluate(() => scrollTo({ top: 700, behavior: "instant" }))
      await page.waitForFunction(() => scrollY > 0)
      mobile.back.scrollable = true
      mobile.searchAfterBack = await search(page)
    } finally {
      await page.close()
    }
  }

  const desktop = await open(1440, true, `/${articleSlug}`)
  try {
    const button = ".sidebar.right .desktop-explorer"
    const content = ".sidebar.right .explorer-content"
    await desktop.waitForSelector(`${content} a`, { visible: true })
    await desktop.click(button)
    await desktop.waitForFunction(
      (selector) => getComputedStyle(document.querySelector(selector)).display === "none",
      {},
      content,
    )
    await desktop.click(button)
    await desktop.waitForSelector(`${content} a`, { visible: true })
    results.desktop = { explorerCollapses: true, explorerReopens: true }
  } finally {
    await desktop.close()
  }
} finally {
  await browser.close()
}

console.log(JSON.stringify(results, null, 2))
assert.deepEqual(pageErrors, [], "browser runtime errors")
console.log(
  "Mobile navigation probe passed: initial CSS, search, backlinks, SPA Back, and desktop Explorer.",
)
