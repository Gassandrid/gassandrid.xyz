import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

export const RunPythonPlugin: QuartzTransformerPlugin = () => ({
  name: "RunPythonPlugin",
  markdownPlugins() {
    return [
      () => (tree: Root, _file) => {
        visit(tree, "code", (node) => {
          if (node.lang === "python") {
            // get the old type
            let oldType = node.type
            let newNode = JSON.parse(JSON.stringify(node))
            const id = `python-${Math.random().toString(36).substr(2, 9)}`
            node.type = "html" as "code"
            node.value = `
              <div class="python-runnable">
                <pre><code id="${id}">${node.value}</code></pre>
                <button class="run-python" data-target="${id}">:arrow_forward:</button>
                <div class="python-output" id="${id}-output"></div>
              </div>
            `
            // set tupe back to original
            node.type = oldType
          }
        })
      },
    ]
  },
})
