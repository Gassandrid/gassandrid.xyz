import test from "node:test"
import assert from "node:assert/strict"
import { createNetwork, stepNetwork } from "./ewan-neural-background/network.js"

const parameterBounds = {
  drive: [0, 1],
  coupling: [0, 1.5],
  inhibition: [0, 2],
  oscillation: [0, 1],
  frequency: [0.1, 2],
  adaptation: [0, 1],
  noise: [0, 1],
}
const referenceParameters = {
  drive: 0.6,
  coupling: 0.9,
  inhibition: 1,
  oscillation: 0.3,
  frequency: 0.5,
  adaptation: 0.5,
  noise: 0.4,
}
const quietParameters = {
  drive: 0,
  coupling: 1,
  inhibition: 1,
  oscillation: 0,
  frequency: 0.5,
  adaptation: 0,
  noise: 0,
}
const layouts = ["clusters", "layers", "branches"]

function run(network, frames = 1800, parameters = network.parameters) {
  for (let i = 0; i < frames; i++) stepNetwork(network, 1 / 30, parameters)
  return network
}

function assertBounded(network) {
  assert.equal(network.dropped, 0)
  assert.ok(network.pending >= 0 && network.pending <= network.edges.length * 4)
  assert.ok(Number.isFinite(network.time))
  assert.ok(network.phase >= 0 && network.phase < Math.PI * 2)
  for (const node of network.nodes) {
    assert.ok(Number.isFinite(node.voltage) && node.voltage >= -0.4 && node.voltage <= 2)
    assert.ok(node.refractory >= 0 && node.refractory <= node.refractoryPeriod)
    assert.ok(node.adaptation >= 0 && node.adaptation <= 4)
    assert.ok(node.glow >= 0 && node.glow <= 1)
    assert.ok(Number.isFinite(node.noise) && Math.abs(node.noise) <= 3)
  }
  for (const module of network.modules) {
    assert.ok(Number.isFinite(module.noise) && Math.abs(module.noise) <= 3)
    assert.ok(module.phase >= 0 && module.phase < Math.PI * 2)
  }
  for (const edge of network.edges) {
    assert.equal(edge.packets.length, 4)
    for (const remaining of edge.packets) {
      assert.ok(Number.isFinite(remaining) && remaining >= 0 && remaining <= edge.delay + 1e-7)
    }
  }
}

test("seeded construction and every geometry remain sparse and inside the page gutters", () => {
  assert.equal(createNetwork({ count: 1e7 }).nodes.length, 160)
  assert.equal(createNetwork({ count: -1 }).nodes.length, 32)
  assert.equal(createNetwork({ layout: "unknown" }).layout, "clusters")
  for (const layout of layouts) {
    const a = createNetwork({ count: 112, seed: 7, layout })
    assert.deepEqual(a, createNetwork({ count: 112, seed: 7, layout }))
    assert.equal(a.seed, 7)
    assert.equal(a.layout, layout)
    assert.ok(a.edges.length >= a.nodes.length * 4 && a.edges.length <= a.nodes.length * 8)
    assert.ok(a.nodes.some((node) => node.inhibitory))
    assert.ok(a.nodes.some((node) => !node.inhibitory))
    assert.ok(new Set(a.nodes.map((node) => node.outgoing.length)).size > 1)
    for (const node of a.nodes) {
      assert.ok(node.x >= 0.018 && node.x <= 0.982 && (node.x <= 0.31 || node.x >= 0.69))
      assert.ok(node.y >= 0.025 && node.y <= 0.975)
      assert.equal(
        new Set(node.outgoing.map((index) => a.edges[index].to)).size,
        node.outgoing.length,
      )
      for (const index of node.outgoing) assert.equal(a.nodes[a.edges[index].from], node)
    }
    for (const edge of a.edges) {
      assert.notEqual(edge.from, edge.to)
      assert.equal(edge.weight < 0, a.nodes[edge.from].inhibitory)
      assert.ok(edge.delay >= 0.16 && edge.delay <= 0.7)
      // A firing neuron cannot fill all slots before the oldest is delivered.
      assert.ok(edge.packets.length * a.nodes[edge.from].refractoryPeriod > edge.delay)
    }
  }
})

