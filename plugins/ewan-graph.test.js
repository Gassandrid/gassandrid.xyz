import assert from "node:assert/strict"
import test from "node:test"
import vm from "node:vm"
import { Graph, manageGraphRendering, patchGraphPerformance } from "./ewan-graph/components.js"

test("graph renders on activity, pauses when hidden, and disposes pending work", () => {
  const frames = new Map()
  const canvas = new EventTarget()
  const document = new EventTarget()
  document.hidden = false
  let inViewport = true
  const container = {
    getBoundingClientRect: () => ({
      width: 256,
      height: 250,
      left: 0,
      right: 256,
      top: inViewport ? 0 : -300,
      bottom: inViewport ? 250 : -50,
    }),
  }
  canvas.parentElement = container
  const observers = []
  class Observer {
    constructor(callback) {
      this.callback = callback
      this.disconnected = false
      observers.push(this)
    }
    observe() {}
    disconnect() {
      this.disconnected = true
    }
  }
  let frameId = 0
  const context = vm.createContext({
    document,
    innerWidth: 1440,
    innerHeight: 900,
    IntersectionObserver: Observer,
    ResizeObserver: Observer,
    requestAnimationFrame: (callback) => {
      frames.set(++frameId, callback)
      return frameId
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  })
  let renders = 0
  let updates = 0
  let stopped = 0
  let restarted = 0
  let disposed = 0
  let automaticRendering = true
  let alpha = 1
  let tick
  const app = {
    canvas,
    stop: () => (automaticRendering = false),
    render: () => renders++,
  }
  const simulation = {
    on: (name, callback) => {
      assert.equal(name, "tick")
      tick = callback
    },
    stop: () => stopped++,
    restart: () => restarted++,
    alpha: () => alpha,
    alphaMin: () => 0.001,
  }
  const flush = () => {
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach((callback) => callback())
  }
  const manage = vm.runInContext(`(${manageGraphRendering.toString()})`, context)
  const cleanup = manage(
    app,
    simulation,
    () => updates++,
    () => disposed++,
  )
  assert.equal(automaticRendering, false)
  assert.equal(restarted, 1)
  tick()
  canvas.dispatchEvent(new Event("pointermove"))
  assert.equal(frames.size, 1, "concurrent physics and pointer events share one frame")
  flush()
  assert.equal(renders, 1)
  assert.equal(updates, 1)
  assert.equal(frames.size, 0, "a settled graph must not request another frame")

  tick()
  document.hidden = true
  document.dispatchEvent(new Event("visibilitychange"))
  assert.equal(stopped, 1)
  assert.equal(frames.size, 0)
  canvas.dispatchEvent(new Event("wheel"))
  assert.equal(frames.size, 0)

  document.hidden = false
  alpha = 0
  document.dispatchEvent(new Event("visibilitychange"))
  assert.equal(restarted, 1, "showing a settled layout must not restart physics")
  flush()
  assert.equal(renders, 2)
  inViewport = false
  observers[0].callback()
  assert.equal(stopped, 2)
  tick()
  assert.equal(frames.size, 0)

  inViewport = true
  observers[0].callback()
  cleanup()
  assert.equal(disposed, 1)
  assert.equal(frames.size, 0)
  assert.ok(observers.every((observer) => observer.disconnected))
  tick()
  document.dispatchEvent(new Event("visibilitychange"))
  canvas.dispatchEvent(new Event("pointermove"))
  assert.equal(frames.size, 0, "navigation cleanup must leave no drawing work")
})

test("graph lifecycle patch accepts the installed upstream runtime and rejects drift", () => {
  const runtime = Graph().afterDOMLoaded
  assert.match(runtime, /pixi\.js@8\/dist\/pixi\.min\.js/)
  assert.doesNotThrow(() => new Function(runtime))
  assert.throws(() => patchGraphPerformance("changed upstream"), /runtime changed/)
})
