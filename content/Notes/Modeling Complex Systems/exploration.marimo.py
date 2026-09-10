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
    ## Discrete SIR disease model
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    from wigglystuff import TangleLatex

    parameters = mo.ui.anywidget(TangleLatex(
        theme="light",
        latex=r"\begin{aligned}S_0 &= \tangle{s0}, & I_0 &= \tangle{i0}, & R_0 &= \tangle{r0} \\ \alpha &= \tangle{alpha}, & \beta &= \tangle{beta}\end{aligned}",
        parameters={
            "s0": {"value": 990, "min_value": 0, "max_value": 100000, "step": 1, "digits": 0},
            "i0": {"value": 10, "min_value": 0, "max_value": 100000, "step": 1, "digits": 0},
            "r0": {"value": 0, "min_value": 0, "max_value": 100000, "step": 1, "digits": 0},
            "alpha": {"value": 0.1, "min_value": 0, "max_value": 1, "step": 0.001, "digits": 3},
            "beta": {"value": 0.001, "min_value": 0, "max_value": 1, "step": 0.0001, "digits": 4},
        },
    ))
    parameters.values = {'s0': 973, 'i0': 24, 'r0': 0, 'alpha': 0.051, 'beta': 0.0027}

    from ipywidgets import link

    _symbols = {"s0": r"S_0", "i0": r"I_0", "r0": r"R_0", "alpha": r"\alpha", "beta": r"\beta"}
    simulation_formula = mo.ui.anywidget(TangleLatex(
        theme="light",
        latex=r"\begin{aligned}\Delta S &= S_t[1-(1-\tangle{beta})^{I_t}] \\ \Delta I &= \Delta S-\tangle{alpha} I_t \\ \Delta R &= \tangle{alpha} I_t \\[4pt] S_{t+1} &= S_t-\Delta S \\ I_{t+1} &= I_t+\Delta I \\ R_{t+1} &= R_t+\Delta R \\[4pt] S_0 &= \tangle{s0},\quad I_0 = \tangle{i0},\quad R_0 = \tangle{r0}\end{aligned}",
        parameters={
            _name: {**_spec, "value": parameters.values[_name],
                    "display": "symbol", "symbol": _symbols[_name]}
            for _name, _spec in parameters.parameters.items()
        },
        reveal_all_on_drag=False,
    ))
    parameter_link = link((parameters.widget, "values"), (simulation_formula.widget, "values"))

    stochastic_formula = mo.ui.anywidget(TangleLatex(
        theme="light",
        latex=r"\begin{aligned}p_t &= 1-(1-\tangle{beta})^{I_t} \\ C_t &\sim \operatorname{Binomial}(S_t,p_t) \\ D_t &\sim \operatorname{Binomial}(I_t,\tangle{alpha}) \\[4pt] S_{t+1} &= S_t-C_t \\ I_{t+1} &= I_t+C_t-D_t \\ R_{t+1} &= R_t+D_t \\[4pt] S_0 &= \tangle{s0},\quad I_0 = \tangle{i0},\quad R_0 = \tangle{r0}\end{aligned}",
        parameters={
            _name: {**_spec, "value": parameters.values[_name],
                    "display": "symbol", "symbol": _symbols[_name]}
            for _name, _spec in parameters.parameters.items()
        },
        reveal_all_on_drag=False,
    ))
    stochastic_parameter_link = link((parameters.widget, "values"), (stochastic_formula.widget, "values"))
    parameters
    return parameters, simulation_formula, stochastic_formula


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    $S$: susceptible, $I$: infectious, $R$: recovered. $S_0$, $I_0$, $R_0$ are their initial populations; $R_0$ here is not the basic reproduction number.

    A susceptible individual avoids infection from one infectious individual with probability $1-\beta$. With independent encounters, the probability of infection in one step is

    $$p_t = 1-(1-\beta)^{I_t}.$$

    So $S_t p_t$ people become infected and $\alpha I_t$ recover per step. $\beta$ is the per-pair infection probability; $\alpha$ is the fraction recovering.
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.mermaid("""flowchart LR
        S["Susceptible S"] -->|"infection: S p"| I["Infectious I"]
        I -->|"recovery: alpha I"| R["Recovered R"]
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ### Computing the mean field

    For $X\sim\operatorname{Binomial}(n,p)$, $\mathbb E[X]=np$. Given the current state $\mathcal F_t=(S_t,I_t,R_t)$, let $C_t$ count new infections and $D_t$ count recoveries:

    $$
    \begin{aligned}
    \mathbb E[C_t\mid\mathcal F_t]&=S_t[1-(1-\beta)^{I_t}],\\
    \mathbb E[D_t\mid\mathcal F_t]&=\alpha I_t.
    \end{aligned}
    $$

    Replace each random count by its conditional expectation to obtain the deterministic updates below. These give the **exact expected next state from a fixed current state**.

    Iterating them is a mean-field approximation, not generally the average stochastic trajectory: once the state is random,

    $$\mathbb E[S_t(1-(1-\beta)^{I_t})]\ne\mathbb E[S_t]\bigl(1-(1-\beta)^{\mathbb E[I_t]}\bigr)$$

    in general. The nonlinear infection term depends on the joint distribution of $S_t$ and $I_t$.
    """)
    return


