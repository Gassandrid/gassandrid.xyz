# Source: https://colab.research.google.com/drive/1dyaxotNxBD92xTXGXNRzkomIrWNf-ch-?usp=sharing
# Original: ../data/raw/lotka_volterra_colab.ipynb
# Exercise placeholders intentionally preserved; repeated imports consolidated.

import marimo

__generated_with = "0.24.0"
app = marimo.App()


@app.cell(hide_code=True)
def _():
    import marimo as mo

    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Discrete Lotka-Volterra mean-field model
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    from wigglystuff import TangleLatex

    parameters = mo.ui.anywidget(TangleLatex(
        theme="light",
        latex=r"\begin{aligned}f_0 &= \tangle{f_0}, & s_0 &= \tangle{s_0} \\ \alpha &= \tangle{alpha}, & \delta &= \tangle{delta} \\ \gamma &= \tangle{gamma}, & c &= \tangle{c}\end{aligned}",
        parameters={
            "f_0": {"value": 100, "min_value": 0, "step": 1, "digits": 0},
            "s_0": {"value": 10, "min_value": 0, "step": 1, "digits": 0},
            "alpha": {"value": 0.05, "min_value": 0, "step": 0.001, "digits": 3},
            "delta": {"value": 0.01, "min_value": 0, "max_value": 1, "step": 0.001, "digits": 3},
            "gamma": {"value": 0.007, "min_value": 0, "max_value": 1, "step": 0.001, "digits": 3},
            "c": {"value": 1/20, "min_value": 0, "step": 0.001, "digits": 3},
        },
    ))

    from ipywidgets import link
    parameters.values = {'f_0': 80, 's_0': 8, 'alpha': 0.137, 'delta': 0.016, 'gamma': 0.009, 'c': 0.05}

    simulation_formula = mo.ui.anywidget(TangleLatex(
        theme="light",
        latex=r"\begin{aligned}F_{t+1} &= F_t + \tangle{alpha} F_t - F_t[1-(1-\tangle{delta})^{S_t}] \\ S_{t+1} &= S_t + \tangle{c} F_t[1-(1-\tangle{delta})^{S_t}] - \tangle{gamma} S_t \\ F_0 &= \tangle{f_0},\qquad S_0 = \tangle{s_0}\end{aligned}",
        parameters={_name: {**_spec, "value": parameters.values[_name]}
                    for _name, _spec in parameters.parameters.items()},
    ))
    parameter_link = link((parameters.widget, "values"), (simulation_formula.widget, "values"))

    stochastic_formula = mo.ui.anywidget(TangleLatex(
        theme="light",
        latex=r"\begin{aligned}p_t &= 1-(1-\tangle{delta})^{S_t} \\ E_{i,t} &= \mathbf{1}[V_{i,t}<p_t] \\ \Delta F_t &= \sum_{i=1}^{F_t}\left(\mathbf{1}[U_{i,t}<\tangle{alpha}]-E_{i,t}\right) \\ \Delta S_t &= \sum_{i=1}^{F_t} E_{i,t}\mathbf{1}[W_{i,t}<\tangle{c}]-\sum_{j=1}^{S_t}\mathbf{1}[Z_{j,t}<\tangle{gamma}] \\ F_{t+1}&=F_t+\Delta F_t,\qquad S_{t+1}=S_t+\Delta S_t \\ F_0&=\tangle{f_0},\qquad S_0=\tangle{s_0}\end{aligned}",
        parameters={_name: {**_spec, "value": parameters.values[_name]}
                    for _name, _spec in parameters.parameters.items()},
    ))
    stochastic_parameter_link = link((parameters.widget, "values"), (stochastic_formula.widget, "values"))
    parameters

    return parameters, simulation_formula, stochastic_formula


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    $F_t$: fish, $S_t$: sharks.

    A fish avoids one shark with probability $1-\delta$. Assuming independent encounters, avoiding all $S_t$ sharks has probability $(1-\delta)^{S_t}$.

    So the probability of being eaten is

    $$p_t=1-(1-\delta)^{S_t}$$

    and the expected number eaten is $F_t p_t$.

    $$
    \begin{aligned}
    \Delta F_t &= \underbrace{\alpha F_t}_{\text{births}}-\underbrace{F_t[1-(1-\delta)^{S_t}]}_{\text{eaten}}\\
    \Delta S_t &= \underbrace{cF_t[1-(1-\delta)^{S_t}]}_{\text{new sharks}}-\underbrace{\gamma S_t}_{\text{deaths}}\\[4pt]
    F_{t+1}&=F_t+\Delta F_t\\
    S_{t+1}&=S_t+\Delta S_t
    \end{aligned}
    $$

    $\alpha$: fish growth per step. $\gamma$: shark death rate. $c$: conversion from eaten fish to new sharks.

    Both updates use the populations at time $t$.

    For small $\delta S_t$, $1-(1-\delta)^{S_t}\approx\delta S_t$, giving the usual $\delta F_tS_t$ interaction term.

    Mean-field model: fractional populations, no random draws or carrying capacity. It gives the expected change from a given state, not necessarily the average of full stochastic trajectories.
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.mermaid("""flowchart LR
        F["Prey F"] -->|"+ reproduction: alpha F"| F
        S["Predators S"] -->|"− predation: F p"| F
        F -->|"+ food: c F p"| S
        S -->|"− mortality: gamma S"| S
    """)
    return