test("geometry changes connectivity as well as positions", () => {
  const fields = layouts.map((layout) => createNetwork({ seed: 20, layout }))
  for (let i = 1; i < fields.length; i++) {
    assert.notDeepEqual(
      fields[0].nodes.map(({ x, y }) => [x, y]),
      fields[i].nodes.map(({ x, y }) => [x, y]),
    )
    assert.notDeepEqual(
      fields[0].edges.map(({ from, to }) => [from, to]),
      fields[i].edges.map(({ from, to }) => [from, to]),
    )
  }
  for (const field of fields) {
    const local = field.edges.filter((edge) => {
      const from = field.nodes[edge.from],
        to = field.nodes[edge.to]
      if (from.group === to.group) return true
      if (field.layout === "layers")
        return from.side === to.side && Math.abs(from.layer - to.layer) <= 1
      if (field.layout === "branches")
        return (
          field.modules[from.group].parent === to.group ||
          field.modules[to.group].parent === from.group
        )
      return false
    })
    assert.ok(local.length / field.edges.length > (field.layout === "clusters" ? 0.65 : 0.9))
    assert.ok(field.edges.some(({ from, to }) => field.nodes[from].side !== field.nodes[to].side))
  }
})

test("parameter input is bounded without sharing or replacing the caller's settings", () => {
  const settings = {
    drive: 8,
    coupling: -1,
    inhibition: NaN,
    oscillation: Infinity,
    frequency: 0,
    adaptation: 3,
    noise: -2,
  }
  const field = createNetwork({ seed: 23, parameters: settings })
  assert.equal(settings.drive, 8)
  assert.notEqual(field.parameters, settings)
  for (const [key, [lower, upper]] of Object.entries(parameterBounds)) {
    assert.ok(Number.isFinite(field.parameters[key]))
    assert.ok(field.parameters[key] >= lower && field.parameters[key] <= upper)
  }
  assert.equal(field.parameters.drive, 1)
  assert.equal(field.parameters.coupling, 0)
  assert.equal(field.parameters.frequency, 0.1)
  const reference = field.parameters
  reference.drive = 0.6
  stepNetwork(field, 0)
  assert.equal(field.time, 0)
  stepNetwork(field, 20)
  assert.equal(field.time, 0.05, "a stalled frame cannot inject a huge simulation step")
  run(field, 300)
  assert.equal(field.parameters, reference, "live UI controls keep their parameter object")
  run(field, 300, settings)
  assertBounded(field)
})

test("the same seed and live parameter edits replay exactly; another seed diverges", () => {
  const a = createNetwork({ seed: 207, layout: "branches" })
  const b = createNetwork({ seed: 207, layout: "branches" })
  const c = createNetwork({ seed: 208, layout: "branches" })
  assert.notDeepEqual(a.parameters, c.parameters)
  for (let frame = 0; frame < 900; frame++) {
    for (const field of [a, b, c]) {
      if (frame === 200) field.parameters.frequency = 1.4
      if (frame === 500) field.parameters.noise = 0.85
      stepNetwork(field, frame % 2 ? 1 / 30 : 1 / 60)
    }
  }
  assert.deepEqual(a, b)
  assert.notDeepEqual(
    a.nodes.map((node) => node.lastSpike),
    c.nodes.map((node) => node.lastSpike),
  )
})

