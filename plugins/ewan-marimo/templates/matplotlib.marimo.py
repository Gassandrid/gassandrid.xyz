import marimo

__generated_with = "0.23.9"
app = marimo.App()


@app.cell
def _():
    import marimo as mo
    import matplotlib.pyplot as plt
    import numpy as np
    return mo, np, plt


@app.cell
def _(mo):
    rate = mo.ui.slider(0.1, 2.0, step=0.1, value=0.5, debounce=True, label="Decay rate")
    rate
    return (rate,)


@app.cell
def _(np, rate):
    t = np.linspace(0, 10, 400)
    population = np.exp(-rate.value * t)
    return population, t


@app.cell
def _(plt):
    # A reusable figure factory. Theme changes need only redraw the figure,
    # not recompute its data. rc_context avoids changing other notebook plots.
    def decay_figure(x, y, theme="light"):
        palettes = {
            "light": {"paper": "#f5f1eb", "ink": "#4a4238", "line": "#56706b"},
            "dark": {"paper": "#1a1714", "ink": "#d4cec7", "line": "#a3b6b2"},
        }
        colors = palettes[theme]
        with plt.rc_context({
            "figure.facecolor": colors["paper"], "axes.facecolor": colors["paper"],
            "text.color": colors["ink"], "axes.labelcolor": colors["ink"],
            "axes.edgecolor": colors["ink"], "xtick.color": colors["ink"],
            "ytick.color": colors["ink"], "font.size": 11,
        }):
            figure, axis = plt.subplots(figsize=(7, 3.5), layout="constrained")
            axis.plot(x, y, color=colors["line"])
            axis.set(xlabel="Time", ylabel="Population")
            axis.spines[["top", "right"]].set_visible(False)
        plt.close(figure)
        return figure
    return (decay_figure,)


@app.cell
def _(decay_figure, population, t):
    # Static images retain their authored palette when Quartz toggles theme.
    # Pass theme="dark" for a dark export; no duplicate background render.
    decay_figure(t, population)
    return


if __name__ == "__main__":
    app.run()
