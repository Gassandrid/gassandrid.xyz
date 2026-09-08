import { h } from "preact"

const CSS = `
#lorenz-canvas{position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;opacity:0;transition:opacity .4s;mask-image:linear-gradient(90deg,#0008,transparent 23%,transparent 73%,#0005)}
#lorenz-canvas[data-lorenz-quality]:not([data-lorenz-quality="off"]){opacity:.32}
#lorenz-controls{position:fixed;right:14px;bottom:14px;z-index:50;font: .8rem var(--bodyFont);color:var(--darkgray)}
#lorenz-controls .controls-tab{float:right;padding:6px 10px;border:1px solid var(--lightgray);border-radius:6px;background:var(--light);color:var(--darkgray);font:inherit;cursor:pointer}
#lorenz-controls .controls-panel{display:none;position:absolute;right:0;bottom:36px;width:210px;max-height:70vh;overflow:auto;box-sizing:border-box;padding:16px;border:1px solid var(--lightgray);border-radius:8px;background:var(--light);box-shadow:0 6px 24px var(--highlight)}
#lorenz-controls.open .controls-panel{display:block}
#lorenz-controls h4{margin:0 0 6px;color:var(--dark);font-size:.95rem}
#lorenz-controls p{font-size:.75rem;line-height:1.4;margin:0 0 16px}
#lorenz-controls label{display:block;margin:10px 0;color:var(--darkgray)}
#lorenz-controls input,#lorenz-controls select{display:block;width:100%;margin-top:6px;accent-color:var(--secondary);font:inherit}
#lorenz-controls select{padding:5px;background:var(--light);color:var(--dark);border:1px solid var(--lightgray);border-radius:4px}
#lorenz-controls .lorenz-status{font-size:.7rem;margin-top:12px;color:var(--gray)}
@media(max-width:800px){#lorenz-controls{display:none}}
@media(prefers-reduced-motion:reduce){#lorenz-canvas{transition:none}}
`

// Fourth-order integration of the Lorenz system. This is generative art, not
// a trace of measured activity or a fitted neural representation.
export function lorenzStep([x, y, z], dt = 0.006) {
  const f = ([a, b, c]) => [10 * (b - a), a * (28 - c) - b, a * b - (8 / 3) * c]
  const add = (v, k, scale) => v.map((n, i) => n + k[i] * scale)
  const p = [x, y, z],
    a = f(p),
    b = f(add(p, a, dt / 2)),
    c = f(add(p, b, dt / 2)),
    d = f(add(p, c, dt))
  return p.map((n, i) => n + (dt / 6) * (a[i] + 2 * b[i] + 2 * c[i] + d[i]))
}