@app.cell(hide_code=True)
def _(simulation_formula):
    simulation_formula
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    $\Delta S$ denotes **new infections**, so it is subtracted from $S$. All three deltas use the populations at time $t$, before any update.

    Closed population, permanent immunity, no births or deaths: $S+I+R$ stays constant. This deterministic mean-field model allows fractional populations; it does not draw individual infection events.
    """)
    return


@app.cell(hide_code=True)
def _(alpha, beta, i0, mo, r0, s0):
    _initial_infections = s0 * (1 - (1 - beta) ** i0)
    _initial_recoveries = alpha * i0
    mo.md(f"""
    **First mean-field step with these parameters:** expected infections = **{_initial_infections:.3f}**, expected recoveries = **{_initial_recoveries:.3f}**.

    $(S_1,I_1,R_1)$ = **({s0-_initial_infections:.3f}, {i0+_initial_infections-_initial_recoveries:.3f}, {r0+_initial_recoveries:.3f})**.
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    generations = mo.ui.slider(1, 1000, value=100, label="Generations", show_value=True)
    generations
    return (generations,)


@app.cell(hide_code=True)
def _(mo):
    plot_view = mo.ui.dropdown(["Populations", "Phase plane"], value="Populations", label="View")
    plot_view
    return (plot_view,)


@app.cell(hide_code=True)
def _(parameters, simulation_formula, stochastic_formula):
    _stochastic_values = stochastic_formula.values
    _formula_values = simulation_formula.values
    s0 = parameters.values["s0"]
    i0 = parameters.values["i0"]
    r0 = parameters.values["r0"]
    alpha = parameters.values["alpha"]
    beta = parameters.values["beta"]
    return alpha, beta, i0, r0, s0


@app.cell(hide_code=True)
def _(alpha, beta, generations, i0, r0, s0):
    S = s0
    I = i0
    R = r0
    St = []
    It = []
    Rt = []

    St.append(S)
    It.append(I)
    Rt.append(R)

    for _ in range(generations.value):
        delta_S = S * (1 - (1 - beta) ** I)
        delta_I = delta_S - alpha * I
        delta_R = alpha * I

        S -= delta_S
        I += delta_I
        R += delta_R

        St.append(S)
        It.append(I)
        Rt.append(R)
    return It, Rt, St


