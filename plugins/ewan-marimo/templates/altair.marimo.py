import marimo

__generated_with = "0.23.9"
app = marimo.App()


@app.cell
def _():
    import altair as alt
    import marimo as mo
    import numpy as np
    import pandas as pd
    return alt, mo, np, pd


@app.cell
def _(mo):
    rate = mo.ui.slider(0.1, 2.0, step=0.1, value=0.5, debounce=True, label="Decay rate")
    rate
    return (rate,)


@app.cell
def _(np, pd, rate):
    _t = np.linspace(0, 10, 400)
    samples = pd.DataFrame({"time": _t, "population": np.exp(-rate.value * _t)})
    return (samples,)


@app.cell
def _(alt, mo, samples):
    _figure = alt.Chart(samples).mark_line().encode(
        x="time:Q", y="population:Q", tooltip=["time:Q", "population:Q"]
    ).properties(height=300)
    # Vega owns rendering and follows the host theme. Precompute derived data
    # in Python so reactive selection does not require a VegaFusion transform.
    chart = mo.ui.altair_chart(_figure)
    chart
    return (chart,)


@app.cell
def _(chart):
    # Use the selected dataframe in dependent analysis cells.
    chart.value
    return


if __name__ == "__main__":
    app.run()
