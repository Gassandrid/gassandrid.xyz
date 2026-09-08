# Technical Debt

This ledger records concrete deferred weaknesses for the maintained Quartz site.
Re-run `npm audit --omit=dev` before changing status; generated site output and
ordinary dependency-update noise do not belong here.

## TD-SEC-001 — Upgrade `sharp` past vulnerable bundled libvips

- Status: Resolved
- Evidence: `npm audit --omit=dev` on 2026-08-10 reports
  `GHSA-f88m-g3jw-g9cj`; `npm ls sharp` resolves the direct dependency to
  `sharp@0.34.5`.
- Paths: `package.json`, `package-lock.json`, OG-image and image-processing build
  paths.
- Consequence: processing a crafted image during a build can reach inherited
  libvips vulnerabilities. The published static files do not execute `sharp`.
- Bounded next action: test `sharp@0.35.3` in a dependency-only branch, rebuild
  all OG images, and compare representative image metadata and pixels.
- Exit condition: the production audit no longer reports the advisory and the
  full build plus static probe pass.
- Last reviewed: 2026-09-07
- Resolution: Resolved with `sharp@0.35.4`. Fresh Node 22 build and static probe passed, including generated social images and the TikZ corpus. Full `npm audit` and production-only audit both report zero vulnerabilities on 2026-09-07.

## TD-SEC-002 — Replace vulnerable transitive `svgo`

- Status: Resolved
- Evidence: `npm audit --omit=dev` on 2026-08-10 reports
  `GHSA-2p49-hgcm-8545`; `npm ls svgo` resolves `svgo@3.3.3` through
  `node-tikzjax@1.0.5`.
- Paths: `package-lock.json`, TikZ/SVG generation and sanitization paths.
- Consequence: the affected `removeScripts` transform can leave executable SVG
  scripts intact when processing untrusted SVG input.
- Bounded next action: evaluate a `node-tikzjax` update or a compatible lockfile
  override to `svgo>=3.3.4`, then run the TikZ corpus and inspect script-bearing
  SVG fixtures.
- Exit condition: the advisory is absent and `npm run build && npm run probe`
  retain the full TikZ count and safety assertions.
- Last reviewed: 2026-09-07
- Resolution: Resolved with transitive `svgo@3.3.5`. The full TikZ corpus and static safety assertions pass. Full `npm audit` and production-only audit both report zero vulnerabilities on 2026-09-07.

## TD-SEC-003 — Update vulnerable `brace-expansion` copies

- Status: Resolved
- Evidence: `npm audit --omit=dev` on 2026-08-10 reports
  `GHSA-mh99-v99m-4gvg` and `GHSA-rgw5-rvv9-x895`; `npm ls` resolves
  `brace-expansion@5.0.7` through `minimatch@10.2.5` and
  `brace-expansion@1.1.16` through `serve-handler@6.1.7`.
- Paths: `package-lock.json`, file matching and local serving dependency paths.
- Consequence: attacker-controlled expansion patterns can cause excessive memory
  allocation and process termination.
- Bounded next action: update the owning dependencies or apply narrowly tested
  lockfile overrides to fixed `brace-expansion` releases.
- Exit condition: both advisories are absent and type, unit, build, and browser
  probes pass.
- Last reviewed: 2026-09-07
- Resolution: Resolved with `brace-expansion@5.0.9` and `brace-expansion@1.1.18`. Type checking, unit tests, and the full build pass. Full `npm audit` and production-only audit both report zero vulnerabilities on 2026-09-07.

## TD-SEC-004 — Upgrade `esbuild` beyond the Windows dev-server advisory

- Status: Resolved
- Evidence: `npm audit --omit=dev` on 2026-08-10 reports
  `GHSA-g7r4-m6w7-qqqr`; direct and transitive resolution is `esbuild@0.27.3`.
- Paths: `package.json`, `package-lock.json`, `esbuild-sass-plugin`, `tsx`.
- Consequence: the vulnerable development server can expose arbitrary files on
  Windows. The current macOS/Linux static build and deployment path is not the
  affected mode.
- Bounded next action: update to `esbuild>=0.28.1` after confirming Sass plugin
  and `tsx` compatibility under Node 22.
- Exit condition: the advisory is absent and the complete validation suite
  passes on Node 22.
- Last reviewed: 2026-09-07
- Resolution: Resolved with `esbuild@0.28.2` throughout the tree, including `tsx@4.23.13` and the Sass plugin. Node 22 type checks, tests, and build pass. Full `npm audit` and production-only audit both report zero vulnerabilities on 2026-09-07.

## TD-MARIMO-001 — Remove the fresh-document boundary between notebooks

- Status: Open
- Evidence: `plugins/ewan-marimo-resources/index.js` automatically performs a
  hard navigation when a hydrated Marimo page links to a new notebook DOM, including a return to the same route after leaving it.
  The pinned `@marimo-team/islands@0.23.9` runtime owns one global Pyodide worker
  and exposes no supported notebook teardown and reinitialization seam.