@app.cell(hide_code=True)
def _(It, Rt, St, mo, plot_view):
    import plotly.graph_objects as go

    _figure = go.Figure()
    if plot_view.value == "Populations":
        for _series, _name in [(St, "Susceptible S"), (It, "Infectious I"), (Rt, "Recovered R")]:
            _figure.add_scatter(x=list(range(len(_series))), y=_series, name=_name, mode="lines")
        _figure.update_layout(xaxis_title="Generation", yaxis_title="Population")
    else:
        _figure.add_scatter(x=St, y=It, name="Trajectory", mode="lines")
        _figure.add_scatter(x=[St[0]], y=[It[0]], name="Start", mode="markers")
        _figure.update_layout(xaxis_title="Susceptible S", yaxis_title="Infectious I")
    _figure.update_layout(
        template="plotly_white", height=360,
        margin=dict(l=45, r=20, t=20, b=45),
    )
    mo.ui.plotly(_figure)
    return (go,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Stochastic SIR: binomial event counts

    Each susceptible person has an independent infection trial with probability $p_t$; each currently infectious person has a recovery trial with probability $\alpha$. Their totals are binomial counts, not random percentages.

    Draw infections and recoveries independently **conditional on the current state**, then apply both updates. Newly infected people cannot recover until the next step. Two binomial draws per generation replace the individual-person loops.
    """)
    return


@app.cell(hide_code=True)
def _(stochastic_formula):
    stochastic_formula
    return


@app.cell(hide_code=True)
def _(mo):
    stochastic_seed = mo.ui.number(start=0, stop=1000000, value=42, step=1, label="Random seed")
    stochastic_seed
    return (stochastic_seed,)


@app.cell(hide_code=True)
def _(mo):
    trajectory_count = mo.ui.slider(1, 30, value=5, step=1, label="Stochastic trajectories", show_value=True)
    trajectory_count
    return (trajectory_count,)


@app.cell(hide_code=True)
def _():
    import numpy as np


    def simulate_sir_binomial(s_initial, i_initial, r_initial, alpha, beta, steps, seed):
        if any(not np.isfinite(value) or value < 0 or int(value) != value
               for value in (s_initial, i_initial, r_initial)):
            raise ValueError("Use nonnegative integer initial populations.")
        if not all(0 <= probability <= 1 for probability in (alpha, beta)):
            raise ValueError("Infection and recovery probabilities must lie in [0, 1].")
        rng = np.random.default_rng(seed)
        S, I, R = int(s_initial), int(i_initial), int(r_initial)
        St, It, Rt = [S], [I], [R]
        infections, recoveries = [], []

        for _ in range(steps):
            p = 1 - (1 - beta) ** I
            new_infections = int(rng.binomial(S, p))
            new_recoveries = int(rng.binomial(I, alpha))

            delta_S = new_infections
            delta_I = new_infections - new_recoveries
            delta_R = new_recoveries
            S -= delta_S
            I += delta_I
            R += delta_R

            St.append(S)
            It.append(I)
            Rt.append(R)
            infections.append(new_infections)
            recoveries.append(new_recoveries)

        return St, It, Rt, infections, recoveries

    return (simulate_sir_binomial,)


@app.cell(hide_code=True)
def _(
    alpha,
    beta,
    generations,
    i0,
    mo,
    r0,
    s0,
    simulate_sir_binomial,
    stochastic_seed,
):
    mo.stop(any(int(value) != value or value < 0 for value in (s0, i0, r0)),
            mo.md("Use nonnegative integer initial populations for the stochastic model."))
    stochastic_S, stochastic_I, stochastic_R, infection_counts, recovery_counts = simulate_sir_binomial(
        s0, i0, r0, alpha, beta, generations.value, int(stochastic_seed.value))
    return stochastic_I, stochastic_R, stochastic_S


@app.cell(hide_code=True)
def _(
    alpha,
    beta,
    generations,
    i0,
    r0,
    s0,
    simulate_sir_binomial,
    stochastic_I,
    stochastic_R,
    stochastic_S,
    stochastic_seed,
    trajectory_count,
):
    sir_trajectories = [(stochastic_S, stochastic_I, stochastic_R)]
    for _index in range(1, trajectory_count.value):
        _path = simulate_sir_binomial(s0, i0, r0, alpha, beta,
            generations.value, int(stochastic_seed.value) + _index)
        sir_trajectories.append(_path[:3])
    return (sir_trajectories,)


@app.cell(hide_code=True)
def _(It, Rt, St, go, mo, plot_view, sir_trajectories, trajectory_count):
    _comparison = go.Figure()
    _opacity = max(0.15, min(0.8, 2 / trajectory_count.value**0.5))
    if plot_view.value == "Populations":
        for _compartment, (_mean, _name, _color) in enumerate([
            (St, "Susceptible S", "#636EFA"),
            (It, "Infectious I", "#EF553B"),
            (Rt, "Recovered R", "#00CC96"),
        ]):
            for _index, _path in enumerate(sir_trajectories):
                _series = _path[_compartment]
                _comparison.add_scatter(x=list(range(len(_series))), y=_series,
                    name=f"{_name} · stochastic", legendgroup=_name,
                    showlegend=_index == 0, mode="lines", line_shape="hv",
                    opacity=_opacity, line=dict(color=_color, width=1),
                    hovertemplate=f"{_name} · realization {_index+1}<br>Generation %{{x}}<br>Population %{{y}}<extra></extra>")
            _comparison.add_scatter(x=list(range(len(_mean))), y=_mean,
                name=f"{_name} · mean field", mode="lines",
                line=dict(color=_color, dash="dot", width=3))
        _comparison.update_layout(xaxis_title="Generation", yaxis_title="Population")
    else:
        for _index, _path in enumerate(sir_trajectories):
            _comparison.add_scatter(x=_path[0], y=_path[1], name="Stochastic",
                legendgroup="stochastic", showlegend=_index == 0, mode="lines",
                opacity=_opacity, line=dict(color="#636EFA", width=1))
        _comparison.add_scatter(x=St, y=It, name="Mean field", mode="lines",
            line=dict(color="#EF553B", dash="dot", width=3))
        _comparison.update_layout(xaxis_title="Susceptible S", yaxis_title="Infectious I")
    _comparison.update_layout(template="plotly_white", height=420,
        margin=dict(l=45, r=20, t=20, b=45))
    mo.vstack([
        mo.ui.plotly(_comparison),
        mo.md(f"Thin lines: **{trajectory_count.value} possible realizations** with the same parameters. Dotted: deterministic mean field, not a sample average or confidence interval. Increasing the count preserves existing paths; changing the seed produces a new set."),
    ])
    return


if __name__ == "__main__":
    app.run()
