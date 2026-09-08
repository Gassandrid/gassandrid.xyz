// Dimensionless adaptive leaky integrate-and-fire dynamics for generative art.
// This is neither recorded activity nor a fitted biological model; frequency is
// in cycles per animation second. Both functions are self-contained for inlining.
export function createNetwork({
  count = 112,
  seed = 271828,
  parameters = {},
  layout = "clusters",
} = {}) {
  const size = Math.max(32, Math.min(160, Math.round(Number(count) || 112)))
  const networkSeed = seed >>> 0
  let randomState = networkSeed
  function random() {
    randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0
    return randomState / 4294967296
  }
  function bounded(value, fallback, lower, upper) {
    return Number.isFinite(value) ? Math.max(lower, Math.min(upper, value)) : fallback
  }
  const settings = parameters && typeof parameters === "object" ? parameters : {}
  const defaults = {
    drive: 0.48 + random() * 0.16,
    coupling: 0.78 + random() * 0.24,
    inhibition: 0.9 + random() * 0.35,
    oscillation: 0.2 + random() * 0.2,
    frequency: 0.28 + random() * 0.37,
    adaptation: 0.35 + random() * 0.25,
    noise: 0.25 + random() * 0.2,
  }
  const values = {
    drive: bounded(settings.drive, defaults.drive, 0, 1),
    coupling: bounded(settings.coupling, defaults.coupling, 0, 1.5),
    inhibition: bounded(settings.inhibition, defaults.inhibition, 0, 2),
    oscillation: bounded(settings.oscillation, defaults.oscillation, 0, 1),
    frequency: bounded(settings.frequency, defaults.frequency, 0.1, 2),
    adaptation: bounded(settings.adaptation, defaults.adaptation, 0, 1),
    noise: bounded(settings.noise, defaults.noise, 0, 1),
  }
  const geometry = ["clusters", "layers", "branches"].includes(layout) ? layout : "clusters"
  const modules = []
  if (geometry === "branches") {
    // Two abstract branching trees. These are graph filaments, not anatomical
    // dendrites: nearby segments share current fluctuations and local links.
    for (let side = 0; side < 2; side++) {
      const splitY = 0.29 + random() * 0.08
      const forkY = 0.59 + random() * 0.08
      const rootX = 0.12 + random() * 0.035
      const forkX = [0.065 + random() * 0.02, 0.215 + random() * 0.025]
      const segments = [
        [rootX - 0.015, 0.055, rootX, splitY, -1, 0],
        [rootX, splitY, forkX[0], forkY, 0, 1],
        [rootX, splitY, forkX[1], forkY, 0, 1],
        [forkX[0], forkY, 0.025 + random() * 0.015, 0.945, 1, 2],
        [forkX[0], forkY, 0.105 + random() * 0.025, 0.925, 1, 2],
        [forkX[1], forkY, 0.18 + random() * 0.02, 0.945, 2, 2],
        [forkX[1], forkY, 0.265 + random() * 0.025, 0.925, 2, 2],
      ]
      const offset = modules.length
      for (const [ax, ay, bx, by, parent, layer] of segments) {
        modules.push({
          side,
          layer,
          ax: side ? 1 - ax : ax,
          ay,
          bx: side ? 1 - bx : bx,
          by,
          parent: parent < 0 ? -1 : offset + parent,
        })
      }
    }
  } else {
    const depth =
      geometry === "layers" ? 4 + Math.floor(random() * 3) : 3 + Math.floor(random() * 2)
    for (let layer = 0; layer < depth; layer++) {
      for (let side = 0; side < 2; side++) {
        const y =
          geometry === "layers"
            ? 0.08 + (layer / (depth - 1)) * 0.84
            : (layer + 0.5) / depth + (random() - 0.5) * 0.09
        const x = 0.12 + random() * 0.055
        modules.push({
          side,
          layer,
          parent: -1,
          x: side ? 1 - x : x,
          y,
          rx: geometry === "layers" ? 0.11 : 0.055 + random() * 0.05,
          ry: geometry === "layers" ? 0.022 : 0.09 + random() * 0.065,
        })
      }
    }
  }
  for (const module of modules) {
    module.phase = random() * Math.PI * 2
    module.frequencyRatio = 0.75 + random() * 0.55
    module.noise = 0
    module.noiseTau = 0.65 + random() * 1.25
  }
  const nodes = []
  for (let i = 0; i < size; i++) {
    const group = i % modules.length
    const module = modules[group]
    let x, y
    if (geometry === "branches") {
      const t = random()
      x = module.ax + (module.bx - module.ax) * t + (random() - 0.5) * 0.016
      y = module.ay + (module.by - module.ay) * t + (random() - 0.5) * 0.015
    } else {
      const angle = random() * Math.PI * 2
      const radius = Math.sqrt(random())
      x = module.x + Math.cos(angle) * radius * module.rx
      y = module.y + Math.sin(angle) * radius * module.ry
    }
    const inhibitory = random() < 0.23
    nodes.push({
      x: Math.max(module.side ? 0.69 : 0.018, Math.min(module.side ? 0.982 : 0.31, x)),
      y: Math.max(0.025, Math.min(0.975, y)),
      group,
      side: module.side,
      layer: module.layer,
      inhibitory,
      voltage: random() * 0.72,
      refractory: 0,
      refractoryPeriod: 0.26 + random() * 0.14,
      tau: (inhibitory ? 0.63 : 0.72) + random() * 0.24,
      glow: 0,
      phase: random() * Math.PI * 2,
      bias: 0.64 + random() * 0.64,
      adaptation: 0,
      adaptationTau: 1.35 + random() * 2.15,
      adaptationGain: 0.36 + random() * 0.3,
      noise: 0,
      lastSpike: -100,
      outgoing: [],
    })
  }
  const edges = []
  nodes.forEach((node, i) => {
    const neighbors = []
    nodes.forEach((other, j) => {
      if (j === i) return
      const distance = Math.hypot((node.x - other.x) * 1.6, node.y - other.y)
      let score = distance
      if (node.side !== other.side) score += 0.65
      if (geometry === "clusters" && node.group !== other.group) score += 0.12
      if (geometry === "layers") {
        score += Math.max(0, Math.abs(node.layer - other.layer) - 1) * 0.18
        if (node.group === other.group) score *= 0.8
      }
      if (geometry === "branches" && node.group !== other.group) {
        const related =
          modules[node.group].parent === other.group || modules[other.group].parent === node.group
        score += related ? 0.025 : 0.24
      }
      neighbors.push({ j, distance, score: score * (0.82 + random() * 0.36) })
    })
    neighbors.sort((a, b) => a.score - b.score)
    const localDegree = 3 + Math.floor(random() * 3) + (node.inhibitory ? 1 : 0)
    const selected = neighbors.slice(0, localDegree)
    const shortcuts = random() < 0.2 ? 2 : 1
    for (let shortcut = 0; shortcut < shortcuts; shortcut++) {
      const crossField = random() < 0.085
      let candidates = neighbors.filter(({ j }) => {
        if (selected.some((item) => item.j === j)) return false
        const other = nodes[j]
        if (crossField) return other.side !== node.side
        if (other.side !== node.side) return false
        if (geometry === "layers")
          return (
            other.layer === node.layer + 1 || (node.layer > 0 && other.layer === node.layer - 1)
          )
        if (geometry === "branches")
          return (
            modules[node.group].parent === other.group || modules[other.group].parent === node.group
          )
        return other.group !== node.group
      })
      if (!candidates.length)
        candidates = neighbors.filter(({ j }) => !selected.some((item) => item.j === j))
      selected.push(candidates[Math.floor(random() * candidates.length)])
    }
    for (const { j, distance } of selected) {
      node.outgoing.push(edges.length)
      edges.push({
        from: i,
        to: j,
        weight: (node.inhibitory ? -0.66 : 0.31) * (0.72 + random() * 0.56),
        delay: Math.min(0.7, 0.16 + distance * 0.5 + random() * 0.1),
        bend: (random() - 0.5) * (geometry === "branches" ? 0.24 : 0.5),
        // delay <= .7 and refractory >= .26 guarantee capacity, even at the
        // fastest permitted firing rate. Slots are never grown or replaced.
        packets: new Float32Array(4),
      })
    }
  })
  return {
    seed: networkSeed,
    layout: geometry,
    parameters: values,
    nodes,
    edges,
    modules,
    randomState,
    time: 0,
    phase: 0,
    spikes: 0,
    pending: 0,
    dropped: 0,
  }
}

