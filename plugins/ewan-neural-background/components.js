import { h } from "preact"
import { createNetwork, stepNetwork } from "./network.js"

const CSS = `
#neural-canvas{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:-1;opacity:var(--neural-ink,.78);mask-image:linear-gradient(90deg,#000 0%,#000b 17%,#0006 29%,#0004 36%,#0004 64%,#0006 71%,#000b 83%,#000 100%)}
#neural-canvas[data-neural-state="off"],#neural-canvas[data-neural-state="waiting"]{visibility:hidden;opacity:0}
#neural-controls{position:fixed;right:1rem;bottom:1rem;z-index:50;color:var(--darkgray);font: .75rem var(--bodyFont)}
#neural-controls>summary{list-style:none;cursor:pointer;display:flex;gap:.45rem;align-items:center;padding:.42rem .65rem;background:var(--light);border:1px solid var(--lightgray);border-radius:5px}
#neural-controls>summary::-webkit-details-marker{display:none}
#neural-controls>summary::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--pine)}
#neural-controls[open]>summary{border-color:var(--gray)}
#neural-controls .neural-panel{position:absolute;right:0;bottom:2.7rem;width:310px;box-sizing:border-box;padding:1rem;background:var(--light);border:1px solid var(--lightgray);border-radius:6px;box-shadow:0 5px 20px var(--highlight);max-height:70vh;overflow:auto}
#neural-controls label{display:block;margin:.75rem 0;color:var(--darkgray)}
#neural-controls label>span{display:flex;justify-content:space-between;gap:1rem}
#neural-controls input,#neural-controls select{display:block;box-sizing:border-box;width:100%;margin-top:.4rem;accent-color:var(--pine);font:inherit}
#neural-controls select{padding:.3rem;background:var(--light);color:var(--dark);border:1px solid var(--lightgray);border-radius:3px}
#neural-controls .neural-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}
#neural-controls .neural-grid label{min-width:0}
#neural-controls .neural-grid label>span{display:block}
#neural-controls .neural-grid output{display:block;margin-top:.15rem;font-size:.68rem}
#neural-controls .neural-seed{display:flex;gap:.65rem;align-items:end;margin:.35rem 0 .75rem}
#neural-controls .neural-seed label{flex:1;min-width:0;margin:0}
#neural-controls input[type=number]{padding:.3rem;background:var(--light);color:var(--darkgray);border:1px solid var(--lightgray);border-radius:3px}
#neural-controls button{padding:.4rem .6rem;border:1px solid var(--lightgray);background:var(--light);color:var(--darkgray);font:inherit;border-radius:3px;cursor:pointer;white-space:nowrap}
#neural-controls button:hover{border-color:var(--secondary);color:var(--dark)}
#neural-controls output{font-variant-numeric:tabular-nums;color:var(--darkgray);opacity:.85}
#neural-controls :focus-visible{outline:2px solid var(--secondary);outline-offset:3px}
@media(max-width:800px){#neural-canvas,#neural-controls{display:none}}
@media print{#neural-canvas,#neural-controls{display:none}}
`

