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
    parameters.values = {'s0': 990.0, 'i0': 10.0, 'r0': 0.0, 'alpha': 0.1, 'beta': 0.001}

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
    parameters
    return parameters, simulation_formula


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
def _(parameters, simulation_formula):
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
    return


if __name__ == "__main__":
    app.run()