export function stepNetwork(network, dt = 1 / 30, parametersOrLegacyNumber = network.parameters) {
  const elapsed = Math.max(0, Math.min(0.05, Number(dt) || 0))
  if (!elapsed) return network
  const legacy = typeof parametersOrLegacyNumber === "number"
  const p =
    !legacy && parametersOrLegacyNumber && typeof parametersOrLegacyNumber === "object"
      ? parametersOrLegacyNumber
      : network.parameters
  const input = legacy ? parametersOrLegacyNumber : p.drive
  const drive = Number.isFinite(input) ? Math.max(0, Math.min(1, input)) : 0.55
  const coupling = legacy
    ? 1
    : Number.isFinite(p.coupling)
      ? Math.max(0, Math.min(1.5, p.coupling))
      : 0.9
  const inhibition = legacy
    ? 1
    : Number.isFinite(p.inhibition)
      ? Math.max(0, Math.min(2, p.inhibition))
      : 1.1
  const oscillation = legacy
    ? 0
    : Number.isFinite(p.oscillation)
      ? Math.max(0, Math.min(1, p.oscillation))
      : 0.3
  const frequency = Number.isFinite(p.frequency) ? Math.max(0.1, Math.min(2, p.frequency)) : 0.5
  const adaptation = legacy
    ? 0
    : Number.isFinite(p.adaptation)
      ? Math.max(0, Math.min(1, p.adaptation))
      : 0.45
  const noise = legacy ? 0 : Number.isFinite(p.noise) ? Math.max(0, Math.min(1, p.noise)) : 0.35
  network.time += elapsed
  // Integrating phase keeps the wave continuous while its frequency is edited.
  const phaseStep = elapsed * frequency * Math.PI * 2
  network.phase = (network.phase + phaseStep) % (Math.PI * 2)
  const globalWave = Math.sin(network.phase)
  let randomState = network.randomState
  for (const module of network.modules) {
    module.phase = (module.phase + phaseStep * module.frequencyRatio) % (Math.PI * 2)
    const decay = Math.exp(-elapsed / module.noiseTau)
    randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0
    module.noise = Math.max(
      -3,
      Math.min(
        3,
        module.noise * decay +
          ((randomState / 4294967296) * 2 - 1) * Math.sqrt(3 * (1 - decay * decay)),
      ),
    )
  }
  network.pending = 0
  for (const edge of network.edges) {
    for (let slot = 0; slot < edge.packets.length; slot++) {
      const remaining = edge.packets[slot]
      if (remaining <= 0) continue
      edge.packets[slot] = Math.max(0, remaining - elapsed)
      if (edge.packets[slot] === 0) {
        const target = network.nodes[edge.to]
        if (target.refractory <= 0) {
          const weight = edge.weight * coupling * (edge.weight < 0 ? inhibition : 1)
          target.voltage = Math.max(-0.4, Math.min(2, target.voltage + weight))
        }
      } else network.pending++
    }
  }
  const noiseDecay = Math.exp(-elapsed / 0.22)
  const noiseScale = Math.sqrt(3 * (1 - noiseDecay * noiseDecay))
  const glowDecay = Math.exp(-elapsed / 0.22)
  for (const node of network.nodes) {
    node.glow *= glowDecay
    node.adaptation *= Math.exp(-elapsed / node.adaptationTau)
    randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0
    node.noise = Math.max(
      -3,
      Math.min(3, node.noise * noiseDecay + ((randomState / 4294967296) * 2 - 1) * noiseScale),
    )
    if (node.refractory > 0) {
      node.refractory = Math.max(0, node.refractory - elapsed)
      node.voltage = 0
      continue
    }
    const module = network.modules[node.group]
    const wave = globalWave * 0.35 + Math.sin(module.phase + node.phase * 0.12) * 0.7
    const fluctuation = noise * (module.noise * 0.4 + node.noise * 0.25)
    const current =
      drive * (0.8 + node.bias * 2.2 + oscillation * wave + fluctuation) - node.adaptation
    const leak = Math.exp(-elapsed / node.tau)
    node.voltage = Math.max(
      -0.4,
      Math.min(2, node.voltage * leak + current * node.tau * (1 - leak)),
    )
    if (node.voltage < 1) continue
    node.voltage = 0
    node.refractory = node.refractoryPeriod
    node.adaptation = Math.min(4, node.adaptation + adaptation * node.adaptationGain)
    node.glow = 1
    node.lastSpike = network.time
    network.spikes++
    for (const edgeIndex of node.outgoing) {
      const edge = network.edges[edgeIndex]
      let slot = 0
      while (slot < edge.packets.length && edge.packets[slot] > 0) slot++
      if (slot < edge.packets.length) {
        edge.packets[slot] = edge.delay
        network.pending++
      } else network.dropped++
    }
  }
  network.randomState = randomState
  return network
}
