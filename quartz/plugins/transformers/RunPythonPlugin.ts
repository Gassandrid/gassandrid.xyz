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
          loadTime: "afterDOMReady", // You may want this to load asynchronously since it's large.
          contentType: "external",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js",
          loadTime: "beforeDOMReady", // Ensure CodeMirror is ready before rendering code blocks
          contentType: "external",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js",
          loadTime: "beforeDOMReady", // Load with CodeMirror
          contentType: "external",
        },
      ],
      css: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css",
          loadTime: "beforeDOMReady", // Make sure styles are applied before DOM rendering
          contentType: "external",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css",
          loadTime: "beforeDOMReady", // Same here, styles should be ready early
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
    .python-output {
      display: none;
      margin-top: 10px;
      padding: 10px;
      background-color: rgba(128, 128, 128, 0.5); /* grey and mostly transparent */
      border: 2px solid rgba(64, 64, 64, 0.8); /* darker gray and less transparent border */
      border-radius: 10px; /* rounded corners */
    }
    .python-output.visible {
      display: block; /* make visible after running */
    }


      .code-block {
        max-width: 800px;
        width: 100%;
        background-color: #282a36;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: #44475a;
        border-bottom: 1px solid #6272a4;
      }
      .code-language {
        color: #f8f8f2;
        font-family: monospace;
        font-size: 0.875rem;
      }
      .code-actions {
        display: flex;
        gap: 0.5rem;
      }
      .code-actions button {
        background: none;
        border: none;
        color: #bd93f9;
        cursor: pointer;
        padding: 0.25rem;
        transition: color 0.2s;
      }
      .code-actions button:hover {
        color: #ff79c6;
      }
      .code-content {
        position: relative;
        height: 150px;
        transition: height 0.3s ease-in-out;
        overflow: hidden;
      }
      .code-content.expanded {
        height: auto;
        max-height: none;
      }
      .CodeMirror {
        height: 100%;
      }
      .code-gradient {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2rem;
        background: linear-gradient(
          to top,
          rgba(40, 42, 54, 1),
          rgba(40, 42, 54, 0)
        );
        pointer-events: none;
      }
</style>
<div class="code-block">
  <div class="code-header">
    <div class="code-language">Python</div>
    <div class="code-actions">
      <button id="${id}-copy" aria-label="Copy code">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          ></path>
        </svg>
      </button>
      <button id="${id}-button" aria-label="Run code">
        <span class="play-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </span>
        <span class="spinner"></span>
      </button>
      <button id="${id}-expand" aria-label="Expand code">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  </div>
  <div id="codeContent-${id}" class="code-content">
    <textarea id="codeTextarea-${id}">${node.value}</textarea>
    <div id="codeGradient-${id}" class="code-gradient"></div>
  </div>
</div>

  <div class="python-output" id="${id}-output">
    <div class="python-text" id="${id}-text"></div>
    <div class="python-plot" id="${id}-plot"></div>
  </div>

