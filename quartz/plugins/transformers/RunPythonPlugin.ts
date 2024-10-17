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

            // Assemble the entire HTML content as a string
            const htmlContent = `
  <style>
    .spinner {
      display: none;
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .play-icon {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }
  </style>
  <div class="python-runnable">
    <pre><code id="${id}" style="display: none;">${node.value}</code></pre>
    <button id="${id}-button" class="python-button">
      <span class="play-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </span>
      <span class="spinner"></span>
    </button>
    <div class="python-output" id="${id}-output"></div>
    <div class="python-plot" id="${id}-plot"></div>
  </div>
  <script>
    (function() {
      let pyodideReadyPromise;

      async function loadPyodideAndPackages() {
        if (!pyodideReadyPromise) {
          pyodideReadyPromise = (async function() {
            try {
              const pyodide = await loadPyodide();
              console.log('Pyodide loaded successfully');
              await pyodide.loadPackage('matplotlib');
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
        const button = document.getElementById('${id}-button');
        const playIcon = button.querySelector('.play-icon');
        const spinner = button.querySelector('.spinner');

        playIcon.style.display = 'none';
        spinner.style.display = 'inline-block';
        button.disabled = true;

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
          document.getElementById('${id}-output').innerHTML = output;

          let plotData = pyodide.runPython(\`
            import io
            import base64
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            img_str = base64.b64encode(buf.read()).decode('UTF-8')
            plt.close()
            img_str
          \`);

          let plotElement = document.getElementById('${id}-plot');
          const imgElement = document.createElement('img');
          imgElement.src = 'data:image/png;base64,' + plotData;
          plotElement.appendChild(imgElement);

          if (!code.includes('import matplotlib.pyplot as plt')) {
            plotElement.style.display = 'none';
          }

        } catch (error) {
          console.error('Error running Python code:', error);
          document.getElementById('${id}-output').innerHTML = 'Error: ' + error.message;
        } finally {
          playIcon.style.display = 'inline';
          spinner.style.display = 'none';
          button.disabled = false;
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
  </script>
`

            const htmlNode: Content = {
              type: "html",
              value: htmlContent,
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
