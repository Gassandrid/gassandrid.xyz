// Host adapter for the pinned marimo islands runtime. Keep this file free of
// imports: the resource plugin embeds it before the runtime module loads.
export function watchMarimoTheme(page) {
  const body = document.body
  const previousHostTheme = body.getAttribute("data-vscode-theme-kind")
  const observers = new Map()
  const plots = new WeakMap()
  let frame = 0
  let disposed = false
  let restorePlotInput = () => {}
  let currentColors
  let currentTheme

  function theme() {
    return document.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light"
  }

  function palette() {
    const style = getComputedStyle(page)
    const token = (name, fallback) => style.getPropertyValue(name).trim() || fallback
    return {
      paper: token("--marimo-quartz-background", token("--light", "white")),
      ink: token("--marimo-quartz-text", token("--darkgray", "black")),
      border: token("--marimo-quartz-border", token("--lightgray", "gray")),
      accent: token("--marimo-quartz-accent", token("--secondary", "gray")),
      font: token("--bodyFont", "sans-serif"),
    }
  }

  function themedPlotInput(host, colors, source) {
    const previous = plots.get(host)
    if (!source) return source
    const signature = JSON.stringify(colors)
    if (signature === previous?.signature) {
      if (source === previous.output || source === previous.input) return previous.output
    }
    const currentLayout =
      source === previous?.output
        ? host.shadowRoot?.querySelector(".js-plotly-plot")?._fullLayout
        : null
    // A new Python result replaces data-figure. Theme-only updates reuse the
    // original figure; never feed a previous theme back into notebook data.
    let figure
    try {
      figure =
        source === previous?.output || source === previous?.input
          ? previous.figure
          : JSON.parse(source)
    } catch {
      return source
    }
    const layout = {
      ...figure.layout,
      paper_bgcolor: colors.paper,
      plot_bgcolor: colors.paper,
      font: { ...figure.layout?.font, color: colors.ink, family: colors.font },
    }
    // Cover subplot axes as well as the default pair, preserving scales,
    // ranges, trace colors, selections and the original template's semantics.
    const axes = new Set([
      "xaxis",
      "yaxis",
      ...Object.keys(layout).filter((key) => /^[xy]axis\d*$/.test(key)),
    ])
    for (const key of axes) {
      const axis = layout[key] ?? {}
      layout[key] = {
        ...axis,
        // marimo merges changed axis objects wholesale. Carry the displayed
        // viewport through a theme-only change; fresh Python figures still
        // supply their own ranges/autorange behavior.
        ...(currentLayout?.[key]?.range && {
          range: [...currentLayout[key].range],
          autorange: false,
        }),
        color: colors.ink,
        gridcolor: colors.border,
        zerolinecolor: colors.border,
        linecolor: colors.border,
        tickfont: { ...axis.tickfont, color: colors.ink },
        title:
          typeof axis.title === "string"
            ? { text: axis.title, font: { color: colors.ink } }
            : { ...axis.title, font: { ...axis.title?.font, color: colors.ink } },
      }
    }
    layout.title =
      typeof layout.title === "string"
        ? { text: layout.title, font: { color: colors.ink } }
        : { ...layout.title, font: { ...layout.title?.font, color: colors.ink } }
    layout.legend = {
      ...layout.legend,
      bgcolor: colors.paper,
      font: { ...layout.legend?.font, color: colors.ink },
    }
    layout.annotations = layout.annotations?.map((annotation) => ({
      ...annotation,
      font: { ...annotation.font, color: colors.ink },
    }))
    const output = JSON.stringify({ ...figure, layout })
    plots.set(host, {
      figure,
      input: source === previous?.output ? previous.input : source,
      output,
      signature,
    })
    return output
  }

  function syncMermaid(host, colors) {
    const values = {
      background: colors.paper,
      primaryColor: colors.paper,
      primaryTextColor: colors.ink,
      primaryBorderColor: colors.accent,
      secondaryColor: colors.border,
      tertiaryColor: colors.paper,
      lineColor: colors.ink,
      textColor: colors.ink,
      nodeTextColor: colors.ink,
      edgeLabelBackground: colors.paper,
      fontFamily: colors.font,
    }
    // These are the native plugin's observed input attributes. Updating them
    // rerenders its own SVG instead of recoloring a stale diagram with CSS.
    const variables = JSON.stringify(values)
    if (host.dataset.theme !== '"base"') host.dataset.theme = '"base"'
    if (host.dataset.theme_variables !== variables) host.dataset.theme_variables = variables
  }

  function scan(root, colors) {
    if (!observers.has(root)) {
      const observer = new MutationObserver((records) => {
        // Plotly/Vega redraw many SVG paths and labels. Those mutations do not
        // introduce new widget hosts or change their inputs, so ignore them.
        const containsWidget = (node) =>
          node.nodeType === 1 &&
          (node.localName.startsWith("marimo-") ||
            node.querySelector("marimo-plotly, marimo-mermaid, marimo-anywidget, marimo-tex"))
        if (
          records.some(
            (record) =>
              record.type === "attributes" ||
              [...record.addedNodes, ...record.removedNodes].some(containsWidget),
          )
        )
          schedule()
      })
      observer.observe(root, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-figure", "data-diagram", "data-theme", "data-theme_variables"],
      })
      observers.set(root, observer)
    }
    for (const host of root.querySelectorAll("marimo-plotly")) {
      const source = host.getAttribute("data-figure")
      const output = themedPlotInput(host, colors, source)
      if (source !== output) host.setAttribute("data-figure", output)
    }
    for (const host of root.querySelectorAll("marimo-mermaid")) syncMermaid(host, colors)
    // Shadow roots inherit Quartz variables, but cannot match ancestors outside
    // the root. This local attribute also selects the widget's dark accents.
    if (root.host && root.host.getAttribute("data-quartz-theme") !== theme())
      root.host.setAttribute("data-quartz-theme", theme())
    for (const element of root.querySelectorAll("*")) {
      if (element.shadowRoot) scan(element.shadowRoot, colors)
    }
  }

  function sync() {
    frame = 0
    if (disposed || !page.isConnected) return
    // 0.23.9 samples the islands host theme once. Its VS Code host attribute is
    // its existing live host observer; bridge Quartz through that listener.
    // Scope and restore it when leaving the notebook, without remounting UIs.
    const value = `vscode-${theme()}`
    if (body.getAttribute("data-vscode-theme-kind") !== value)
      body.setAttribute("data-vscode-theme-kind", value)
    page.style.colorScheme = theme()
    for (const [root, observer] of observers) {
      if (root.host && !root.host.isConnected) {
        observer.disconnect()
        observers.delete(root)
      }
    }
    if (!currentColors || currentTheme !== theme()) {
      currentColors = palette()
      currentTheme = theme()
    }
    scan(page, currentColors)
  }

  function schedule() {
    if (!disposed && !frame) frame = requestAnimationFrame(sync)
  }
  const themeObserver = new MutationObserver(schedule)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["saved-theme"],
  })
  document.addEventListener("themechange", schedule)
  sync()
  // React writes fresh figure attributes before marimo's plugin reads them.
  // Normalize at that boundary: an observer alone runs after React has already
  // queued the unthemed figure, causing a white frame followed by a second draw.
  customElements.whenDefined("marimo-plotly").then((PlotElement) => {
    if (disposed) return
    const prototype = PlotElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "setAttribute")
    const setAttribute = prototype.setAttribute
    function setThemedAttribute(name, value) {
      const output =
        !disposed && page.isConnected && name === "data-figure"
          ? themedPlotInput(this, currentColors, String(value))
          : value
      setAttribute.call(this, name, output)
    }
    prototype.setAttribute = setThemedAttribute
    restorePlotInput = () => {
      if (prototype.setAttribute !== setThemedAttribute) return
      if (descriptor) Object.defineProperty(prototype, "setAttribute", descriptor)
      else delete prototype.setAttribute
    }
  })
  // Custom-element upgrade attaches shadow roots without a light-DOM mutation.
  customElements.whenDefined("marimo-tex").then(schedule)
  customElements.whenDefined("marimo-anywidget").then(schedule)
  return () => {
    disposed = true
    restorePlotInput()
    cancelAnimationFrame(frame)
    themeObserver.disconnect()
    document.removeEventListener("themechange", schedule)
    for (const observer of observers.values()) observer.disconnect()
    observers.clear()
    if (previousHostTheme === null) body.removeAttribute("data-vscode-theme-kind")
    else body.setAttribute("data-vscode-theme-kind", previousHostTheme)
  }
}