function lorenzRuntime(step) {
  if (window.__ewanLorenz) {
    window.__ewanLorenz.mount()
    return
  }
  const key = "ewan-lorenz-mode",
    motion = matchMedia("(prefers-reduced-motion: reduce)")
  let cleanup,
    pending,
    generation = 0,
    speed = 0.35,
    intensity = 0.32,
    selectedMode = null
  const stored = () => {
    if (selectedMode) return selectedMode
    try {
      return localStorage.getItem(key) || "auto"
    } catch {
      return "auto"
    }
  }
  function quality() {
    if (innerWidth <= 800 || stored() === "off") return "off"
    if (stored() === "auto" && motion.matches) return "off"
    if (stored() !== "on" && (navigator.connection?.saveData || (navigator.deviceMemory || 8) <= 2))
      return "off"
    return innerWidth < 1200 || (navigator.hardwareConcurrency || 4) <= 4 ? "low" : "medium"
  }
  function controls() {
    let root = document.getElementById("lorenz-controls")
    if (root) return root
    root = document.createElement("div")
    root.id = "lorenz-controls"
    root.innerHTML =
      '<button class="controls-tab" aria-expanded="false" aria-controls="lorenz-panel">Flow</button><div id="lorenz-panel" class="controls-panel"><h4>Attractor traces</h4><p>A quiet Lorenz study of nearby trajectories diverging in state space.</p><label>Motion<select><option value="auto">Auto</option><option value="on">On</option><option value="off">Off</option></select></label><label>Pace<input data-pace type="range" min="0.1" max="0.8" step="0.05" value="0.35"></label><label>Ink<input data-ink type="range" min="0.1" max="0.6" step="0.05" value="0.32"></label><div class="lorenz-status" data-lorenz-status role="status"></div></div>'
    const tab = root.querySelector("button")
    const close = () => {
      root.classList.remove("open")
      tab.setAttribute("aria-expanded", "false")
    }
    tab.onclick = () => {
      const open = root.classList.toggle("open")
      tab.setAttribute("aria-expanded", String(open))
    }
    root.onkeydown = (event) => {
      if (event.key === "Escape") {
        close()
        tab.focus()
      }
    }
    const select = root.querySelector("select")
    select.value = stored()
    select.onchange = () => {
      selectedMode = select.value
      try {
        localStorage.setItem(key, select.value)
      } catch {}
      mount()
    }
    root.querySelector("[data-pace]").oninput = (event) => {
      speed = Number(event.target.value)
    }
    root.querySelector("[data-ink]").oninput = (event) => {
      intensity = Number(event.target.value)
      const canvas = document.getElementById("lorenz-canvas")
      if (canvas?.dataset.lorenzQuality !== "off") canvas.style.opacity = intensity
    }
    document.body.appendChild(root)
    return root
  }
  function run(canvas, tier, status) {
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) {
      canvas.dataset.lorenzQuality = "off"
      status.textContent = "Canvas unavailable"
      return () => {}
    }
    const count = tier === "low" ? 3 : 5,
      length = tier === "low" ? 260 : 420
    const trails = Array.from({ length: count }, (_, i) => {
      let p = [1 + i * 0.0001, 1, 20]
      for (let j = 0; j < 700 + i * 90; j++) p = step(p)
      const points = []
      for (let j = 0; j < length; j++) {
        p = step(p)
        points.push(p)
      }
      return { points, head: 0, p }
    })
    let raf = 0,
      last = 0,
      accumulator = 0,
      stopped = false,
      ink = [],
      frames = 0,
      cost = 0
    const controller = new AbortController()
    function colors() {
      const style = getComputedStyle(document.documentElement)
      ink = ["--pine", "--secondary", "--slate"].map((name) => style.getPropertyValue(name).trim())
    }
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, tier === "low" ? 1 : 1.5)
      canvas.width = Math.round(innerWidth * dpr)
      canvas.height = Math.round(innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const theme = new MutationObserver(colors)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["saved-theme"] })
    function draw(now) {
      if (stopped || document.hidden) return
      raf = requestAnimationFrame(draw)
      if (now - last < 1000 / 30) return
      const begin = performance.now(),
        elapsed = last ? Math.min(now - last, 100) : 33
      last = now
      accumulator += elapsed * 0.06 * speed
      const steps = Math.floor(accumulator)
      accumulator -= steps
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      const scale = Math.max(innerWidth / 48, innerHeight / 45)
      trails.forEach((trail, i) => {
        for (let j = 0; j < steps; j++) {
          trail.p = step(trail.p)
          trail.points[trail.head] = trail.p
          trail.head = (trail.head + 1) % length
        }
        ctx.strokeStyle = ink[i % ink.length]
        ctx.lineWidth = 0.75
        // Four softly graded segments retain trajectory history without an
        // accumulating full-screen canvas fade or thousands of vector arrows.
        for (let band = 0; band < 4; band++) {
          ctx.globalAlpha = 0.15 + band * 0.19
          ctx.beginPath()
          const start = Math.floor((band * (length - 1)) / 4),
            end = Math.floor(((band + 1) * (length - 1)) / 4)
          for (let j = start; j <= end; j++) {
            const p = trail.points[(trail.head + j) % length]
            const x = innerWidth / 2 + (p[0] + p[1] * 0.18) * scale
            const y = innerHeight / 2 - (p[2] - 25) * scale * 0.9
            if (j === start) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      })
      ctx.globalAlpha = 1
      cost += performance.now() - begin
      frames++
      if (frames === 120) {
        canvas.dataset.lorenzDrawMs = (cost / frames).toFixed(2)
        if (cost / frames > 12 && stored() === "auto") {
          stop()
          canvas.dataset.lorenzQuality = "off"
          canvas.style.opacity = "0"
          status.textContent = "Auto-disabled: render budget exceeded"
        }
        cost = 0
        frames = 0
      }
    }
    function visibility() {
      cancelAnimationFrame(raf)
      last = 0
      if (!document.hidden && !stopped) raf = requestAnimationFrame(draw)
    }
    function stop() {
      stopped = true
      cancelAnimationFrame(raf)
      controller.abort()
      theme.disconnect()
    }
    colors()
    resize()
    window.addEventListener("resize", resize, { passive: true, signal: controller.signal })
    document.addEventListener("visibilitychange", visibility, { signal: controller.signal })
    raf = requestAnimationFrame(draw)
    return stop
  }
  function mount() {
    cleanup?.()
    cleanup = null
    clearTimeout(pending)
    const version = ++generation,
      canvas = document.getElementById("lorenz-canvas")
    if (!canvas) return
    const tier = quality(),
      root = controls(),
      status = root.querySelector("[data-lorenz-status]")
    delete canvas.dataset.lorenzDrawMs
    canvas.dataset.lorenzQuality = tier
    canvas.style.opacity = tier === "off" ? "0" : String(intensity)
    status.textContent =
      tier === "off"
        ? stored() === "off"
          ? "Motion off"
          : motion.matches
            ? "Auto paused: reduced motion. Choose On to animate."
            : "Auto paused for this device"
        : "Lorenz trajectories · " + tier
    if (tier === "off") return
    pending = setTimeout(() => {
      if (version === generation && canvas.isConnected) cleanup = run(canvas, tier, status)
    }, 150)
  }
  let compact = innerWidth <= 800
  window.addEventListener(
    "resize",
    () => {
      const next = innerWidth <= 800
      if (next !== compact) {
        compact = next
        mount()
      }
    },
    { passive: true },
  )
  motion.addEventListener("change", mount)
  document.addEventListener("nav", mount)
  window.__ewanLorenz = { mount }
  mount()
}

export function LorenzBackground() {
  function Component() {
    return h("canvas", { id: "lorenz-canvas", "aria-hidden": "true" })
  }
  Component.displayName = "LorenzBackground"
  Component.css = CSS
  Component.afterDOMLoaded = `(${lorenzRuntime.toString()})(${lorenzStep.toString()});`
  return Component
}
