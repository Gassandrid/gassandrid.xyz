# Recurrent neural field

A generative background made from a small, seeded adaptive leaky integrate-and-fire
network. Membrane voltage leaks toward rest, incoming excitatory or inhibitory
packets change it, and threshold crossings emit delayed packets after resetting
the neuron into a refractory period. Recent spikes temporarily reduce excitability.
Heterogeneous input currents, shared and local oscillations, and correlated current
fluctuations interact with recurrent connections. Curves show connections, moving
marks show simulated transmissions, and bright soma pulses mark actual spikes.
This is dimensionless generative art, not measured activity or a fitted biological
model. The [LIF introduction](https://neuronaldynamics.epfl.ch/online/Ch1.S3.html)
and [adaptation discussion](https://neuronaldynamics.epfl.ch/online/Ch6.S2.html)
provide the conceptual background; this implementation does not reproduce their
biophysical parameter sets.

The three geometries change both neuron positions and connection selection:
**Islands** favor local clusters with intercluster bridges; **Layers** favor nearby
bands and adjacent-layer links; **Branches** favor shared and parent branches.
All include sparse connections across the reading pane. Branches are abstract graph
filaments, not a simulation of dendrites.

`NeuralBackground` mounts in Quartz's `afterBody` position. It consumes the site's
theme variables. The article and navigation surfaces own their paper backgrounds;
the canvas also attenuates the center so the detail lives in the margins.

The **Network** disclosure exposes Motion (Auto/On/Off), Geometry, Seed, New network,
and live controls:

- Input current: tonic external drive.
- Recurrence: all transmitted synaptic weights.
- Inhibition: additional strength of inhibitory weights.
- Adaptation: spike-triggered suppression of subsequent firing.
- Oscillation: amplitude of shared and local rhythmic current.
- Rhythm speed: cycles per animation second, not biological hertz.
- Fluctuation: amplitude of seeded local and individual current noise.
- Ink: visual opacity, independent of the model.

Each fresh document gets a new seed, geometry, and seed-derived parameter defaults.
New network regenerates the seed and defaults while retaining geometry. Manually
entering a seed retains current parameters and geometry. The same seed, geometry,
parameters, neuron count, and step sequence reproduce the same network activity.
The recipe and ink survive Quartz SPA navigation; simulation time restarts on each
page. Sliders affect the running network without resetting it.

Motion defaults to Off on screens up to 800px wide and On on desktop; saved visitor
choices still take precedence. Seed-derived defaults use gentler input current,
recurrence, oscillation, rhythm speed, and fluctuation; all sliders retain their full range.
Mobile uses 80 neurons, 24fps, DPR at most 1, and a panel sized to the viewport.
Optional Auto observes reduced motion, small screens, data saving, low device
memory and a measured draw budget. Every mode pauses in a hidden document.
On overrides Auto's constraints. Motion preference persists locally. The main
reading surface uses 94% theme paper and a faint static grain tile;
navigation remains opaque, and the canvas mask attenuates the article area.

The runtime caps the field at 80 or 112 neurons, four to eight outgoing edges per neuron,
four fixed transmission slots per edge, 24 or 30 frames per second, and device
pixel ratio 1 or 1.5, with a three-million-pixel limit per canvas (under 24 MB
for the two RGBA backing stores, excluding browser overhead). Static structure is
drawn into a cached canvas only on size or theme changes. Disabled modes allocate
no canvas backing stores. SPA `prenav`
destroys the renderer, observers, timers, per-page listeners, and controls; `nav`
creates one fresh instance.
Rendering failures stop the animation and release both backing stores.

`#neural-canvas` exposes `data-neural-state`, `quality`, `nodes`, `edges`,
`packet-capacity`, `frames`, `sim-time`, `spikes`, `pending`, `dropped`, `fps`, `dpr`,
`draw-ms`, `reason`, `seed`, `layout`, `parameters`, and `topology` (all with the `data-neural-`
prefix). Topology is a diagnostic hash of directed endpoints, not a recipe identifier.
Frames updates on every draw;
timing and simulation counters update every 60 frames. Draw time includes the
network step and canvas drawing, and excludes browser compositing and other page
work. It is a local diagnostic, not a total page-performance measurement.

Run the pure dynamics checks with:

```sh
node --test plugins/ewan-neural-background.test.js
```

The tests cover replay, parameter effects, geometry, 384 minute-long parameter
corner runs, and three maximum-size ten-minute runs with bounded state and no
dropped packets. `npm run probe:neural` checks native controls, recipe persistence,
SPA cleanup, hidden-tab pause, backing-store limits, and rendering failure in Chrome.