function neuralRuntime(create, step) {
  if (window.__ewanNeural) return
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  const compact = matchMedia("(max-width: 800px)")
  const connection = navigator.connection
  const preferenceKey = "ewan-neural-mode"
  let current = null
  let selectedMode = "auto"
  function freshSeed() {
    try {
      return crypto.getRandomValues(new Uint32Array(1))[0]
    } catch {
      return (Date.now() ^ Math.floor(Math.random() * 0x100000000)) >>> 0
    }
  }
  let seed = freshSeed()
  let layout = ["clusters", "layers", "branches"][seed % 3]
  let parameters = null
  let ink = 0.8
  const parameterFields = [
    ["drive", "Input current", 0, 1, 0.05, "Steady external drive toward the firing threshold"],
    ["coupling", "Recurrence", 0, 1.5, 0.05, "Strength of signals passed between neurons"],
    [
      "inhibition",
      "Inhibition",
      0,
      2,
      0.05,
      "How strongly inhibitory neurons suppress their neighbors",
    ],
    [
      "adaptation",
      "Adaptation",
      0,
      1,
      0.05,
      "How much recent firing makes a neuron less excitable",
    ],
    ["oscillation", "Oscillation", 0, 1, 0.05, "Strength of the rhythmic background current"],
    ["frequency", "Rhythm speed", 0.1, 2, 0.05, "Background cycles per animation second"],
    ["noise", "Fluctuation", 0, 1, 0.05, "Irregular changes in local input currents"],
  ]
  try {
    const value = localStorage.getItem(preferenceKey)
    if (["auto", "on", "off"].includes(value)) selectedMode = value
  } catch {}

  function mount(options = {}) {
    current?.destroy({ keepControls: options.keepOpen })
    current = null
    const canvas = document.getElementById("neural-canvas")
    if (!canvas) return
    const low = (navigator.hardwareConcurrency || 4) <= 4
    const network = create({
      count: low ? 80 : 112,
      seed,
      layout,
      parameters: parameters ?? undefined,
    })
    parameters = network.parameters
    // A fresh per-page scope owns every renderer, timer, observer and control.
    const controller = new AbortController()
    const signal = controller.signal
    const retainedControls = document.getElementById("neural-controls")
    const controls = retainedControls ?? document.createElement("details")
    controls.id = "neural-controls"
    // Keep the live controls during a recipe change. Replacing them in a seed
    // input's blur/change event would swallow the click on the next control.
    if (!retainedControls)
      controls.innerHTML =
        '<summary aria-label="Neural background settings">Network</summary><div class="neural-panel"><div class="neural-grid"><label>Motion<select data-motion aria-label="Background motion"><option value="auto">Auto</option><option value="on">On</option><option value="off">Off</option></select></label><label>Geometry<select data-layout aria-label="Network geometry"><option value="clusters">Islands</option><option value="layers">Layers</option><option value="branches">Branches</option></select></label></div><div class="neural-seed"><label>Seed<input data-seed aria-label="Network seed" type="number" min="0" max="4294967295" step="1"></label><button type="button" data-new-network>New network</button></div><div class="neural-grid">' +
        parameterFields
          .map(
            ([key, label, min, max, stepSize, hint]) =>
              '<label title="' +
              hint +
              '"><span>' +
              label +
              '<output data-value="' +
              key +
              '"></output></span><input data-param="' +
              key +
              '" aria-label="' +
              label +
              '" type="range" min="' +
              min +
              '" max="' +
              max +
              '" step="' +
              stepSize +
              '"></label>',
          )
          .join("") +
        '<label><span>Ink<output data-ink-value></output></span><input data-ink aria-label="Background ink" type="range" min="0.3" max="1" step="0.05"></label></div></div>'
    if (!retainedControls) document.body.appendChild(controls)
    controls.open = Boolean(options.keepOpen)
    const summary = controls.querySelector("summary")
    const select = controls.querySelector("[data-motion]")
    const geometryInput = controls.querySelector("[data-layout]")
    const seedInput = controls.querySelector("[data-seed]")
    const inkInput = controls.querySelector("[data-ink]")
    select.value = selectedMode
    geometryInput.value = layout
    seedInput.value = seed
    inkInput.value = ink
    const parameterInputs = parameterFields.map(([key]) =>
      controls.querySelector('[data-param="' + key + '"]'),
    )
    parameterInputs.forEach((input) => {
      input.value = parameters[input.dataset.param]
    })
    function readControls() {
      parameterInputs.forEach((input) => {
        const key = input.dataset.param
        parameters[key] = Number(input.value)
        controls.querySelector('[data-value="' + key + '"]').value =
          key === "frequency"
            ? parameters[key].toFixed(2) + " cycles/s"
            : Math.round(parameters[key] * 100) + "%"
      })
      ink = Number(inkInput.value)
      controls.querySelector("[data-ink-value]").value = Math.round(ink * 100) + "%"
      canvas.style.setProperty("--neural-ink", ink)
      canvas.dataset.neuralParameters = JSON.stringify(parameters)
    }
    readControls()
    parameterInputs.forEach((input) => input.addEventListener("input", readControls, { signal }))
    inkInput.addEventListener("input", readControls, { signal })
    geometryInput.addEventListener(
      "change",
      () => {
        layout = geometryInput.value
        mount({ keepOpen: true, focus: "[data-layout]" })
      },
      { signal },
    )
    seedInput.addEventListener(
      "change",
      () => {
        if (!seedInput.checkValidity() || seedInput.value === "") {
          seedInput.value = seed
          return
        }
        seed = Number(seedInput.value) >>> 0
        mount({ keepOpen: true, focus: "[data-seed]" })
      },
      { signal },
    )
    controls.querySelector("[data-new-network]").addEventListener(
      "click",
      () => {
        const next = freshSeed()
        seed = next === seed ? (next + 1) >>> 0 : next
        parameters = null
        mount({ keepOpen: true, focus: "[data-new-network]" })
      },
      { signal },
    )
    controls.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          controls.open = false
          summary.focus()
        }
      },
      { signal },
    )
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (!controls.contains(event.target)) controls.open = false
      },
      { signal },
    )

    const base = document.createElement("canvas")
    canvas.width = canvas.height = base.width = base.height = 0
    let ctx = null
    let baseCtx = null
    try {
      ctx = canvas.getContext("2d", { alpha: true })
      baseCtx = base.getContext("2d", { alpha: true })
    } catch {}
    const interval = 1000 / (low ? 24 : 30)
    let width = 0
    let height = 0
    let paths = []
    let positions = []
    let palette = []
    let raf = 0
    let pending = 0
    let last = 0
    let frames = 0
    let totalFrames = 0
    let totalCost = 0
    let destroyed = false
    let failed = false
    let overBudget = false
    let running = false
    let theme
    canvas.dataset.neuralSeed = String(seed)
    canvas.dataset.neuralLayout = layout
    canvas.dataset.neuralTopology = network.edges
      .reduce(
        (hash, edge) => Math.imul(hash ^ ((edge.from + 1) * 257 + edge.to), 16777619) >>> 0,
        2166136261,
      )
      .toString(16)
    canvas.dataset.neuralNodes = String(network.nodes.length)
    canvas.dataset.neuralEdges = String(network.edges.length)
    canvas.dataset.neuralPacketCapacity = String(network.edges.length * 4)
    canvas.dataset.neuralFrames = "0"
    canvas.dataset.neuralSpikes = "0"
    canvas.dataset.neuralPending = "0"
    canvas.dataset.neuralDropped = "0"
    canvas.dataset.neuralState = "waiting"
    canvas.dataset.neuralQuality = "off"
    canvas.dataset.neuralSimTime = "0"
    canvas.dataset.neuralFps = String(low ? 24 : 30)
    delete canvas.dataset.neuralDrawMs
    delete canvas.dataset.neuralFailure

    function colors() {
      const style = getComputedStyle(document.documentElement)
      palette = ["--pine", "--rust", "--slate", "--secondary", "--dark"].map(
        (name) =>
          style.getPropertyValue(name).trim() || style.getPropertyValue("--darkgray").trim(),
      )
    }
    function point(path, t) {
      const u = 1 - t
      return [
        u * u * path.x + 2 * u * t * path.cx + t * t * path.tx,
        u * u * path.y + 2 * u * t * path.cy + t * t * path.ty,
      ]
    }
    function resize() {
      if (!ctx || !baseCtx || destroyed || !running) return false
      try {
        width = Math.max(1, innerWidth)
        height = Math.max(1, innerHeight)
        // Cap total backing area as well as DPR: two RGBA stores stay below
        // 24 MB even on a large retina display (browser overhead is separate).
        const ratio = Math.min(
          devicePixelRatio || 1,
          low ? 1 : 1.5,
          Math.sqrt(3_000_000 / (width * height)),
        )
        canvas.width = base.width = Math.floor(width * ratio)
        canvas.height = base.height = Math.floor(height * ratio)
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        baseCtx.setTransform(ratio, 0, 0, ratio, 0, 0)
        canvas.dataset.neuralDpr = String(ratio)
        positions = network.nodes.map((node) => [node.x * width, node.y * height])
        paths = network.edges.map((edge) => {
          const [x, y] = positions[edge.from]
          const [tx, ty] = positions[edge.to]
          return {
            x,
            y,
            tx,
            ty,
            cx: (x + tx) / 2 - (ty - y) * edge.bend,
            cy: (y + ty) / 2 + (tx - x) * edge.bend,
          }
        })
        cacheStructure()
        return true
      } catch (error) {
        fail(error)
        return false
      }
    }
    function cacheStructure() {
      if (!baseCtx) return
      baseCtx.clearRect(0, 0, width, height)
      baseCtx.lineWidth = 0.65
      network.edges.forEach((edge, i) => {
        const p = paths[i]
        if (!p) return
        baseCtx.strokeStyle = palette[edge.weight < 0 ? 1 : 0]
        baseCtx.globalAlpha = edge.weight < 0 ? 0.1 : 0.16
        baseCtx.beginPath()
        baseCtx.moveTo(p.x, p.y)
        baseCtx.quadraticCurveTo(p.cx, p.cy, p.tx, p.ty)
        baseCtx.stroke()
      })
      network.nodes.forEach((node, i) => {
        const [x, y] = positions[i]
        baseCtx.fillStyle = palette[node.inhibitory ? 1 : 0]
        baseCtx.globalAlpha = 0.46
        baseCtx.beginPath()
        baseCtx.arc(x, y, node.inhibitory ? 1.7 : 1.35, 0, Math.PI * 2)
        baseCtx.fill()
        baseCtx.globalAlpha = 0.13
        baseCtx.beginPath()
        baseCtx.arc(x, y, 3.3, 0, Math.PI * 2)
        baseCtx.fill()
      })
      baseCtx.globalAlpha = 1
    }
    function render() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = 1
      ctx.drawImage(base, 0, 0, width, height)
      ctx.lineWidth = 1.1
      ctx.lineCap = "round"
      for (let i = 0; i < network.edges.length; i++) {
        const edge = network.edges[i]
        const path = paths[i]
        if (!path) continue
        ctx.strokeStyle = ctx.fillStyle = palette[edge.weight < 0 ? 1 : 0]
        for (const remaining of edge.packets) {
          if (remaining <= 0) continue
          const t = Math.max(0, Math.min(1, 1 - remaining / edge.delay))
          ctx.globalAlpha = 0.72
          ctx.beginPath()
          for (let j = 0; j <= 4; j++) {
            const [x, y] = point(path, Math.max(0, t - (4 - j) * 0.018))
            if (j === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
          const [x, y] = point(path, t)
          ctx.globalAlpha = 0.82
          ctx.beginPath()
          ctx.arc(x, y, 1.35, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      network.nodes.forEach((node, i) => {
        if (node.glow < 0.015) return
        const [x, y] = positions[i]
        const color = palette[node.inhibitory ? 1 : 0]
        const age = 1 - node.glow
        // A short luminous soma and expanding ring mark actual threshold
        // crossings. No full-screen blur or accumulating trail buffer.
        ctx.fillStyle = ctx.strokeStyle = color
        ctx.globalAlpha = node.glow * 0.18
        ctx.beginPath()
        ctx.arc(x, y, 8 + age * 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = node.glow * 0.55
        ctx.lineWidth = 0.85
        ctx.beginPath()
        ctx.arc(x, y, 3.5 + age * 12, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = Math.min(1, node.glow * 1.8)
        ctx.beginPath()
        ctx.arc(x, y, 2 + node.glow * 2.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = palette[4]
        ctx.globalAlpha = Math.pow(node.glow, 3) * 0.95
        ctx.beginPath()
        ctx.arc(x, y, 1.25, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
    }
    function animate(now) {
      if (destroyed || !running || document.hidden) return
      if (now - last >= interval - 0.5) {
        try {
          const started = performance.now()
          const dt = last ? Math.min(0.05, (now - last) / 1000) : interval / 1000
          last = now
          step(network, dt, parameters)
          render()
          totalCost += performance.now() - started
          frames++
          totalFrames++
          canvas.dataset.neuralFrames = String(totalFrames)
          if (frames >= 60) {
            const meanCost = totalCost / frames
            canvas.dataset.neuralDrawMs = meanCost.toFixed(3)
            canvas.dataset.neuralSimTime = network.time.toFixed(3)
            canvas.dataset.neuralSpikes = String(network.spikes)
            canvas.dataset.neuralPending = String(network.pending)
            canvas.dataset.neuralDropped = String(network.dropped)
            totalCost = 0
            frames = 0
            if (meanCost > 8 && selectedMode === "auto") {
              overBudget = true
              reconcile()
            }
          }
        } catch (error) {
          fail(error)
          return
        }
      }
      // Only a successful frame can schedule another. Context errors fail
      // closed instead of leaving an exception-producing animation loop.
      if (running && !destroyed) raf = requestAnimationFrame(animate)
    }
    function fail(error) {
      failed = true
      canvas.dataset.neuralFailure = error?.name || "RenderingError"
      reconcile()
    }
    function reconcile() {
      if (destroyed) return
      clearTimeout(pending)
      cancelAnimationFrame(raf)
      running = false
      last = 0
      const automatic = selectedMode === "auto"
      let reason = ""
      if (failed) reason = "Animation unavailable"
      else if (!ctx || !baseCtx) reason = "Canvas unavailable"
      else if (compact.matches) reason = "Motion paused on a small screen"
      else if (selectedMode === "off") reason = "Motion off"
      else if (automatic && motion.matches) reason = "Auto paused for reduced motion"
      else if (automatic && connection?.saveData) reason = "Auto paused to save data"
      else if (automatic && (navigator.deviceMemory || 8) <= 2)
        reason = "Auto paused for this device"
      else if (automatic && overBudget) reason = "Auto paused to keep reading responsive"
      canvas.dataset.neuralReason = reason
      if (reason) {
        canvas.dataset.neuralState = "off"
        canvas.dataset.neuralQuality = "off"
        // No full-screen backing stores, cache work or redraws in Off/Auto-off.
        canvas.width = canvas.height = base.width = base.height = 0
        return
      }
      canvas.dataset.neuralQuality = low ? "low" : "medium"
      if (document.hidden) {
        canvas.dataset.neuralState = "paused"
        return
      }
      // Defer initial art until page content has had an opportunity to paint.
      canvas.dataset.neuralState = "waiting"
      pending = setTimeout(() => {
        if (destroyed || !canvas.isConnected || document.hidden) return
        try {
          canvas.dataset.neuralState = "running"
          running = true
          colors()
          if (resize()) raf = requestAnimationFrame(animate)
        } catch (error) {
          fail(error)
        }
      }, 160)
    }
    select.addEventListener(
      "change",
      () => {
        selectedMode = select.value
        try {
          localStorage.setItem(preferenceKey, selectedMode)
        } catch {}
        reconcile()
      },
      { signal },
    )
    document.addEventListener("visibilitychange", reconcile, { signal })
    canvas.addEventListener("contextlost", () => fail({ name: "ContextLost" }), { signal })
    base.addEventListener("contextlost", () => fail({ name: "ContextLost" }), { signal })
    motion.addEventListener("change", reconcile, { signal })
    compact.addEventListener("change", reconcile, { signal })
    connection?.addEventListener?.("change", reconcile, { signal })
    window.addEventListener("resize", resize, { passive: true, signal })
    if (ctx && baseCtx) {
      theme = new MutationObserver(() => {
        if (!running) return
        try {
          colors()
          cacheStructure()
        } catch (error) {
          fail(error)
        }
      })
      theme.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["saved-theme"],
      })
    }
    function destroy({ keepControls = false } = {}) {
      destroyed = true
      running = false
      clearTimeout(pending)
      cancelAnimationFrame(raf)
      controller.abort()
      theme?.disconnect()
      if (!keepControls) controls.remove()
      canvas.dataset.neuralState = "destroyed"
      // Release backing stores promptly when a SPA route leaves this page.
      base.width = base.height = 0
      canvas.width = canvas.height = 0
    }
    current = { destroy }
    reconcile()
    if (options.focus && !retainedControls)
      controls.querySelector(options.focus)?.focus({ preventScroll: true })
  }
  document.addEventListener("prenav", () => {
    current?.destroy()
    current = null
  })
  document.addEventListener("nav", mount)
  window.__ewanNeural = { mount }
  mount()
}

export function NeuralBackground() {
  function Component() {
    return h("canvas", {
      id: "neural-canvas",
      "aria-hidden": "true",
      "data-neural-state": "waiting",
      width: 1,
      height: 1,
    })
  }
  Component.displayName = "NeuralBackground"
  Component.css = CSS
  Component.afterDOMLoaded = `(${neuralRuntime.toString()})(${createNetwork.toString()},${stepNetwork.toString()});`
  return Component
}
