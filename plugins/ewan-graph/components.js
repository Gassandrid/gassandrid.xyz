import { Graph as QuartzGraph } from "../../.quartz/plugins/graph/dist/components/index.js"

const GRAPH_DATA_LOOPS = [
  {
    original: "for(var Ju in Ku)eu.set(Fu(Ju),Ku[Ju])",
    filtered:
      "for(var Ju in Ku){var Hu=Fu(Ju);if(/\\.base(?:\\/index)?$/.test(Hu))continue;eu.set(Hu,Ku[Ju])}",
  },
  {
    original: "for(var Ku in qu)uu.set(cu(Ku),qu[Ku])",
    filtered:
      "for(var Ku in qu){var Hu=cu(Ku);if(/\\.base(?:\\/index)?$/.test(Hu))continue;uu.set(Hu,qu[Ku])}",
  },
]

export function patchGraphRuntime(script) {
  for (const { original, filtered } of GRAPH_DATA_LOOPS) {
    if (script.includes(original)) {
      return script.replace(original, filtered)
    }
  }

  throw new Error("Quartz graph runtime changed; update the .base compatibility patch")
}

// The upstream graph has two independent continuous render loops. D3 already
// emits ticks while its layout moves, so draw on those ticks and user input.
// Keep this helper inside the browser bundle, independent of build-time imports.
export function manageGraphRendering(app, simulation, updatePositions, dispose) {
  const canvas = app.canvas
  const container = canvas.parentElement
  let disposed = false
  let visible = false
  let frame = 0

  function draw() {
    frame = 0
    if (disposed || !visible || document.hidden) return
    updatePositions()
    app.render()
  }

  function requestDraw() {
    if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(draw)
  }

  function syncVisibility() {
    if (disposed) return
    const bounds = container.getBoundingClientRect()
    visible =
      bounds.width > 0 &&
      bounds.height > 0 &&
      bounds.bottom > 0 &&
      bounds.top < innerHeight &&
      bounds.right > 0 &&
      bounds.left < innerWidth
    if (!visible || document.hidden) {
      simulation.stop()
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    } else {
      if (simulation.alpha() >= simulation.alphaMin()) simulation.restart()
      requestDraw()
    }
  }

  app.stop()
  simulation.on("tick", requestDraw)
  const inputEvents = ["pointermove", "pointerdown", "pointerup", "pointerleave", "wheel"]
  inputEvents.forEach((name) => canvas.addEventListener(name, requestDraw, { passive: true }))
  document.addEventListener("visibilitychange", syncVisibility)
  const visibility = new IntersectionObserver(syncVisibility)
  const resize = new ResizeObserver(syncVisibility)
  visibility.observe(container)
  resize.observe(container)
  syncVisibility()

  return () => {
    disposed = true
    if (frame) cancelAnimationFrame(frame)
    visibility.disconnect()
    resize.disconnect()
    document.removeEventListener("visibilitychange", syncVisibility)
    inputEvents.forEach((name) => canvas.removeEventListener(name, requestDraw))
    dispose()
  }
}

export function patchGraphPerformance(script) {
  // Fail at build time if the pinned plugin changes this integration seam.
  const loop = /requestAnimationFrame\((\w+)\)/g
  const matches = [...script.matchAll(loop)]
  const setup =
    /return (\w+)\.on\("tick",function\(\)\{\}\),\1\.restart\(\),(\w+)\(\),(\w+)\(\),function\(\)\{(\w+)=!0,\1\.stop\(\);try\{(\w+)\.destroy\(!0\)\}catch\{\}\}/
  const match = script.match(setup)
  if (matches.length !== 1 || !match || matches[0][1] !== match[3]) {
    throw new Error("Quartz graph runtime changed; update the rendering lifecycle patch")
  }
  return script
    .replace("pixi.js@8/dist/pixi.js", "pixi.js@8/dist/pixi.min.js")
    .replace(loop, "")
    .replace(
      setup,
      (_, simulation, initialize, update, stopped, app) =>
        `return ${initialize}(),manageGraphRendering(${app},${simulation},${update},function(){${stopped}=!0,${simulation}.stop();try{${app}.destroy(!0)}catch{}})`,
    )
}

function whenGraphVisible(start) {
  let started = false
  const observer = new IntersectionObserver(check)
  const observed = new WeakSet()

  function check() {
    if (started || document.hidden) return
    for (const graph of document.querySelectorAll(".graph-container")) {
      if (!observed.has(graph)) {
        observed.add(graph)
        observer.observe(graph)
      }
      const bounds = graph.getBoundingClientRect()
      if (
        bounds.width > 0 &&
        bounds.height > 0 &&
        bounds.bottom > 0 &&
        bounds.top < innerHeight &&
        bounds.right > 0 &&
        bounds.left < innerWidth
      ) {
        started = true
        observer.disconnect()
        document.removeEventListener("nav", check)
        document.removeEventListener("render", check)
        document.removeEventListener("visibilitychange", check)
        start()
        return
      }
    }
  }

  document.addEventListener("nav", check)
  document.addEventListener("render", check)
  document.addEventListener("visibilitychange", check)
  check()
}

export function Graph(options) {
  const Component = QuartzGraph(options)
  const runtime = patchGraphPerformance(patchGraphRuntime(Component.afterDOMLoaded))
  Component.afterDOMLoaded = `(${whenGraphVisible.toString()})(function(){
    ${manageGraphRendering.toString()}
    ${runtime}
  });`
  return Component
}
