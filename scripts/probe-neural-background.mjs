import assert from "node:assert/strict"
import puppeteer from "puppeteer-core"

const origin = process.env.QUARTZ_PROBE_URL ?? "http://127.0.0.1:8196"
const route = "/thoughts/on-capturing-personal-data.html"
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
})
const errors = []
const result = {}
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const parameterNames = [
  "drive",
  "coupling",
  "inhibition",
  "oscillation",
  "frequency",
  "adaptation",
  "noise",
]
const motionControl = "#neural-controls [data-motion]"
try {
  const page = await browser.newPage()
  page.on("pageerror", (error) => errors.push(error.message))
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 })
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }])
  await page.goto(origin + route, { waitUntil: "networkidle0" })
  await page.waitForFunction(
    () => Number(document.querySelector("#neural-canvas")?.dataset.neuralFrames) >= 90,
  )
  const read = () =>
    page.$eval("#neural-canvas", (canvas) => ({
      ...canvas.dataset,
      width: canvas.width,
      height: canvas.height,
    }))
  const readRecipe = () =>
    page.evaluate(() => {
      const canvas = document.querySelector("#neural-canvas")
      const controls = document.querySelector("#neural-controls")
      return {
        seed: Number(canvas.dataset.neuralSeed),
        layout: canvas.dataset.neuralLayout,
        parameters: JSON.parse(canvas.dataset.neuralParameters),
        topology: canvas.dataset.neuralTopology,
        inputSeed: Number(controls.querySelector("[data-seed]").value),
        inputLayout: controls.querySelector("[data-layout]").value,
        inputParameters: Object.fromEntries(
          [...controls.querySelectorAll("[data-param]")].map((input) => [
            input.dataset.param,
            Number(input.value),
          ]),
        ),
        ink: Number(controls.querySelector("[data-ink]").value),
      }
    })
  const assertBoundRecipe = (recipe) => {
    assert.ok(Number.isInteger(recipe.seed) && recipe.seed >= 0 && recipe.seed <= 0xffffffff)
    assert.ok(["clusters", "layers", "branches"].includes(recipe.layout))
    assert.ok(recipe.topology?.length > 0, "Network has no topology signature")
    assert.equal(recipe.inputSeed, recipe.seed)
    assert.equal(recipe.inputLayout, recipe.layout)
    assert.deepEqual(Object.keys(recipe.parameters).sort(), [...parameterNames].sort())
    assert.deepEqual(recipe.inputParameters, recipe.parameters)
  }
  const waitForFramesAfter = (frames) =>
    page.waitForFunction(
      (previous) =>
        Number(document.querySelector("#neural-canvas").dataset.neuralFrames) > previous,
      {},
      Number(frames),
    )
  const changeRange = async (selector) => {
    const before = await page.$eval(selector, (input) => ({
      value: Number(input.value),
      min: Number(input.min),
      max: Number(input.max),
    }))
    await page.focus(selector)
    await page.keyboard.press(
      before.value < (before.min + before.max) / 2 ? "ArrowRight" : "ArrowLeft",
    )
    const value = await page.$eval(selector, (input) => Number(input.value))
    assert.notEqual(value, before.value, `${selector} did not respond to keyboard input`)
    return value
  }
  result.running = await read()
  assert.equal(result.running.neuralState, "running")
  assert.ok(Number(result.running.neuralSpikes) > 0, "Network never spiked")
  assert.ok(Number(result.running.neuralDrawMs) < 8, "Background exceeded draw budget")
  assert.ok(Number(result.running.neuralDpr) <= 1.5)
  assert.ok(Number(result.running.neuralPending) <= Number(result.running.neuralPacketCapacity))
  assert.equal(result.running.neuralDropped, "0")
  const firstRecipe = await readRecipe()
  assertBoundRecipe(firstRecipe)

  // A full document load starts a unique network; in-document navigation below
  // must retain the reader's experiment instead.
  await page.reload({ waitUntil: "networkidle0" })
  await page.waitForFunction(
    () => Number(document.querySelector("#neural-canvas")?.dataset.neuralFrames) >= 30,
  )
  const freshRecipe = await readRecipe()
  assertBoundRecipe(freshRecipe)
  assert.notEqual(freshRecipe.seed, firstRecipe.seed, "Full reload reused the previous seed")
  assert.notEqual(freshRecipe.topology, firstRecipe.topology)
  result.freshDocument = { previousSeed: firstRecipe.seed, seed: freshRecipe.seed }

  // A real background tab must freeze its simulation and frame count.
  const foreground = await browser.newPage()
  await foreground.bringToFront()
  await page.waitForFunction(() => document.hidden)
  await page.waitForFunction(
    () => document.querySelector("#neural-canvas").dataset.neuralState === "paused",
  )
  const hidden = await read()
  await pause(500)
  assert.equal((await read()).neuralFrames, hidden.neuralFrames)
  assert.equal((await read()).neuralSimTime, hidden.neuralSimTime)
  result.hidden = { frames: hidden.neuralFrames, frozen: true }
  await foreground.close()
  await page.bringToFront()
  await waitForFramesAfter(hidden.neuralFrames)

  await page.click("#neural-controls > summary")
  const parameterFrames = Number((await read()).neuralFrames)
  for (const parameter of parameterNames) {
    const before = await read()
    const value = await changeRange(`#neural-controls [data-param="${parameter}"]`)
    await page.waitForFunction(
      (key, expected) =>
        JSON.parse(document.querySelector("#neural-canvas").dataset.neuralParameters)[key] ===
        expected,
      {},
      parameter,
      value,
    )
    assert.ok(
      Number((await read()).neuralFrames) >= Number(before.neuralFrames),
      `${parameter} reset the animation frame count`,
    )
    await waitForFramesAfter(before.neuralFrames)
    const recipe = await readRecipe()
    assertBoundRecipe(recipe)
    assert.equal(recipe.seed, freshRecipe.seed, `${parameter} reset the seed`)
    assert.equal(recipe.topology, freshRecipe.topology, `${parameter} rebuilt the network`)
  }
  await changeRange("#neural-controls [data-ink]")
  const editedRecipe = await readRecipe()
  assert.equal(
    await page.$eval("#neural-canvas", (canvas) =>
      Number(canvas.style.getPropertyValue("--neural-ink")),
    ),
    editedRecipe.ink,
  )
  result.parameters = {
    values: editedRecipe.parameters,
    ink: editedRecipe.ink,
    seedRetained: true,
    topologyRetained: true,
    framesAdvanced: Number((await read()).neuralFrames) - parameterFrames,
  }

  const layouts = [
    ...["clusters", "layers", "branches"].filter((layout) => layout !== editedRecipe.layout),
    editedRecipe.layout,
  ]
  result.layouts = []
  let previousTopology = editedRecipe.topology
  for (const layout of layouts) {
    await page.focus("#neural-controls [data-layout]")
    await page.select("#neural-controls [data-layout]", layout)
    await page.waitForFunction(
      (expected) => {
        const canvas = document.querySelector("#neural-canvas")
        return canvas.dataset.neuralLayout === expected && canvas.dataset.neuralState === "running"
      },
      {},
      layout,
    )
    await waitForFramesAfter((await read()).neuralFrames)
    const recipe = await readRecipe()
    assertBoundRecipe(recipe)
    assert.equal(recipe.layout, layout)
    assert.equal(recipe.seed, editedRecipe.seed, "Changing geometry replaced the seed")
    assert.deepEqual(recipe.parameters, editedRecipe.parameters)
    assert.equal(recipe.ink, editedRecipe.ink)
    assert.notEqual(recipe.topology, previousTopology, "Changing geometry reused the topology")
    assert.equal(await page.$eval("#neural-controls", (controls) => controls.open), true)
    assert.equal(
      await page.evaluate(() => document.activeElement?.hasAttribute("data-layout")),
      true,
    )
    previousTopology = recipe.topology
    result.layouts.push({ layout, topology: recipe.topology })
  }
  assert.equal(
    previousTopology,
    editedRecipe.topology,
    "Returning to a geometry was not reproducible",
  )

  // Committing a seed on blur must not replace the controls before the same
  // pointer click reaches New network or the geometry selector.
  await page.focus("#neural-controls [data-seed]")
  await page.$eval("#neural-controls [data-seed]", (input) => input.select())
  await page.keyboard.type("42")
  await page.click("#neural-controls [data-new-network]")
  await page.waitForFunction(
    (previous) => {
      const seed = Number(document.querySelector("#neural-canvas").dataset.neuralSeed)
      return seed !== previous && seed !== 42
    },
    {},
    editedRecipe.seed,
  )
  await waitForFramesAfter((await read()).neuralFrames)
  const rerolled = await readRecipe()
  assertBoundRecipe(rerolled)
  assert.equal(rerolled.layout, editedRecipe.layout)
  assert.notEqual(rerolled.topology, editedRecipe.topology)
  assert.notDeepEqual(
    rerolled.parameters,
    editedRecipe.parameters,
    "New network kept all old parameters",
  )
  assert.equal(rerolled.ink, editedRecipe.ink)
  assert.equal(await page.$eval("#neural-controls", (controls) => controls.open), true)
  assert.equal(
    await page.evaluate(() => document.activeElement?.hasAttribute("data-new-network")),
    true,
    "Committing a seed swallowed the New network click",
  )

  await page.focus("#neural-controls [data-seed]")
  await page.$eval("#neural-controls [data-seed]", (input) => input.select())
  await page.keyboard.type(String(editedRecipe.seed))
  await page.click("#neural-controls [data-layout]")
  const pendingSeedLayout = layouts[0]
  await page.select("#neural-controls [data-layout]", pendingSeedLayout)
  await page.waitForFunction(
    (seed, layout) => {
      const canvas = document.querySelector("#neural-canvas")
      return Number(canvas.dataset.neuralSeed) === seed && canvas.dataset.neuralLayout === layout
    },
    {},
    editedRecipe.seed,
    pendingSeedLayout,
  )
  const seedAndGeometry = await readRecipe()
  assertBoundRecipe(seedAndGeometry)
  assert.deepEqual(seedAndGeometry.parameters, rerolled.parameters)
  assert.equal(
    await page.evaluate(() => document.activeElement?.hasAttribute("data-layout")),
    true,
    "Committing a seed swallowed the geometry click",
  )
  await page.select("#neural-controls [data-layout]", editedRecipe.layout)
  await page.waitForFunction(
    (layout) => document.querySelector("#neural-canvas").dataset.neuralLayout === layout,
    {},
    editedRecipe.layout,
  )
  await waitForFramesAfter((await read()).neuralFrames)
  const reproducedRecipe = await readRecipe()
  assertBoundRecipe(reproducedRecipe)
  assert.equal(reproducedRecipe.seed, editedRecipe.seed)
  assert.equal(reproducedRecipe.layout, editedRecipe.layout)
  assert.equal(
    reproducedRecipe.topology,
    editedRecipe.topology,
    "Entering a seed did not reproduce topology",
  )
  assert.deepEqual(
    reproducedRecipe.parameters,
    rerolled.parameters,
    "Entering a seed reset tuned parameters",
  )
  assert.equal(reproducedRecipe.ink, rerolled.ink)
  result.newNetwork = {
    previousSeed: editedRecipe.seed,
    generatedSeed: rerolled.seed,
    regeneratedParameters: rerolled.parameters,
    explicitSeedReproducedTopology: true,
    seedBlurPreservedNewNetworkClick: true,
    seedBlurPreservedGeometryClick: true,
  }

  // Preserve deliberate tuning through pause/resume and SPA, so regenerating
  // seed-derived defaults cannot accidentally satisfy the persistence check.
  await changeRange('#neural-controls [data-param="drive"]')
  await changeRange('#neural-controls [data-param="oscillation"]')
  const retainedRecipe = await readRecipe()
  assertBoundRecipe(retainedRecipe)
  assert.notDeepEqual(retainedRecipe.parameters, reproducedRecipe.parameters)

  await page.select(motionControl, "off")
  result.off = await read()
  assert.equal(result.off.neuralState, "off")
  assert.equal(result.off.width, 0)
  assert.equal(result.off.height, 0)
  await pause(250)
  assert.equal((await read()).neuralFrames, result.off.neuralFrames)
  assert.deepEqual(await readRecipe(), retainedRecipe, "Switching off lost the network settings")
  await page.select(motionControl, "auto")
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
  await page.waitForFunction(
    () => document.querySelector("#neural-canvas").dataset.neuralState === "off",
  )
  assert.equal((await read()).width, 0)
  await page.select(motionControl, "on")
  await page.waitForFunction(
    () => document.querySelector("#neural-canvas").dataset.neuralState === "running",
  )
  await waitForFramesAfter((await read()).neuralFrames)
  assert.deepEqual(await readRecipe(), retainedRecipe, "Resuming lost the network settings")
  await page.keyboard.press("Escape")
  assert.equal(await page.$eval("#neural-controls", (controls) => controls.open), false)

  await page.evaluate(() => {
    window.__neuralProbeDocument = "retained"
  })
  for (const target of ["/", route, "/", route]) {
    await page.evaluate((path) => window.spaNavigate(new URL(path, location.origin)), target)
    await page.waitForFunction(
      () => document.querySelector("#neural-canvas")?.dataset.neuralState === "running",
    )
    assert.equal(await page.evaluate(() => window.__neuralProbeDocument), "retained")
    assert.equal(await page.$$eval("#neural-canvas", (items) => items.length), 1)
    assert.equal(await page.$$eval("#neural-controls", (items) => items.length), 1)
    assert.deepEqual(
      await readRecipe(),
      retainedRecipe,
      `SPA navigation to ${target} lost settings`,
    )
    assert.equal(await page.$eval(motionControl, (input) => input.value), "on")
  }
  result.spa = {
    transitions: 4,
    canvases: 1,
    controls: 1,
    sameDocument: true,
    seedAndParametersAndLayoutRetained: true,
  }
  await page.setViewport({ width: 390, height: 844 })
  await page.waitForFunction(
    () => document.querySelector("#neural-canvas").dataset.neuralState === "off",
  )
  result.mobile = await read()
  assert.equal(result.mobile.width, 0)
  assert.equal(result.mobile.height, 0)
  assert.equal(
    await page.$eval("#neural-controls", (controls) => controls.getClientRects().length),
    0,
  )
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 2 })
  await page.waitForFunction(
    () => document.querySelector("#neural-canvas").dataset.neuralState === "running",
  )
  const large = await read()
  assert.ok(large.width * large.height <= 3_000_000, "Large-screen canvas exceeded pixel budget")
  result.largeScreen = {
    width: large.width,
    height: large.height,
    pixels: large.width * large.height,
  }
  await page.$eval("#neural-canvas", (canvas) => {
    canvas.getContext("2d").drawImage = () => {
      throw new DOMException("Injected lost drawing surface", "InvalidStateError")
    }
  })
  await page.waitForFunction(
    () => document.querySelector("#neural-canvas").dataset.neuralState === "off",
  )
  const failure = await read()
  await pause(300)
  assert.equal(
    (await read()).neuralFrames,
    failure.neuralFrames,
    "Drawing failure kept scheduling frames",
  )
  assert.equal(failure.width, 0)
  assert.equal(failure.height, 0)
  result.drawingFailure = { stopped: true, backingReleased: true }
  assert.deepEqual(errors, [])
  console.log(JSON.stringify(result, null, 2))
} finally {
  await browser.close()
}
