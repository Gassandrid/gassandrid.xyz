import { QuartzTransformerPlugin } from "../types"
import { Root, Content } from "mdast"
import { visit } from "unist-util-visit"

export const RunPythonPlugin: QuartzTransformerPlugin = () => ({
  name: "RunPythonPlugin",

  externalResources() {
    return {
      js: [
        {
          src: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js",
          loadTime: "afterDOMReady",
          contentType: "external",
        },
      ],
    }
  },

  markdownPlugins() {
    return [
      () => (tree: Root, _file) => {
        visit(tree, "code", (node, index, parent) => {
          if (node.lang === "python" && parent?.children) {
            const id = `python-${Math.random().toString(36).substr(2, 9)}`

            // Create the HTML node that includes the button, output div, and inline script
            const htmlNode: Content = {
              type: "html",
              value: `
                <script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"></script>

                <div class="python-runnable">
                  <pre><code id="${id}" style="display: none;">${node.value}</code></pre>
                  <button id="${id}-button">Run Python</button>
                  <div class="python-output" id="${id}-output"></div>
                </div>

                <script>
                  async function loadPyodideAndPackages() {
                      let pyodide = await loadPyodide();
                      return pyodide;
                  }

                  let pyodideReadyPromise = loadPyodideAndPackages();

                  async function runPython() {
                      let pyodide = await pyodideReadyPromise;
                      try {
                          const code = document.getElementById('${id}').textContent;
                          pyodide.runPython('
                              import io, sys
                              sys.stdout = io.StringIO()
                          ');
                          await pyodide.loadPackagesFromImports(code);
                          await pyodide.runPythonAsync(code);
                          let output = pyodide.runPython("sys.stdout.getvalue()");
                          document.getElementById('${id}-output').innerHTML = output;
                      } catch (error) {
                          console.error("Error running Python code:", error);
                          document.getElementById('${id}-output').innerHTML = error;
                      }
                  }

                  document.getElementById('${id}-button').addEventListener('click', runPython);
                </script>
              `,
            }

            node.data = {
              hProperties: {
                id: id,
              },
            }

            parent.children.splice(index + 1, 0, htmlNode)
          }
        })
      },
    ]
  },
})
