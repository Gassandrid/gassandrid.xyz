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
            const id = `python-${Math.random().toString(36).substr(2, 9)}`
            node.type = "html" as "code"
            node.value = `
              <div class="python-runnable">
                <pre><code id="${id}">${node.value}</code></pre>
                <button class="run-python" data-target="${id}">▶️</button>
                <div class="python-output" id="${id}-output"></div>
              </div>
              <script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"></script>
              <script>
                      let pyodide;

                      async function loadPyodideAndPackages() {
                        pyodide = await loadPyodide();
                        await pyodide.loadPackage(['numpy', 'matplotlib', 'scipy', 'sympy', 'pandas']);
                        console.log("Pyodide and packages are ready!");
                      }

                      loadPyodideAndPackages();

                      document.addEventListener('click', async function(event) {
                        if (!event.target.classList.contains('run-python')) return;
                        const targetId = event.target.getAttribute('data-target');
                        const codeElement = document.getElementById(targetId);
                        const outputElement = document.getElementById(targetId + '-output');

                        if (!pyodide) {
                          outputElement.textContent = "Pyodide is still loading. Please wait.";
                          outputElement.style.display = 'block';
                          return;
                        }

                        outputElement.textContent = "Running...";
                        outputElement.style.display = 'block';

                        try {
                          pyodide.runPython(\`
                            import sys
                            import io
                            sys.stdout = io.StringIO()
                            sys.stderr = io.StringIO()
                          \`);

                          await pyodide.runPythonAsync(codeElement.textContent);

                          const stdout = pyodide.runPython("sys.stdout.getvalue()");
                          const stderr = pyodide.runPython("sys.stderr.getvalue()");

                          outputElement.textContent = stdout + stderr || "No output";
                        } catch (error) {
                          outputElement.textContent = "Error: " + error.message;
                        }
                      });
              <script>
            `
          }
        })
      },
    ]
  },
})
