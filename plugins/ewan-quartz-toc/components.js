import { h } from "preact"

const CSS = `
.quartztoc{position:relative;display:flex;align-self:stretch;flex:1 1 0;min-height:0;width:100%;margin:0;font: .82rem/1.35 var(--bodyFont)}
.quartztoc.desktop-only{display:flex}
@media(max-width:800px){.quartztoc.desktop-only{display:none}}
.quartztoc-track{position:relative;flex:1;min-height:0;margin:8px 0}
.quartztoc-progress{position:absolute;inset:8px auto 8px 0;width:1px;background:var(--lightgray)}
.quartztoc-rail-thumb{position:absolute;left:-1px;width:3px;top:var(--viewport-top,0px);height:var(--viewport-height,0px);background:var(--secondary);border-radius:2px}
.quartztoc-section{position:absolute;left:-3px;width:7px;top:var(--section-top,0px);height:var(--section-height,0px);background:var(--secondary);opacity:.16;border-radius:3px}
.quartztoc .toc-row{position:absolute;left:0;right:0;top:var(--toc-y,0px);height:0}
.quartztoc .toc-dot{position:absolute;left:-2px;top:-2px;width:5px;height:5px;background:var(--gray);border-radius:50%;opacity:.55;pointer-events:none}
.quartztoc .toc-level-3 .toc-dot,.quartztoc .toc-level-4 .toc-dot{width:4px;height:4px;opacity:.4}
.quartztoc .toc-level-5 .toc-dot,.quartztoc .toc-level-6 .toc-dot{width:3px;height:3px;opacity:.35}
.quartztoc .toc-link{position:absolute;left:18px;right:4px;top:var(--label-offset,-10px);padding:2px 0;line-height:1.35;color:var(--darkgray);text-decoration:none!important;background:none!important;opacity:0;pointer-events:none;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow-wrap:anywhere}
.quartztoc .toc-level-3 .toc-link{left:26px}.quartztoc .toc-level-4 .toc-link{left:34px}.quartztoc .toc-level-5 .toc-link,.quartztoc .toc-level-6 .toc-link{left:42px}
.quartztoc .toc-row-title .toc-link{font-family:var(--headerFont);font-weight:500}
.quartztoc .toc-row.label-visible .toc-link{opacity:.8;pointer-events:auto}
.quartztoc .toc-row.is-active .toc-dot,.quartztoc .toc-row.is-inspected .toc-dot{opacity:1;background:var(--secondary);box-shadow:0 0 0 2px var(--light)}
.quartztoc .toc-row.is-active.label-visible .toc-link,.quartztoc .toc-row.is-inspected.label-visible .toc-link,.quartztoc .toc-link:hover{color:var(--dark);opacity:1}
.quartztoc .toc-link:focus-visible{outline:1px solid var(--secondary);outline-offset:2px;border-radius:2px}
`

// All marks use the same article-to-rail projection. Label visibility may
// change, but neither heading positions nor the viewport ever get re-spaced.
export function projectToc(offsets, articleHeight, railHeight, viewportStart, viewportEnd) {
  const project = (value) =>
    Math.max(0, Math.min(1, value / Math.max(1, articleHeight))) * railHeight
  const start = Math.max(0, Math.min(articleHeight, viewportStart))
  const end = Math.max(start, Math.min(articleHeight, viewportEnd))
  const center = (start + end) / 2
  let active = 0
  // Prefer the visible heading nearest the bar's midpoint, including one
  // below the midpoint. With no heading in view, retain the containing section.
  offsets.forEach((offset, i) => {
    if (offset <= center) active = i
  })
  let nearest = Infinity
  offsets.forEach((offset, i) => {
    if (offset < start || offset > end) return
    const distance = Math.abs(offset - center)
    if (distance < nearest) {
      nearest = distance
      active = i
    }
  })
  const positions = offsets.map(project)
  const top = project(viewportStart),
    bottom = project(viewportEnd)
  return {
    positions,
    active,
    viewportTop: top,
    viewportHeight: Math.max(0, bottom - top),
    sectionTop: positions[active] ?? 0,
    sectionHeight: Math.max(
      0,
      project(offsets[active + 1] ?? articleHeight) - (positions[active] ?? 0),
    ),
  }
}