test("a presynaptic spike reaches a target only after the connection delay", () => {
  const network = createNetwork({ count: 32, parameters: quietParameters })
  for (const node of network.nodes) {
    node.voltage = 0
    node.outgoing = []
  }
  const edge = network.edges.find((item) => item.weight > 0)
  network.nodes[edge.from].outgoing = [network.edges.indexOf(edge)]
  network.nodes[edge.from].voltage = 1.5
  network.nodes[edge.to].voltage = 0.85
  edge.delay = 0.15
  edge.weight = 0.8
  stepNetwork(network, 0.025)
  assert.equal(network.spikes, 1)
  assert.equal(network.nodes[edge.from].glow, 1, "the visual pulse represents an actual spike")
  assert.equal(network.nodes[edge.to].glow, 0)
  assert.equal(network.pending, 1)
  for (let i = 0; i < 5; i++) stepNetwork(network, 0.025)
  assert.equal(network.spikes, 1, "the delayed packet must not arrive early")
  for (let i = 0; i < 2; i++) stepNetwork(network, 0.025)
  assert.equal(network.spikes, 2, "recurrent input must cause a postsynaptic spike")
  assert.ok(network.nodes[edge.to].lastSpike > network.nodes[edge.from].lastSpike)
})

test("coupling and inhibition scale causal synaptic input", () => {
  const voltages = []
  for (const inhibition of [0, 1, 2]) {
    const field = createNetwork({ count: 32, parameters: { ...quietParameters, inhibition } })
    for (const node of field.nodes) node.voltage = 0
    const edge = field.edges.find((item) => item.weight < 0)
    const target = field.nodes[edge.to]
    target.voltage = 0.8
    edge.weight = -0.25
    edge.packets[0] = 0.01
    stepNetwork(field, 0.02)
    voltages.push(target.voltage)
  }
  assert.ok(voltages[0] > voltages[1] && voltages[1] > voltages[2])
  for (const coupling of [0, 1]) {
    const field = createNetwork({ count: 32, parameters: { ...quietParameters, coupling } })
    for (const node of field.nodes) node.voltage = 0
    const edge = field.edges.find((item) => item.weight > 0)
    field.nodes[edge.to].voltage = 0.8
    edge.weight = 0.5
    edge.packets[0] = 0.01
    stepNetwork(field, 0.02)
    assert.equal(field.spikes, coupling, "zero coupling disconnects transmission")
  }
})

test("refractory neurons ignore arriving packets and cannot spike", () => {
  const network = createNetwork({ count: 32, parameters: quietParameters })
  for (const node of network.nodes) {
    node.voltage = 0
    node.outgoing = []
  }
  const edge = network.edges.find((item) => item.weight > 0)
  const target = network.nodes[edge.to]
  target.refractory = 0.3
  for (let i = 0; i < 10; i++) {
    target.voltage = 2
    edge.packets[0] = 0.01
    stepNetwork(network, 0.025, 1)
    assert.equal(target.voltage, 0)
    assert.equal(target.lastSpike, -100)
    assert.equal(target.glow, 0)
  }
  assert.ok(target.refractory > 0)
})

test("adaptation accumulates after spikes and reduces sustained isolated firing", () => {
  const fixed = { ...referenceParameters, coupling: 0, oscillation: 0, noise: 0, drive: 0.8 }
  const unadapted = run(
    createNetwork({ count: 32, seed: 8, parameters: { ...fixed, adaptation: 0 } }),
  )
  const adapted = run(
    createNetwork({ count: 32, seed: 8, parameters: { ...fixed, adaptation: 1 } }),
  )
  assert.ok(adapted.spikes < unadapted.spikes * 0.8)
  assert.ok(adapted.nodes.some((node) => node.adaptation > 0.1))
  assert.ok(unadapted.nodes.every((node) => node.adaptation === 0))
  const before = adapted.nodes.map((node) => node.adaptation)
  run(adapted, 120, { ...quietParameters, coupling: 0 })
  assert.ok(adapted.nodes.every((node, i) => node.adaptation < before[i]))
})

