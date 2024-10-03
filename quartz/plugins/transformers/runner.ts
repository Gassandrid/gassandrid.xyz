import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

export const PythonCodeTagger: QuartzTransformerPlugin = () => ({
  name: "PythonCodeTagger",
  markdownPlugins() {
    return [
      () => (tree: Root, _file) => {
        visit(tree, "code", (node) => {
          if (node.lang === "python") {
            const codeContent = node.value

            // Replace code block with an HTML structure to later hook execution logic
            node.type = "html" as "code"
            node.value = `
              <div class="python-code-block">
                <pre class="code-block"><code>${codeContent}</code></pre>
                <button class="run-python-button">Run Python</button>
                <pre class="python-output"></pre>
              </div>
            `
          }
        })
      },
    ]
  },
})

export const PythonExecutor: QuartzTransformerPlugin = () => ({
  name: "PythonExecutor",
  externalResources() {
    return {
      js: [
        {
          src: "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js",
          loadTime: "beforeDOMReady",
          contentType: "external",
        },
      ],
    }
  },
  getQuartzComponents() {
    return [
      {
        name: "PythonRunner",
        component: () => `
          <script>
            async function loadPyodideAndRun() {
              let pyodide = await loadPyodide();
              document.querySelectorAll(".run-python-button").forEach(button => {
                button.addEventListener("click", async () => {
                  const codeBlock = button.previousElementSibling.querySelector("code").textContent;
                  const outputElement = button.nextElementSibling;
                  try {
                    let result = await pyodide.runPython(codeBlock);
                    outputElement.textContent = result;
                  } catch (error) {
                    outputElement.textContent = "Error: " + error;
                  }
                });
              });
            }
            loadPyodideAndRun();
          </script>
        `,
      },
    ]
  },
})