- Paths: `plugins/ewan-marimo-resources/index.js`,
  `plugins/ewan-marimo-resources/dist/index.js`.
- Consequence: normal Quartz-to-Marimo navigation is now a true SPA transition,
  but moving directly between two already-hydrated notebook pages deliberately
  refreshes the browsing context to prevent the old notebook kernel from owning
  the new islands.
- Bounded next action: evaluate the next Marimo islands runtime with a documented
  teardown or per-notebook worker API, then extend the browser probe to navigate
  between two hydrated notebooks without changing its document sentinel.
- Exit condition: Marimo-to-Marimo SPA navigation hydrates the target notebook
  in the same document with no stale cells, leaked worker, or console errors.
- Last reviewed: 2026-09-07

## TD-FONTS-001 — Use bundled body fonts for social images

- Status: Open
- Evidence: the 2026-09-07 clean build logs `Google Fonts returned HTTP 400 for ewanfont (weight 400)`. The community OG emitter always calls its Google font fetcher, even with `fontOrigin: local`; its successfully fetched Lora font lets the build continue. Browser inspection separately confirms the local `ewanfont` loads on pages.
- Paths: `.quartz/plugins/og-image/src/emitter.tsx` (installed dependency), `plugins/ewan-fonts`, `quartz.config.yaml`.
- Bounded next action: add a supported local-font option upstream or a small owned emitter adapter consuming the bundled font; avoid edits to generated plugin installs.
- Exit condition: clean CI and local builds make no Google request for `ewanfont`, and rendered social images visibly use the intended body face.
- Last reviewed: 2026-09-07

## Reading experience and Bases maintenance — 2026-09-07

