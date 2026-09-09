import marimo

__generated_with = "0.23.9"
app = marimo.App()


@app.cell
def _():
    import marimo as mo
    import numpy as np
    import plotly.graph_objects as go
    return go, mo, np


@app.cell
def _(mo):
    # Send the value on release when the computation is expensive.
    rate = mo.ui.slider(0.1, 2.0, step=0.1, value=0.5, debounce=True, label="Decay rate")
    rate
    return (rate,)


@app.cell
def _(np, rate):
    # Keep numerical work separate from presentation and appearance settings.
    t = np.linspace(0, 10, 400)
    population = np.exp(-rate.value * t)
    return population, t


@app.cell
def _(go, mo, population, t):
    _figure = go.Figure(go.Scatter(x=t, y=population, mode="lines", name="Population"))
    _figure.update_layout(xaxis_title="Time", yaxis_title="Population", height=360,
                          margin=dict(l=50, r=20, t=20, b=45))
    # The website plugin owns host colors; no plotly_white/dark template needed.
    chart = mo.ui.plotly(_figure)
    chart
    return (chart,)


if __name__ == "__main__":
    app.run()
