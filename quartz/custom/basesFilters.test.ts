import assert from "node:assert/strict"
import test from "node:test"
import fs from "node:fs"
import { parse } from "yaml"
import { evaluateFilter, type EvalContext } from "../../.quartz/plugins/bases-page/src/compiler"

test("published compound Base accepts scalar and list properties, rejects other categories", () => {
  const data = parse(
    fs.readFileSync("content/Notes/Neuropharmacology/Nootropic Compounds.base", "utf8"),
  )
  const matches = (note: Record<string, unknown>) =>
    evaluateFilter(data.views[0].filters, { note, file: {}, formula: {} } as EvalContext)
  assert.equal(matches({ class: ["medication"], category: "cognitive" }), true)
  assert.equal(matches({ class: "medication", category: ["cognitive"] }), true)
  assert.equal(matches({ class: ["medication", "compound"], category: "cognitive" }), true)
  assert.equal(matches({ class: ["medication"], category: "other" }), false)
  assert.equal(matches({ class: ["book"], category: "cognitive" }), false)
  assert.equal(matches({}), false)
})
