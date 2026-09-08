import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import { spawnSync } from "node:child_process"
import { buildObsidianContext } from "./ewan-marimo/index.js"

test("Marimo indexes published paths, aliases, nested headings and folder notes", () => {
  const tree = {
    children: [
      { tagName: "h2", properties: { id: "parent" }, children: [{ value: "Parent" }] },
      { tagName: "h3", properties: { id: "details-1" }, children: [{ value: "Details" }] },
    ],
  }
  const ctx = {
    allFiles: [
      "People/Conradi.md",
      "Secret.md",
      "Thoughts/Demo.marimo.py",
      "Attachments/Image.png",
      "Folder/Folder.md",
    ],
  }
  const context = buildObsidianContext(ctx, [
    [
      tree,
      {
        data: {
          relativePath: "People/Conradi.md",
          slug: "people/conradi",
          frontmatter: { aliases: ["Simone"] },
        },
      },
    ],
    [{}, { data: { relativePath: "Folder/Folder.md", slug: "folder/index" } }],
  ])
  assert.equal(buildObsidianContext({ allFiles: ["Secret.md"] }, []).files.length, 0)
  assert.equal(context.files.length, 4)
  assert.equal(
    context.files.some((file) => file.path === "Secret.md"),
    false,
  )
  assert.deepEqual(context.files[0], {
    path: "People/Conradi.md",
    slug: "people/conradi",
    aliases: ["Simone"],
    headings: { Parent: "parent", Details: "details-1", "Parent#Details": "details-1" },
  })
  assert.equal(context.files[1].slug, "thoughts/demo")
  assert.equal(context.files[2].slug, "attachments/image.png")
  assert.equal(context.files[3].slug, "folder/index")
})

test("Obsidian syntax uses native marimo Markdown and preserves interpolation", () => {
  const python =
    process.env.MARIMO_PYTHON ??
    (fs.existsSync(".venv-marimo/bin/python") ? ".venv-marimo/bin/python" : "python3")
  const result = spawnSync(python, ["plugins/ewan-marimo/obsidian.test.py"], {
    encoding: "utf8",
    timeout: 30000,
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
})
