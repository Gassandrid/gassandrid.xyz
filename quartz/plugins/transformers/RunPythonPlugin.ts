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
            `
          }
        })
      },
    ]
  },
  externalResources() {
    return {
      js: [
        {
          script: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js",
          loadTime: "afterDOMReady",
          contentType: "external",
        },
      ],
      css: [
        `
        .python-runnable {
          position: relative;
          margin-bottom: 1em;
        }
        .run-python {
          position: absolute;
          bottom: 0.5em;
          right: 0.5em;
          background: none;
          border: none;
          font-size: 1.2em;
          cursor: pointer;
        }
        .python-output {
          background-color: #f0f0f0;
          border-top: 1px solid #ccc;
          padding: 0.5em;
          white-space: pre-wrap;
          display: none;
        }
        `,
      ],
    }
  },
  setupHooks: {
    async afterDOMLoaded(ctx) {
      // Inject CSS
      const style = document.createElement("style")
      style.textContent = `
        .python-runnable {
          position: relative;
          margin-bottom: 1em;
        }
        .run-python {
          position: absolute;
          bottom: 0.5em;
          right: 0.5em;
          background: none;
          border: none;
          font-size: 1.2em;
          cursor: pointer;
        }
        .python-output {
          background-color: #f0f0f0;
          border-top: 1px solid #ccc;
          padding: 0.5em;
          white-space: pre-wrap;
          display: none;
        }
      `
      document.head.appendChild(style)

      // Inject JS
      const script = document.createElement("script")
      script.textContent = `
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
      `
      document.body.appendChild(script)

      // Load external Pyodide script
      const externalScript = document.createElement("script")
      externalScript.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
      externalScript.onload = () => {
        console.log("Pyodide script loaded.")
      }
      document.body.appendChild(externalScript)
    },
  },
})