@app.cell(hide_code=True)
def _(parameters, simulation_formula, stochastic_formula):
    # All three editors drive the same simulation parameters.
    _formula_values = simulation_formula.values
    f_0 = parameters.values["f_0"]
    s_0 = parameters.values["s_0"]
    alpha = parameters.values["alpha"]
    delta = parameters.values["delta"]
    gamma = parameters.values["gamma"]
    c = parameters.values["c"]
    _stochastic_values = stochastic_formula.values

    return alpha, c, delta, f_0, gamma, s_0


@app.cell(hide_code=True)
def _(mo):
    generations = mo.ui.slider(1, 1000, value=371, label="Generations", show_value=True)
    plot_view = mo.ui.dropdown(["Populations", "Phase plane"], value="Populations", label="View")
    mo.hstack([generations, plot_view])
    return generations, plot_view


@app.cell(hide_code=True)
def _(simulation_formula):
    simulation_formula
    return


@app.cell(hide_code=True)
def _(f_t, mo, np, plot_view, s_t):
    import plotly.graph_objects as go

    _figure = go.Figure()
    if plot_view.value == "Populations":
        _figure.add_scatter(x=np.arange(len(f_t)), y=f_t, name="Prey F", mode="lines")
        _figure.add_scatter(x=np.arange(len(s_t)), y=s_t, name="Predators S", mode="lines")
        _figure.update_layout(xaxis_title="Generation", yaxis_title="Population")
    else:
        _figure.add_scatter(x=f_t, y=s_t, mode="lines", name="Trajectory")
        _figure.add_scatter(x=[f_t[0]], y=[s_t[0]], mode="markers", name="Start")
        _figure.update_layout(xaxis_title="Prey F", yaxis_title="Predators S")
    _figure.update_layout(template="plotly_white", height=360, margin=dict(l=45,r=20,t=20,b=45))
    mo.ui.plotly(_figure)

    return (go,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Discrete Lotka-Volterra stochastic simulation
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    Same initial conditions and parameters as above. Now we go over the animals individually.

    **For each generation:** start with $\Delta F=0$, $\Delta S=0$.

    For each fish currently in the sea:

    - have a child? `random.uniform(0, 1) < alpha` → add 1 to $\Delta F$
    - get eaten? another draw, smaller than $1-(1-\delta)^{S_t}$ → subtract 1 from $\Delta F$
    - if eaten, does this produce a new shark? draw smaller than $c$ → add 1 to $\Delta S$

    For each shark:

    - die? draw smaller than $\gamma$ → subtract 1 from $\Delta S$

    Then update:

    $$
    \begin{aligned}
    F_{t+1}&=F_t+\Delta F_t\\
    S_{t+1}&=S_t+\Delta S_t
    \end{aligned}
    $$

    We loop over the populations at time $t$. Newborns wait until the next generation. A fish can have a child and then get eaten in the same step.

    The predation draw combines the independent shark encounters: $(1-\delta)^{S_t}$ is the probability of avoiding all sharks.

    Integer populations, probabilities in $[0,1]$. Same seed → same random sequence.
    """)
    return


@app.cell(hide_code=True)
def _(alpha, c, delta, f_0, gamma, generations, s_0):
    import numpy as np


    def simulate_populations(f_initial, s_initial, growth, encounter, mortality, conversion, generations):
        prey = np.empty(generations + 1)
        predators = np.empty(generations + 1)
        prey[0], predators[0] = f_initial, s_initial
        for t in range(generations):
            probability = 1 - (1 - encounter) ** predators[t]
            loss = prey[t] * probability
            delta_f = growth * prey[t] - loss
            delta_s = conversion * loss - mortality * predators[t]
            prey[t + 1] = prey[t] + delta_f
            predators[t + 1] = predators[t] + delta_s
        return prey, predators


    f_t, s_t = simulate_populations(f_0, s_0, alpha, delta, gamma, c, generations.value)

    return f_t, np, s_t


@app.cell(hide_code=True)
def _(mo):
    stochastic_seed = mo.ui.number(start=0, stop=1000000, value=42, step=1, label="Random seed")
    mo.hstack([stochastic_seed])
    return (stochastic_seed,)


@app.cell(hide_code=True)
def _(alpha, c, delta, f_0, gamma, generations, mo, s_0, stochastic_seed):
    from random import Random


    def simulate_stochastic(f_initial, s_initial, alpha, encounter_probability,
                            death_probability, conversion_probability, generations, seed,
                            trial_budget=2000000):
        if int(f_initial) != f_initial or int(s_initial) != s_initial:
            raise ValueError("Stochastic initial populations must be integers.")
        if min(f_initial, s_initial) < 0:
            raise ValueError("Initial populations must be nonnegative.")
        if not all(0 <= p <= 1 for p in (alpha, encounter_probability,
                                        death_probability, conversion_probability)):
            raise ValueError("Stochastic probabilities must lie between 0 and 1.")
        random = Random(seed)

        # Initialize
        fish, sharks = int(f_initial), int(s_initial)
        fish_history, shark_history = [fish], [sharks]
        event_history = []
        trials = 0
        stopped_early = False

        # Update: every animal present at the beginning of this generation
        for generation in range(generations):
            if trials + 3 * fish + sharks > trial_budget:
                stopped_early = True
                break  # Bound notebook work; never silently clamp populations.
            delta_f = delta_s = 0
            fish_births = fish_eaten = shark_births = shark_deaths = 0
            eaten_probability = 1 - (1 - encounter_probability) ** sharks

            for fish_index in range(fish):
                # Are you going to have a child? Yes/no.
                if random.uniform(0, 1) < alpha:
                    delta_f += 1
                    fish_births += 1
                # Are you eaten by at least one current shark? Yes/no.
                if random.uniform(0, 1) < eaten_probability:
                    delta_f -= 1
                    fish_eaten += 1
                    if random.uniform(0, 1) < conversion_probability:
                        delta_s += 1
                        shark_births += 1

            for shark_index in range(sharks):
                if random.uniform(0, 1) < death_probability:
                    delta_s -= 1
                    shark_deaths += 1

            trials += 3 * fish + sharks
            fish += delta_f
            sharks += delta_s

            # Observe
            fish_history.append(fish)
            shark_history.append(sharks)
            event_history.append({"generation": generation + 1,
                                  "fish_births": fish_births, "fish_eaten": fish_eaten,
                                  "shark_births": shark_births, "shark_deaths": shark_deaths})

        return fish_history, shark_history, event_history, stopped_early


    mo.stop(any(not 0 <= p <= 1 for p in (alpha, delta, gamma, c)),
            mo.md("For this stochastic model, α, δ, γ and c must lie in [0, 1]."))
    mo.stop(int(f_0) != f_0 or int(s_0) != s_0,
            mo.md("Use integer initial populations for individual-animal trials."))
    stochastic_f, stochastic_s, stochastic_events, stochastic_truncated = simulate_stochastic(
        f_0, s_0, alpha, delta, gamma, c, generations.value, int(stochastic_seed.value))

    return Random, stochastic_f, stochastic_s, stochastic_truncated


@app.cell(hide_code=True)
def _(mo, stochastic_formula):
    mo.vstack([
        stochastic_formula,
        mo.md(r"$U,V,W,Z$: independent uniform draws on $[0,1]$. $\mathbf{1}[\cdot]$: 1 if true, 0 otherwise. $E_{i,t}$: fish $i$ gets eaten."),
    ])
    return


@app.cell(hide_code=True)
def _(
    f_t,
    go,
    mo,
    np,
    plot_view,
    s_t,
    stochastic_f,
    stochastic_s,
    stochastic_truncated,
):
    _stochastic_figure = go.Figure()
    if plot_view.value == "Populations":
        _stochastic_figure.add_scatter(x=list(range(len(stochastic_f))), y=stochastic_f,
                                      name="Fish F · stochastic", mode="lines", line_shape="hv")
        _stochastic_figure.add_scatter(x=list(range(len(stochastic_s))), y=stochastic_s,
                                      name="Sharks S · stochastic", mode="lines", line_shape="hv")
        _stochastic_figure.add_scatter(x=np.arange(len(f_t)), y=f_t,
                                      name="Fish F · mean field", mode="lines", line=dict(dash="dot"))
        _stochastic_figure.add_scatter(x=np.arange(len(s_t)), y=s_t,
                                      name="Sharks S · mean field", mode="lines", line=dict(dash="dot"))
        _stochastic_figure.update_layout(xaxis_title="Generation", yaxis_title="Population")
    else:
        _stochastic_figure.add_scatter(x=stochastic_f, y=stochastic_s, mode="lines", name="Stochastic")
        _stochastic_figure.add_scatter(x=f_t, y=s_t, mode="lines", name="Mean field", line=dict(dash="dot"))
        _stochastic_figure.update_layout(xaxis_title="Fish F", yaxis_title="Sharks S")
    _stochastic_figure.update_layout(template="plotly_white", height=360,
                                     margin=dict(l=45,r=20,t=20,b=45))
    _stochastic_outputs = [mo.ui.plotly(_stochastic_figure)]
    if stochastic_truncated:
        _stochastic_outputs.append(mo.md(
            f"Stopped after {len(stochastic_f)-1} generations at the individual-trial work limit; "
            "reduce the horizon or growth probability to run the full trajectory."))
    mo.vstack(_stochastic_outputs)

    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    Issue with this simulation is how often we are drawing a random number. Instead of for each fish, drawing a random number as their probability of child, just draw a single random number and apply as % of all fish that succeed. Sum of bernouli trials? binomial distribution!
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Counting successes directly

    Each fish has a child with probability $\alpha$. For one fish, this is a **Bernoulli trial**:

    $$X_i=\begin{cases}1 & \text{child}\\0 & \text{no child}\end{cases}$$

    How many fish have children in total?

    $$B^F_t=\sum_{i=1}^{F_t}X_i\sim\operatorname{Binomial}(F_t,\alpha)$$

    So we can replace the whole birth loop with `rng.binomial(fish, alpha)`. This returns a **count**, not a percentage.

    A uniform percentage would give the wrong distribution. For $F_t=100$, $\alpha=0.05$, we expect 5 births, with variance $100(0.05)(0.95)=4.75$. Most draws should be near 5, not spread evenly from 0 to 100.

    Same idea for the other events:

    $$
    \begin{aligned}
    p_t&=1-(1-\delta)^{S_t}\\
    B^F_t&\sim\operatorname{Binomial}(F_t,\alpha) &&\text{fish births}\\
    L_t&\sim\operatorname{Binomial}(F_t,p_t) &&\text{fish eaten}\\
    B^S_t\mid L_t&\sim\operatorname{Binomial}(L_t,c) &&\text{new sharks}\\
    D^S_t&\sim\operatorname{Binomial}(S_t,\gamma) &&\text{shark deaths}\\[4pt]
    \Delta F_t&=B^F_t-L_t\\
    \Delta S_t&=B^S_t-D^S_t
    \end{aligned}
    $$

    Draw the number eaten **before** drawing new sharks. The shark birth trial count is $L_t$, not $F_t$.

    Four binomial draws per generation. Same transition probabilities as the individual loops, fewer Python calls. The same seed won't give the same path across the two implementations: they consume random numbers differently.
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    bernoulli_n = mo.ui.slider(1, 100, value=20, step=1, label="Trials n", show_value=True)
    bernoulli_p = mo.ui.slider(0, 1, value=0.3, step=0.01, label="Success probability p", show_value=True)
    bernoulli_draw = mo.ui.button(value=0, on_click=lambda count: count + 1, label="Draw again")
    mo.vstack([mo.md(""), mo.hstack([bernoulli_n, bernoulli_p, bernoulli_draw])])
    return bernoulli_draw, bernoulli_n, bernoulli_p


@app.cell(hide_code=True)
def _(Random, bernoulli_draw, bernoulli_n, bernoulli_p, go, mo, np):
    from math import comb
    from plotly.subplots import make_subplots

    _demo_n, _demo_p = bernoulli_n.value, bernoulli_p.value
    _demo_rng = Random(42 + bernoulli_draw.value)
    _demo_uniforms = np.array([_demo_rng.uniform(0, 1) for _ in range(_demo_n)])
    _demo_success = _demo_uniforms < _demo_p
    _demo_k = int(_demo_success.sum())
    _demo_counts = np.arange(_demo_n + 1)
    _demo_pmf = np.array([comb(_demo_n, int(k)) * _demo_p**k * (1-_demo_p)**(_demo_n-k) for k in _demo_counts])
    _demo_fig = make_subplots(rows=2, cols=1, vertical_spacing=0.22,
        subplot_titles=(f"Individual trials: {_demo_k} successes out of {_demo_n}", "Distribution of the total"))
    for _label, _mask, _color in [("Success", _demo_success, "#237a57"), ("Failure", ~_demo_success, "#90969c")]:
        _demo_fig.add_trace(go.Scatter(x=np.arange(1,_demo_n+1)[_mask], y=_demo_uniforms[_mask],
            mode="markers", name=_label, marker=dict(color=_color,size=9),
            hovertemplate="Trial %{x}<br>u=%{y:.3f}<extra>%{fullData.name}</extra>"),row=1,col=1)
    _demo_fig.add_hline(y=_demo_p,line_dash="dash",line_color="#237a57",row=1,col=1,
        annotation_text=f"p = {_demo_p:.2f} · below = success")
    _demo_fig.add_trace(go.Bar(x=_demo_counts,y=_demo_pmf,showlegend=False,
        marker_color=["#237a57" if k==_demo_k else "#c3c8cc" for k in _demo_counts],
        hovertemplate="%{x} successes<br>Probability %{y:.4f}<extra></extra>"),row=2,col=1)
    _demo_fig.add_vline(x=_demo_n*_demo_p,line_dash="dot",line_color="#30363b",row=2,col=1,
        annotation_text=f"mean np = {_demo_n*_demo_p:.2f}")
    _demo_fig.update_xaxes(title_text="Trial",row=1,col=1)
    _demo_fig.update_yaxes(title_text="Uniform draw u",range=[-0.05,1.08],row=1,col=1)
    _demo_fig.update_xaxes(title_text="Total successes k",dtick=max(1,_demo_n//10),row=2,col=1)
    _demo_fig.update_yaxes(title_text="P(K = k)",rangemode="tozero",row=2,col=1)
    _demo_fig.update_layout(template="plotly_white",height=570,margin=dict(l=55,r=20,t=45,b=45),
        legend=dict(orientation="h",y=1.13))
    mo.vstack([
        mo.ui.plotly(_demo_fig),
        mo.md(r"$X_i=mathbf{1}[u_i<p]$, $quad K=sum_{i=1}^nX_isimmathrm{Binomial}(n,p)$"),
        mo.md(f"Green bar: **{_demo_k} successes** this time."),
    ])
    return


@app.cell
def _(alpha, c, delta, f_0, gamma, generations, mo, np, s_0, stochastic_seed):
    def simulate_binomial(f_initial, s_initial, alpha, delta, gamma, c,
                          generations, seed, population_limit=10**12):
        if min(f_initial, s_initial) < 0 or int(f_initial) != f_initial or int(s_initial) != s_initial:
            raise ValueError("Use nonnegative integer populations.")
        if not all(0 <= p <= 1 for p in (alpha, delta, gamma, c)):
            raise ValueError("Probabilities must lie in [0, 1].")
        rng = np.random.default_rng(seed)

        # Initialize
        fish, sharks = int(f_initial), int(s_initial)
        fish_history, shark_history = [fish], [sharks]
        events = []
        stopped_early = False

        for generation in range(generations):
            if max(fish, sharks) > population_limit:
                stopped_early = True
                break  # Stop before unsafe trial counts; do not clamp the populations.

            # Update: draw event counts from the current populations
            eaten_probability = 1 - (1 - delta) ** sharks
            fish_births = int(rng.binomial(fish, alpha))
            fish_eaten = int(rng.binomial(fish, eaten_probability))
            shark_births = int(rng.binomial(fish_eaten, c))
            shark_deaths = int(rng.binomial(sharks, gamma))

            delta_f = fish_births - fish_eaten
            delta_s = shark_births - shark_deaths
            fish += delta_f
            sharks += delta_s

            # Observe
            fish_history.append(fish)
            shark_history.append(sharks)
            events.append({"generation": generation + 1,
                           "fish_births": fish_births, "fish_eaten": fish_eaten,
                           "shark_births": shark_births, "shark_deaths": shark_deaths})

        return fish_history, shark_history, events, stopped_early


    mo.stop(any(not 0 <= p <= 1 for p in (alpha, delta, gamma, c)),
            mo.md("Probabilities must lie in [0, 1]."))
    mo.stop(int(f_0) != f_0 or int(s_0) != s_0, mo.md("Use integer initial populations."))
    binomial_f, binomial_s, binomial_events, binomial_truncated = simulate_binomial(
        f_0, s_0, alpha, delta, gamma, c, generations.value, int(stochastic_seed.value))

    return binomial_f, binomial_s, binomial_truncated


@app.cell(hide_code=True)
def _(
    binomial_f,
    binomial_s,
    binomial_truncated,
    f_t,
    go,
    mo,
    np,
    plot_view,
    s_t,
):
    _binomial_plot = go.Figure()
    if plot_view.value == "Populations":
        _binomial_plot.add_scatter(x=list(range(len(binomial_f))), y=binomial_f,
                                  name="Fish · binomial", mode="lines", line_shape="hv")
        _binomial_plot.add_scatter(x=list(range(len(binomial_s))), y=binomial_s,
                                  name="Sharks · binomial", mode="lines", line_shape="hv")
        _binomial_plot.add_scatter(x=np.arange(len(f_t)), y=f_t, name="Fish · mean field",
                                  mode="lines", line=dict(dash="dot"))
        _binomial_plot.add_scatter(x=np.arange(len(s_t)), y=s_t, name="Sharks · mean field",
                                  mode="lines", line=dict(dash="dot"))
        _binomial_plot.update_layout(xaxis_title="Generation", yaxis_title="Population")
    else:
        _binomial_plot.add_scatter(x=binomial_f, y=binomial_s, mode="lines", name="Binomial")
        _binomial_plot.add_scatter(x=f_t, y=s_t, mode="lines", name="Mean field", line=dict(dash="dot"))
        _binomial_plot.update_layout(xaxis_title="Fish F", yaxis_title="Sharks S")
    _binomial_plot.update_layout(template="plotly_white", height=360,
                                 margin=dict(l=45,r=20,t=20,b=45))
    _binomial_outputs = [mo.ui.plotly(_binomial_plot)]
    if binomial_truncated:
        _binomial_outputs.append(mo.md(f"Stopped after {len(binomial_f)-1} generations: population exceeded the numerical work limit."))
    mo.vstack(_binomial_outputs)

    return


if __name__ == "__main__":
    app.run()