export function visibleTocLabels(positions, heights, extent, priority, gap = 6) {
  const tops = positions.map((position, i) =>
    Math.max(0, Math.min(extent - heights[i], position - heights[i] / 2)),
  )
  const visible = []
  for (const index of new Set(priority)) {
    if (index < 0 || index >= positions.length) continue
    if (
      visible.every(
        (other) =>
          tops[index] + heights[index] + gap <= tops[other] ||
          tops[other] + heights[other] + gap <= tops[index],
      )
    )
      visible.push(index)
  }
  return { tops, visible }
}

function tocRuntime(project, chooseLabels) {
  let cleanup
  function setup() {
    cleanup?.()
    const toc = document.getElementById("quartztoc")
    if (!toc) return
    const article = document.querySelector("article")
    const track = toc.querySelector(".quartztoc-track")
    const rows = [...toc.querySelectorAll(".toc-row")]
    const links = rows.map((row) => row.querySelector(".toc-link"))
    const targets = rows.map((row) =>
      row.dataset.for === "__top__" ? null : document.getElementById(row.dataset.for),
    )
    const headingPriority = rows
      .map((row, i) => ({ i, level: Number(row.className.match(/toc-level-(\d)/)?.[1] || 1) }))
      .sort((a, b) => a.level - b.level || a.i - b.i)
      .map(({ i }) => i)
    let frame = 0,
      layoutPending = false,
      disposed = false,
      hovered = false,
      inspected = -1,
      focused = -1,
      geometry,
      offsets = [],
      heights = [],
      extent = 0,
      labelState = ""
    const controller = new AbortController()
    const on = (target, name, fn, options = {}) =>
      target.addEventListener(name, fn, { ...options, signal: controller.signal })
    function labels() {
      if (!geometry) return
      const state = `${focused}:${inspected}:${geometry.active}:${hovered}`
      if (state === labelState) return
      labelState = state
      const priority = [focused, inspected, geometry.active]
      if (hovered || focused >= 0) priority.push(...headingPriority)
      const selected = chooseLabels(geometry.positions, heights, extent, priority)
      const visible = new Set(selected.visible)
      rows.forEach((row, i) => {
        row.classList.toggle("label-visible", visible.has(i))
        row.classList.toggle("is-inspected", i === inspected || i === focused)
        links[i].style.setProperty(
          "--label-offset",
          selected.tops[i] - geometry.positions[i] + "px",
        )
      })
    }
    function refresh(layout = false) {
      if (disposed || !article || !toc.clientHeight) return
      const rect = article.getBoundingClientRect()
      if (layout || !offsets.length) {
        extent = track.clientHeight
        offsets = targets.map((target) =>
          target ? Math.max(0, target.getBoundingClientRect().top - rect.top) : 0,
        )
        heights = links.map((link) => link.offsetHeight)
        labelState = ""
      }
      const header = document.querySelector(".sticky-header-bar")?.getBoundingClientRect()
      const viewportTop = header && header.top <= 1 && header.bottom > 0 ? header.bottom : 0
      const previous = geometry
      geometry = project(
        offsets,
        rect.height,
        extent,
        viewportTop - rect.top,
        innerHeight - rect.top,
      )
      rows.forEach((row, i) => {
        if (geometry.positions[i] !== previous?.positions[i]) {
          row.style.setProperty("--toc-y", geometry.positions[i] + "px")
          labelState = ""
        }
        if (geometry.active !== previous?.active) {
          row.classList.toggle("is-active", i === geometry.active)
          if (i === geometry.active) links[i].setAttribute("aria-current", "location")
          else links[i].removeAttribute("aria-current")
        }
      })
      for (const [name, value] of Object.entries({
        "viewport-top": geometry.viewportTop,
        "viewport-height": geometry.viewportHeight,
        "section-top": geometry.sectionTop,
        "section-height": geometry.sectionHeight,
      }))
        toc.style.setProperty("--" + name, value + "px")
      labels()
    }
    function schedule(layout = false) {
      layoutPending ||= layout
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0
          const measure = layoutPending
          layoutPending = false
          refresh(measure)
        })
    }
    const resize = new ResizeObserver(() => schedule(true))
    resize.observe(toc)
    if (article) resize.observe(article)
    links.forEach((link) => resize.observe(link))
    on(document, "scroll", () => schedule(), { passive: true })
    on(window, "resize", () => schedule(true), { passive: true })
    on(toc, "pointerenter", () => {
      hovered = true
      labels()
    })
    on(toc, "pointerleave", () => {
      hovered = false
      inspected = -1
      labels()
    })
    function nearestMark(event) {
      const x = event.clientX - toc.getBoundingClientRect().left
      if (!geometry || x < -4 || x > 15) return -1
      const y = event.clientY - track.getBoundingClientRect().top
      return geometry.positions.reduce(
        (best, value, i) =>
          Math.abs(value - y) < Math.abs(geometry.positions[best] - y) ? i : best,
        0,
      )
    }
    on(toc, "pointermove", (event) => {
      // Scrub densely packed dots without moving their article positions.
      const nearest = nearestMark(event)
      if (nearest < 0 || inspected === nearest) return
      inspected = nearest
      labels()
    })
    on(toc, "focusin", (event) => {
      focused = links.indexOf(event.target)
      labels()
    })
    on(toc, "focusout", () => {
      focused = -1
      labels()
    })
    on(toc, "keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return
      event.preventDefault()
      const i = Math.max(0, links.indexOf(event.target))
      links[
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? links.length - 1
            : Math.max(0, Math.min(links.length - 1, i + (event.key === "ArrowDown" ? 1 : -1)))
      ].focus({ preventScroll: true })
    })
    on(toc, "click", (event) => {
      const link =
        event.target.closest("a.toc-link") ||
        // Resolve the click itself so touch and first-click navigation do not
        // depend on a preceding pointermove event.
        links[nearestMark(event)]
      if (
        !link ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const target = document.getElementById(link.dataset.for)
      if (!target && link.dataset.for !== "__top__") return
      event.preventDefault()
      const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
      if (target) target.scrollIntoView({ behavior, block: "start" })
      else scrollTo({ top: 0, behavior })
      history.pushState(null, "", link.getAttribute("href"))
    })
    document.fonts.ready.then(() => {
      if (!disposed) schedule(true)
    })
    refresh(true)
    cleanup = () => {
      disposed = true
      controller.abort()
      resize.disconnect()
      cancelAnimationFrame(frame)
    }
    window.addCleanup?.(cleanup)
  }
  document.addEventListener("nav", setup)
  setup()
}
const RUNTIME = `(${tocRuntime.toString()})(${projectToc.toString()}, ${visibleTocLabels.toString()});`

