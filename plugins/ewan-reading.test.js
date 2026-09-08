import assert from "node:assert/strict"
import test from "node:test"
import { projectToc, visibleTocLabels } from "./ewan-quartz-toc/components.js"
import { lorenzStep } from "./ewan-lorenz/components.js"

test("viewport center selects the closest visible heading all the way down an article", () => {
  const offsets = [0, 5, 20, 40, 100, 750, 1300, 2700, 2900]
  for (let start = 0; start < 3000; start += 17) {
    const g = projectToc(offsets, 3000, 600, start, start + 700)
    const end = Math.min(3000, start + 700),
      center = (start + end) / 2
    const visible = offsets
      .map((offset, i) => ({ offset, i }))
      .filter(({ offset }) => offset >= start && offset <= end)
    if (visible.length) {
      const closest = visible.toSorted(
        (a, b) => Math.abs(a.offset - center) - Math.abs(b.offset - center),
      )[0]
      assert.equal(g.active, closest.i)
    } else {
      assert.ok(offsets[g.active] <= center)
      assert.ok((offsets[g.active + 1] ?? 3000) > center)
    }
    g.positions.forEach((y, i) => assert.equal(y, (offsets[i] / 3000) * 600))
    assert.ok(Math.abs(g.viewportTop - (start / 3000) * 600) < 1e-8)
  }
  assert.equal(projectToc(offsets, 3000, 600, -200, 500).viewportHeight, 100)
  assert.equal(projectToc(offsets, 3000, 600, 2800, 3400).viewportHeight, 40)
})

test("a visible heading below center beats an off-screen previous heading", () => {
  assert.equal(projectToc([0, 50, 650, 1200], 1600, 500, 200, 1000).active, 2)
  assert.equal(projectToc([0, 350, 540, 700], 1000, 500, 100, 900).active, 2)
  assert.equal(projectToc([0, 100, 1400], 1600, 500, 300, 1000).active, 1)
})

test("dense label selection preserves marker positions and prioritizes keyboard focus", () => {
  const positions = Array.from({ length: 108 }, (_, i) => i * 3)
  const original = [...positions],
    heights = positions.map(() => 40)
  const { visible, tops } = visibleTocLabels(positions, heights, 400, [
    80,
    79,
    ...positions.map((_, i) => i),
  ])
  assert.ok(visible.includes(80))
  assert.ok(!visible.includes(79))
  const ordered = visible.toSorted((a, b) => tops[a] - tops[b])
  for (let i = 1; i < ordered.length; i++) assert.ok(tops[ordered[i]] >= tops[ordered[i - 1]] + 46)
  assert.deepEqual(positions, original)
})

test("Lorenz integration preserves equilibrium and converges with smaller steps", () => {
  const x = Math.sqrt((8 / 3) * 27)
  const fixed = [x, x, 27]
  lorenzStep(fixed).forEach((value, i) => assert.ok(Math.abs(value - fixed[i]) < 1e-12))
  function integrate(dt, n) {
    let p = [1, 1, 20]
    for (let i = 0; i < n; i++) p = lorenzStep(p, dt)
    return p
  }
  const reference = integrate(0.0015, 400)
  const error = (p) => Math.hypot(...p.map((v, i) => v - reference[i]))
  assert.ok(error(integrate(0.006, 100)) < error(integrate(0.012, 50)) / 8)
  assert.ok(integrate(0.006, 30000).every(Number.isFinite))
})
