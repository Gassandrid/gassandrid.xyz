import marimo

__generated_with = "0.23.9"
app = marimo.App()

@app.cell
def _():
    import marimo as mo
    return (mo,)

@app.cell
def _(mo):
    choice = mo.ui.slider(0, 1, value=0, label="Note")
    choice
    return (choice,)

@app.cell
def _(mo, choice):
    target = "Conradi" if choice.value == 0 else "Local"
    mo.md(f"""
    ## Live output

    Value **{choice.value}**: [[{target}#Details|Selected note]]

    > [!tip]- **Reactive callout**
    > ==Value {choice.value}== and [[{target}]]

    ![[{target}#Details]]

    ![[{target}#^note-block]]

    Inline math $x^2$ and a note ^[Footnote text].

    `[[Code stays literal]]` %%hidden comment%%

    Paragraph ^local-block
    """)
    return (target,)

@app.cell
def _(mo):
    literal = "[[Conradi]]"
    mo.plain_text(literal)
    return (literal,)
