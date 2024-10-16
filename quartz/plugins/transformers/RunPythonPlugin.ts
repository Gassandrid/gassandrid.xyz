import { QuartzTransformerPlugin } from "../types"
import { Root, Content } from "mdast"
import { visit } from "unist-util-visit"

export const RunPythonPlugin: QuartzTransformerPlugin = () => ({
  name: "RunPythonPlugin",
  markdownPlugins() {
    return [
      () => (tree: Root, _file) => {
        visit(tree, "code", (node, index, parent) => {
          if (node.lang === "python" && parent?.children) {
            const id = `python-${Math.random().toString(36).substr(2, 9)}`

            // Create the HTML node that will go below the code block
            const htmlNode: Content = {
              type: "html",
              value: `
                <div class="python-runnable">
                  <button class="run-python" data-target="${id}">▶ Run</button>
                  <div class="python-output" id="${id}-output"></div>
                </div>
              `,
            }

            // Ensure the original code block has an ID for targeting
            node.data = {
              hProperties: {
                id: id,
              },
            }

            // Insert the HTML node after the code block
            parent.children.splice(index + 1, 0, htmlNode)
          }
        })
      },
    ]
  },
})
