import { QuartzTransformerPlugin } from "../types"
import { Root, Content } from "mdast"
import { visit } from "unist-util-visit"

export const RunPythonPlugin: QuartzTransformerPlugin = () => ({
  name: "RunPythonPlugin",

  externalResources() {
    return {
      js: [
        {
          src: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js",
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
            const scriptContent = `
              (function() {
                let pyodideReadyPromise;

                async function loadPyodideAndPackages() {
                  if (!pyodideReadyPromise) {
                    pyodideReadyPromise = (async function() {
                      try {
                        const pyodide = await loadPyodide();
                        console.log('Pyodide loaded successfully');
                        await pyodide.loadPackage("matplotlib");
                        return pyodide;
                      } catch (error) {
                        console.error('Error loading Pyodide:', error);
                        throw error;
                      }
                    })();
                  }
                  return pyodideReadyPromise;
                }

                async function runPython() {
                  const outputElement = document.getElementById('${id}-output');
                  const plotElement = document.getElementById('${id}-plot');
                  const loadingElement = document.getElementById('${id}-loading');
                  
                  outputElement.innerHTML = '';
                  plotElement.innerHTML = '';
                  loadingElement.style.display = 'block';

                  try {
                    const pyodide = await loadPyodideAndPackages();
                    const code = document.getElementById('${id}').textContent;
                    pyodide.runPython(\`
                      import io, sys
                      import matplotlib.pyplot as plt
                      sys.stdout = io.StringIO()
                    \`);
                    await pyodide.loadPackagesFromImports(code);
                    await pyodide.runPythonAsync(code);
                    let output = pyodide.runPython('sys.stdout.getvalue()');
                    outputElement.innerHTML = output;

                    let plotData = pyodide.runPython(\`
                      import io
                      import base64
                      buf = io.BytesIO()
                      if plt.get_fignums():
                        plt.savefig(buf, format='png')
                        buf.seek(0)
                        img_str = base64.b64encode(buf.read()).decode('UTF-8')
                        plt.close()
                        img_str
                      else:
                        ''
                    \`);

                    // display the plot only if there's plot data
                    if (plotData) {
                      plotElement.innerHTML = '<img src="data:image/png;base64,' + plotData + '" />';
                      plotElement.style.display = 'block';
                    } else {
                      plotElement.style.display = 'none';
                    }

                  } catch (error) {
                    console.error('Error running Python code:', error);
                    outputElement.innerHTML = 'Error: ' + error.message;
                  } finally {
                    loadingElement.style.display = 'none';
                  }
                }

                function initializePythonRunner() {
                  const button = document.getElementById('${id}-button');
                  if (button) {
                    button.addEventListener('click', runPython);
                  } else {
                    console.error('Run Python button not found');
                  }
                }

                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initializePythonRunner);
                } else {
                  initializePythonRunner();
                }
              })();
            `;

            const htmlNode: Content = {
              type: "html",
              value: `
                <div class="python-runnable">
                  <pre><code id="${id}" style="display: none;">${node.value}</code></pre>
                  <button id="${id}-button">Run Python</button>
                  <div id="${id}-loading" style="display: none;">
                    <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div class="python-output" id="${id}-output"></div>
                  <div class="python-plot" id="${id}-plot" style="display: none;"></div>
                </div>
                <script>${scriptContent}</script>
              `,
            }


            // debugging why the string literals are encoding " into &quot;
            console.log(node.value);

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