test("each current and rhythm control changes simulated spike timing", () => {
  const outcomes = {}
  for (const [key, limits] of Object.entries(parameterBounds)) {
    outcomes[key] = limits.map((value) =>
      run(createNetwork({ seed: 20, parameters: { ...referenceParameters, [key]: value } })),
    )
    assert.notDeepEqual(
      outcomes[key][0].nodes.map((node) => node.lastSpike),
      outcomes[key][1].nodes.map((node) => node.lastSpike),
      `${key} must change dynamics`,
    )
  }
  assert.equal(outcomes.drive[0].spikes, 0)
  assert.ok(outcomes.drive[1].spikes > 100)
  assert.ok(outcomes.coupling[1].spikes > outcomes.coupling[0].spikes)
  assert.ok(outcomes.inhibition[1].spikes < outcomes.inhibition[0].spikes)
  assert.ok(outcomes.adaptation[1].spikes < outcomes.adaptation[0].spikes)
})

test("rounded defaults sustain distributed activity across seeds and geometries", () => {
  for (const layout of layouts)
    for (const seed of [1, 7, 20, 301, 4294967295, 271828]) {
      const field = createNetwork({ seed, layout })
      for (const key of Object.keys(field.parameters))
        field.parameters[key] = Math.round(field.parameters[key] / 0.05) * 0.05
      const participating = new Set()
      let firstSpike = Infinity,
        maxTogether = 0,
        lateSpikes = 0
      for (let frame = 0; frame < 1800; frame++) {
        const before = field.spikes
        stepNetwork(field, 1 / 30)
        const fired = field.spikes - before
        if (fired && firstSpike === Infinity) firstSpike = field.time
        if (frame >= 900) lateSpikes += fired
        maxTogether = Math.max(maxTogether, fired)
        field.nodes.forEach((node, i) => {
          if (node.lastSpike === field.time) participating.add(i)
        })
      }
      assert.ok(firstSpike < 3, `${layout}/${seed} starts promptly`)
      assert.ok(lateSpikes > field.nodes.length, `${layout}/${seed} keeps firing after startup`)
      assert.ok(participating.size > field.nodes.length * 0.9)
      assert.ok(
        maxTogether < field.nodes.length * 0.25,
        "the whole field must not fire in lockstep",
      )
      assertBounded(field)
    }
})

test("all parameter corners stay bounded for a minute in every geometry", () => {
  const keys = Object.keys(parameterBounds)
  for (const layout of layouts)
    for (let corner = 0; corner < 128; corner++) {
      const parameters = Object.fromEntries(
        keys.map((key, bit) => [key, parameterBounds[key][(corner >> bit) & 1]]),
      )
      const field = createNetwork({ count: 32, seed: 59 + corner * 7919, layout, parameters })
      run(field)
      assertBounded(field)
    }
})

test("ten-minute maximum-size runs retain fixed state and transmission storage", () => {
  for (const layout of layouts) {
    const network = createNetwork({
      count: 160,
      layout,
      parameters: {
        drive: 1,
        coupling: 1.5,
        inhibition: 0,
        oscillation: 1,
        frequency: 2,
        adaptation: 0,
        noise: 1,
      },
    })
    const nodes = network.nodes,
      edges = network.edges,
      modules = network.modules
    const packets = edges.map((edge) => edge.packets)
    const keys = Object.keys(network)
    run(network, 18000)
    assert.equal(network.nodes, nodes)
    assert.equal(network.nodes.length, 160)
    assert.equal(network.edges, edges)
    assert.equal(network.modules, modules)
    assert.deepEqual(Object.keys(network), keys)
    assert.ok(network.spikes > 10000)
    assertBounded(network)
    network.edges.forEach((edge, i) => assert.equal(edge.packets, packets[i]))
  }
})

test("legacy numeric activity remains deterministic and zero input settles", () => {
  const quiet = run(createNetwork({ seed: 20 }), 1200, 0)
  const active = run(createNetwork({ seed: 20 }), 1200, 0.8)
  assert.equal(quiet.spikes, 0)
  assert.equal(quiet.pending, 0)
  assert.ok(active.spikes > 100)
})