export function QuartzTOC() {
  function Component({ fileData, displayClass }) {
    const toc = fileData?.toc
    if (!Array.isArray(toc) || toc.length === 0) return null
    const title = fileData.frontmatter?.title
    const rows = []
    if (title) {
      rows.push(
        h(
          "div",
          { class: "toc-row toc-row-title", "data-for": "__top__", key: "__top__" },
          h("div", { class: "toc-dot", "aria-hidden": "true" }),
          h(
            "a",
            { class: "toc-link", href: "#", "data-for": "__top__", title },
            h("span", { class: "toc-text" }, title),
          ),
        ),
      )
    }
    for (const entry of toc) {
      const slug = String(entry.slug)
      const level = Math.min(6, Math.max(2, Number(entry.depth) + 1))
      rows.push(
        h(
          "div",
          { class: `toc-row toc-level-${level}`, "data-for": slug, key: slug },
          h("div", { class: "toc-dot", "aria-hidden": "true" }),
          h(
            "a",
            { class: "toc-link", href: `#${slug}`, "data-for": slug, title: String(entry.text) },
            h("span", { class: "toc-text" }, String(entry.text)),
          ),
        ),
      )
    }
    return h(
      "nav",
      {
        "aria-label": "On this page",
        class: [displayClass, "quartztoc"].filter(Boolean).join(" "),
        id: "quartztoc",
      },
      h(
        "div",
        { class: "quartztoc-progress", "aria-hidden": "true" },
        h("div", { class: "quartztoc-section", "aria-hidden": "true" }),
        h("div", { class: "quartztoc-rail-thumb" }),
      ),
      h("div", { class: "quartztoc-track" }, rows),
    )
  }
  Component.displayName = "QuartzTOC"
  Component.css = CSS
  Component.afterDOMLoaded = RUNTIME
  return Component
}