- TOC: heading dots, visible-page bar, and active-section range share one fixed article-to-rail projection. The highlighted heading is the visible heading closest to the viewport bar midpoint (falling back to the containing section when no heading is visible). The active label appears at rest; hover and keyboard focus reveal non-overlapping labels without moving the markers or scrolling the rail. ResizeObserver handles font, viewport, and article changes. Regression coverage checks marker/bar alignment across seven scroll positions and dense outlines, rather than just checking that labels do not collide.
- Explorer: opaque theme surfaces, quieter tree typography, explicit active/hover states, and a collapsible desktop panel isolate navigation from the canvas.
- Lorenz: actual RK4 trajectories replace the moving arrow field. Animation uses bounded trails at 30 fps, stops its frame loop while hidden, respects reduced motion in Auto mode, and measures draw cost rather than frame intervals. Explicit On overrides Auto restrictions on desktop, including reduced motion; the selected mode works even if preference storage is unavailable. This is generative art inspired by the Vault research direction, not measured neural data.
- Bases: the installed expression engine compares array equality by JavaScript identity. `Nootropic Compounds.base` now uses `list(class).contains("medication")`, a [documented Bases operation](https://obsidian.md/help/bases/functions), in both the content copy and canonical Vault file. The current published corpus produces 22 cards. Other list-equality queries remain an upstream compatibility concern; this is a scoped content repair.
- Marimo: removed document-module preloading of the worker; delayed speculative hover loading; require all reactive cells to reach idle before reporting ready; disconnect readiness observers/timers and disable notebook CSS on exit. A new notebook DOM still needs a fresh document under the pinned runtime. Eigenfish has desktop/mobile hydration coverage and a synthetic running-to-idle/exit regression check.
- Dependencies: all four previously tracked advisories are resolved. Baseline and final checks use Node 22.19.0; notebook export uses `.venv-marimo/bin/python` with Marimo 0.23.9.
- Verification entry points: `npm run check`, `npm test`, `npm run build`, `npm run probe`, `npm --prefix private/tooling run probe:reading`, `npm --prefix private/tooling run probe:browser`, `npm --prefix private/tooling run probe:eigenfish`, and `npm --prefix private/tooling run probe:responsive`. Set `QUARTZ_PROBE_URL` / `EIGENFISH_ORIGIN` to the local server. Browser evidence establishes local behavior; this pass does not deploy the site.

## Neural field and mobile reading — 2026-09-07

- Replaced the active Lorenz component with `plugins/ewan-neural-background`.
  The previous plugin and its work remain available, disabled in configuration.
  The new field is generative art from a bounded recurrent leaky integrate-and-fire
  network: visible packets are actual delayed excitatory/inhibitory transmissions.
  It does not use personal neural data or claim biological validation.
- Removed full-article/graph backdrop blur. Navigation uses opaque theme paper;
  the reading pane now uses 94% paper with a faint static grain tile, following
  the requested translucency and rough texture. Explorer and backlinks share quieter
  labels, spacing, hover/focus states, and bounded scrolling. The TOC retains the
  [LessWrong proportional rail model](https://github.com/ForumMagnum/ForumMagnum/blob/master/packages/lesswrong/components/posts/TableOfContents/FixedPositionToC.tsx),
  skips unchanged row updates, coalesces layout measurements, and supports direct
  rail clicks without prior pointer motion. Keyboard navigation remains intact.
- Mobile Explorer and its drawer button are hidden in the initial CSS at widths
  through 800px. Chromium checks at 390/800px cover JavaScript-disabled first load,
  search, backlinks, article scrolling, same-document navigation, and Back;
  desktop Explorer still collapses and reopens.
- Graph libraries load only when a graph is visible; Pixi uses its minified build.
  Measured cold mobile graph library payload fell from 2,679,986 decoded bytes to
  zero. Desktop fell to 1,098,577 decoded bytes (316,837 compressed response bytes,
  versus 537,120 before). The graph requests no more frames after layout settles,
  and pauses while hidden. These are Chromium network/runtime measurements,
  not a field Core Web Vitals result.
- The neural renderer caches its static connections, runs at 24/30fps, releases
  canvas backing stores when disabled, pauses in hidden tabs, and cleans up on
  Quartz navigation. Each of two canvas stores is capped at three million pixels;
  drawing/context failures stop the loop and release memory. Auto respects reduced
  motion, data saving, and constrained devices; an explicit desktop On is available.
  The first version exposed input activity and ink strength. Its local 1440px mean
  step/draw cost was 0.193ms versus 1.01ms for the earlier Lorenz baseline; these
  diagnostics exclude browser compositing and all other page work. That version's
  1440px/DPR2 check measured 0.142ms; its backing canvas used 2,998,554 pixels.
  A 4K/DPR2 check stayed at 2,999,391 pixels per canvas, and an injected drawing
  error stopped cleanly with zero uncaught errors and released backing stores.
- Verification: Node 22.19.0, 133 unit tests, type/format checks, clean full build
  and static corpus probe. Browser entry points are `probe:reading`, `probe:graph`,
  `probe:mobile`, `probe:neural`, `probe:responsive`, and `probe:browser`, with
  `QUARTZ_PROBE_URL` targeting an extensionless-route-capable local server.
  `probe:neural` includes real hidden-tab pause, four SPA transitions, 4K canvas
  bounds, and injected drawing failure. Local verification does not establish
  deployed behavior; these changes have not been published.

### Adaptive dynamics and varied geometry

- A fresh document now seeds a new network and parameter defaults. Islands,
  layers, and branches have distinct spatial organization and connection rules.
  A manual seed preserves the current parameters; New network chooses another
  seed and defaults. The recipe survives SPA navigation and motion toggles.
- Seven live controls affect input current, recurrence, inhibition, adaptation,
  oscillation amplitude, rhythm speed, and fluctuations. The adaptive LIF model
  combines delayed signals, heterogeneous cells, local correlated noise, and
  continuous background rhythms; the former sequential population stimulus is
  removed. Rhythm uses animation time rather than biological units. Brighter
  soma cores, halos, and expanding rings correspond to actual threshold crossings.
- Pure dynamics coverage includes deterministic replay and causal parameter
  changes, 384 minute-long parameter-corner runs, and three maximum-size
  ten-minute runs, with fixed arrays and no packet drops. The browser probe now
  checks native keyboard controls, geometry and seed replay, recipe persistence,
  and the seed-blur first-click regression alongside its prior lifecycle checks.
- Final local verification: 141 unit tests, type/format checks, a fresh full build,
  the 1,305-page static corpus probe, and reading, responsive, and extended neural
  Chrome probes passed. The emitted neural runtime exactly matches source. Final
  light/dark screenshots confirm 94% paper, theme-specific static grain, and no
  backdrop blur. One 1440px/DPR2 run measured 0.472ms mean simulation/draw time
  with 112 nodes and 599 edges, zero dropped packets, and no page errors. The
  4K check stayed at 2,999,391 pixels per backing store. These measurements
  exclude compositing and other page work; the changes remain local and unpublished.


## TD-MARIMO-002 — Aligned Markdown math in the islands runtime (resolved)

- Resolved locally 2026-09-08. Plotly's MathJax loader automatically scanned
  KaTeX's accessibility MathML after marimo rendered it, producing four invalid
  SVGs and twelve `NaN` dimension errors. Disable MathJax's startup document
  scan before loading islands; retain explicit chart-label typesetting.
- Markdown still uses native marimo KaTeX and reactive Python strings. Prose
  font rules now exclude KaTeX spans. The separate Bernoulli/Binomial formula
  missing its command backslashes was corrected through the live marimo kernel
  and synchronized to the published notebook copy.
- Chrome verified the full Lotka–Volterra page's aligned/cases equations without
  malformed math or console errors, plus all three linked TangleLatex editors
  driving the four plots. A separate probe verifies math interpolation in both
  static-preview and deferred notebooks.
- Recheck `LOTKA_BUILT=1 npm --prefix private/tooling run probe:lotka` and
  `npm --prefix private/tooling run probe:markdown` on runtime upgrades.
  Browser probes and receipts are private; math errors are no longer exempted.