<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js'></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css" />
<script>
    // make sure scripts are loaded before running the code
    if (typeof CodeMirror === 'undefined') {
      console.error('CodeMirror not found');
    } else {
      console.log('CodeMirror loaded successfully'); 
    }

    const codeContent = document.getElementById('codeContent-${id}');
    const codeTextarea = document.getElementById('codeTextarea-${id}');
    const codeGradient = document.getElementById('codeGradient-${id}');
    const copyBtn = document.getElementById('${id}-copy');
    const runBtn = document.getElementById('${id}-button');
    const expandBtn = document.getElementById('${id}-expand');

    let isExpanded = false;

    // Initialize CodeMirror editor
    const editor = CodeMirror.fromTextArea(codeTextarea, {
        mode: 'python',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: false,
    });

    // update expand button icon based on isExpanded
    const updateExpandButtonIcon = () => {
      const svgElement = document.createElement('svg');
      svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgElement.setAttribute('width', '20');
      svgElement.setAttribute('height', '20');
      svgElement.setAttribute('viewBox', '0 0 24 24');
      svgElement.setAttribute('fill', 'none');
      svgElement.setAttribute('stroke', 'currentColor');
      svgElement.setAttribute('stroke-width', '2');
      svgElement.setAttribute('stroke-linecap', 'round');
      svgElement.setAttribute('stroke-linejoin', 'round');

      const polylineElement = document.createElement('polyline');
      polylineElement.setAttribute('points', isExpanded ? '20 6 9 17 4 12' : '6 9 12 15 18 9');
      svgElement.appendChild(polylineElement);
      expandBtn.innerHTML = svgElement.outerHTML;
    };

    editor.setSize(null, '150px'); // Set initial size to make sure it's visible

    expandBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      codeContent.classList.toggle('expanded', isExpanded);
      codeGradient.style.display = isExpanded ? 'none' : 'block';
      editor.setSize(null, isExpanded ? 'auto' : '150px'); // Apply new height to CodeMirror editor
      editor.refresh();


      updateExpandButtonIcon(); // Set the initial icon
      });

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(editor.getValue()).then(() => {
        const svgElement = document.createElement('svg');
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgElement.setAttribute('width', '20');
        svgElement.setAttribute('height', '20');
        svgElement.setAttribute('viewBox', '0 0 24 24');
        svgElement.setAttribute('fill', 'none');
        svgElement.setAttribute('stroke', 'currentColor');
        svgElement.setAttribute('stroke-width', '2');
        svgElement.setAttribute('stroke-linecap', 'round');
        svgElement.setAttribute('stroke-linejoin', 'round');
        const polylineElement = document.createElement('polyline');
        polylineElement.setAttribute('points', '20 6 9 17 4 12');
        svgElement.appendChild(polylineElement);
        copyBtn.innerHTML = svgElement.outerHTML;

        setTimeout(() => {
          copyBtn.innerHTML = 'Copy';
          const originalSvg = document.createElement('svg');
          originalSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          originalSvg.setAttribute('width', '20');
          originalSvg.setAttribute('height', '20');
          originalSvg.setAttribute('viewBox', '0 0 24 24');
          originalSvg.setAttribute('fill', 'none');
          originalSvg.setAttribute('stroke', 'currentColor');
          originalSvg.setAttribute('stroke-width', '2');
          originalSvg.setAttribute('stroke-linecap', 'round');
          originalSvg.setAttribute('stroke-linejoin', 'round');
          const rectElement = document.createElement('rect');
          rectElement.setAttribute('x', '9');
          rectElement.setAttribute('y', '9');
          rectElement.setAttribute('width', '13');
          rectElement.setAttribute('height', '13');
          rectElement.setAttribute('rx', '2');
          rectElement.setAttribute('ry', '2');
          originalSvg.appendChild(rectElement);
          const pathElement = document.createElement('path');
          pathElement.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');
          originalSvg.appendChild(pathElement);
          copyBtn.innerHTML = originalSvg.outerHTML;
        }, 2000);
      });
    });
</script>

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
              await pyodide.loadPackage('numpy');
              await pyodide.loadPackage('pandas');
              await pyodide.loadPackage('scipy');
              await pyodide.loadPackage('sympy');
              await pyodide.loadPackage('scikit-learn');
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
        const outputElement = document.getElementById('${id}-output');
        const plotElement = document.getElementById('${id}-plot');
        const textElement = document.getElementById('${id}-text');

        textElement.innerHTML = '';
        plotElement.innerHTML = '';

        playIcon.style.display = 'none';
        spinner.style.display = 'inline-block';
        button.disabled = true;

        try {
          const pyodide = await loadPyodideAndPackages();
          const code = document.getElementById('codeTextarea-${id}').value;
          pyodide.runPython(\`
            import io, sys
            import matplotlib.pyplot as plt
            sys.stdout = io.StringIO()
          \`);
          await pyodide.loadPackagesFromImports(code);
          await pyodide.runPythonAsync(code);
          let output = pyodide.runPython('sys.stdout.getvalue()');

          textElement.innerHTML = output;
          outputElement.classList.add('visible');

          // make output wrapper visible
          const outputWrapper = document.getElementById('${id}-output');
          outputWrapper.style.display = 'block';

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
          const outputElement = document.getElementById('${id}-output');
          outputElement.innerHTML = 'Error: ' + error.message;
          outputElement.classList.add('visible');
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
