# Reusable plotting notebooks

Copy one notebook into the Vault and rename it. These are ordinary standalone
marimo notebooks; they do not import the website plugin or private tooling.

- [Plotly](plotly.marimo.py): simulations, hover inspection and zoom. Quartz's
  plugin supplies the page palette before each figure reaches the renderer.
- [Altair](altair.marimo.py): declarative charts and selected data feeding other
  cells. The native Vega renderer follows the bridged light/dark theme.
- [Matplotlib](matplotlib.marimo.py): reusable, scoped light/dark figure factory
  for scientific output. The default is an authored light figure. A generated
  image does not follow Quartz toggles; call the factory with another theme to
  redraw it. The theme argument is ready for a future notebook-host integration.

Keep data loading, expensive numerical computation, and drawing in separate
cells. Theme and presentation changes should depend on computed results, not
rerun the simulation. The examples send slider changes on release via
`debounce=True`; remove it for cheap computations requiring continuous feedback.
Use `mo.cache` around expensive deterministic functions where reuse is likely,
with all relevant inputs (including random seeds) explicit. Limit cache size
when results are large. Cache only after measuring a meaningful cost.

Do not copy global `plt.style.use(...)`, `alt.themes.enable(...)`, or
`plotly.io.templates.default = ...` into every plotting cell. Scoped styles
avoid affecting unrelated figures. Set trace colors only when they convey
meaning; the host handles backgrounds, axes and labels where possible.

These templates are examples, not copies automatically injected into every
published notebook. Only imported libraries are loaded. In this website's
pinned runtime the Plotly browser fallback remains 5.24.1; other package/backend
versions need a browser check. Altair transformations that require VegaFusion
and Matplotlib interactive backends are outside the basic rendering probe.
