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
            // copy the node into newNode
            let newNode = JSON.parse(JSON.stringify(node))
            const id = `python-${Math.random().toString(36).substr(2, 9)}`
            newNode.type = "html" as "code"
            newNode.value = `
              <div class="python-runnable">
                <pre><code id="${id}">${newNode.value}</code></pre>
                <button class="run-python" data-target="${id}">:arrow_forward:</button>
                <div class="python-output" id="${id}-output"></div>
              </div>
            `
          }
        })
      },
    ]
  },
})
