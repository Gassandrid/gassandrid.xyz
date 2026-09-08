# description: Shape an eigenvalue creature by editing a matrix and its torus-sampled entries.
# static-preview: true
# /// script
# requires-python = ">=3.14"
# dependencies = [
#     "marimo==0.23.9",
#     "numpy==2.3.5",
# ]
# ///

import marimo

__generated_with = "0.23.9"
app = marimo.App(width="full", app_title="Eigenfish")


@app.cell(hide_code=True)
def _():
    import base64
    import os
    import struct
    import zlib

    import marimo as mo
    import numpy as np

    return base64, mo, np, os, struct, zlib


@app.cell(hide_code=True)
def _():
    PRESETS = {
        "Conradi": {
            "matrix": [
                [-2, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 0, 1],
                [2, 0, 0, 1, 0, 2],
                [0, 0, 0, -2, -2, 2],
                [-2, 1, 0, 0, -2, 1],
                [-2, 1, 0, 0, 0, -2],
            ],
            "mask": [
                [0, 0, 1, 0, 0, 1],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
            ],
        },
        "Sparse": {
            "matrix": [
                [0, 2, 0, 0, -2],
                [-2, 0, 1, 0, 0],
                [0, -1, 0, 2, 0],
                [0, 0, -2, 0, 1],
                [2, 0, 0, -1, 0],
            ],
            "mask": [
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
        },
        "Border": {
            "matrix": [
                [0, 1, 0, 1],
                [2, 0, 2, 0],
                [0, 1, 0, 1],
                [2, 0, 2, 0],
            ],
            "mask": [
                [0, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 1, 0],
            ],
        },
    }
    PALETTES = {
        "Ink": ((245, 241, 235), (45, 37, 32)),
        "Rust": ((245, 241, 235), (191, 97, 89)),
        "Pine": ((245, 241, 235), (86, 112, 107)),
    }
    return PALETTES, PRESETS


@app.cell(hide_code=True)
def _(base64, np, struct, zlib):
    def decode_matrix(encoded):
        encoded = np.asarray(encoded, dtype=int)
        matrix = np.zeros(encoded.shape, dtype=np.complex128)
        matrix[encoded == -2] = -1j
        matrix[encoded == -1] = -1
        matrix[encoded == 1] = 1
        matrix[encoded == 2] = 1j
        return matrix

    def eigenfish_torus(base, variable_mask, samples, radius):
        rows, cols = np.nonzero(variable_mask)
        if len(rows) == 0:
            return np.array([], dtype=np.complex128)
        rng = np.random.default_rng(7)
        phases = radius * np.exp(
            1j * rng.uniform(0, 2 * np.pi, size=(samples, len(rows)))
        )
        matrices = np.broadcast_to(base, (samples, *base.shape)).copy()
        matrices[:, rows, cols] = phases
        return np.linalg.eigvals(matrices).reshape(-1)

    def density_png(eigenvalues, background, foreground, size=820):
        coordinates = np.concatenate([eigenvalues.real, eigenvalues.imag])
        limit = max(float(np.quantile(np.abs(coordinates), 0.997)), 1e-6) * 1.06
        x = ((eigenvalues.real + limit) / (2 * limit) * (size - 1)).astype(int)
        y = ((eigenvalues.imag + limit) / (2 * limit) * (size - 1)).astype(int)
        inside = (x >= 0) & (x < size) & (y >= 0) & (y < size)

        density = np.zeros((size, size), dtype=np.float32)
        np.add.at(density, (size - 1 - y[inside], x[inside]), 1)
        glow = density.copy()
        for shift_y, shift_x, weight in (
            (-1, 0, 0.50),
            (1, 0, 0.50),
            (0, -1, 0.50),
            (0, 1, 0.50),
            (-1, -1, 0.22),
            (-1, 1, 0.22),
            (1, -1, 0.22),
            (1, 1, 0.22),
        ):
            glow += weight * np.roll(density, (shift_y, shift_x), axis=(0, 1))

        tone = np.log1p(glow)
        nonzero = tone[tone > 0]
        exposure = float(np.quantile(nonzero, 0.997)) if len(nonzero) else 1.0
        tone = np.clip(tone / max(exposure, 1e-6), 0, 1) ** 0.72
        bg = np.asarray(background, dtype=np.float32)
        fg = np.asarray(foreground, dtype=np.float32)
        pixels = np.rint(bg + tone[..., None] * (fg - bg)).astype(np.uint8)

        def chunk(kind, data):
            return (
                struct.pack(">I", len(data))
                + kind
                + data
                + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)
            )

        scanlines = b"".join(b"\x00" + row.tobytes() for row in pixels)
        png = (
            b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(scanlines, 9))
            + chunk(b"IEND", b"")
        )
        return "data:image/png;base64," + base64.b64encode(png).decode("ascii")

    return decode_matrix, density_png, eigenfish_torus


@app.cell(hide_code=True)
def _(PALETTES, PRESETS, mo):
    preset = mo.ui.dropdown(
        options=list(PRESETS), value="Conradi", label="Structure"
    )
    samples = mo.ui.slider(
        start=2000,
        stop=30000,
        step=2000,
        value=12000,
        debounce=True,
        show_value=True,
        label="Samples",
    )
    radius = mo.ui.slider(
        start=0.25,
        stop=2.0,
        step=0.05,
        value=1.0,
        debounce=True,
        show_value=True,
        label="Torus radius",
    )
    palette = mo.ui.dropdown(options=list(PALETTES), value="Ink", label="Ink")

    mo.vstack(
        [
            mo.md(r"""
            A small matrix becomes a creature when selected entries move around a
            complex torus. Inspired by [[Simone Conradi]].
            """),
            mo.hstack(
                [preset, samples, radius, palette],
                widths="equal",
                gap=1,
            ),
        ],
        gap=1.2,
    )
    return palette, preset, radius, samples


@app.cell(hide_code=True)
def _(PRESETS, mo, preset):
    selected = PRESETS[preset.value]
    dimension = len(selected["matrix"])
    labels = [str(index + 1) for index in range(dimension)]
    matrix_editor = mo.ui.matrix(
        selected["matrix"],
        min_value=-2,
        max_value=2,
        step=1,
        precision=0,
        row_labels=labels,
        column_labels=labels,
        debounce=True,
        label="Matrix",
    )
    mask_editor = mo.ui.matrix(
        selected["mask"],
        min_value=0,
        max_value=1,
        step=1,
        precision=0,
        row_labels=labels,
        column_labels=labels,
        debounce=True,
        label="Variable entries",
    )

    mo.vstack(
        [
            mo.md("## Shape the matrix"),
            mo.md("Drag or press Enter to edit. Matrix codes: `−2 = −i`, `−1`, `0`, `1`, `2 = i`. Set the same position to `1` in the variable mask to sample it from the torus."),
            mo.hstack([matrix_editor, mask_editor], widths="equal", gap=1.5),
        ],
        gap=0.75,
    )
    return mask_editor, matrix_editor


@app.cell(hide_code=True)
def _(
    decode_matrix,
    eigenfish_torus,
    mask_editor,
    matrix_editor,
    np,
    os,
    radius,
    samples,
):
    base_matrix = decode_matrix(matrix_editor.value)
    variable_mask = np.asarray(mask_editor.value, dtype=float) >= 0.5
    effective_samples = (
        min(samples.value, 2000)
        if os.environ.get("EWAN_MARIMO_STATIC_PREVIEW") == "1"
        else samples.value
    )
    eigenvalues = eigenfish_torus(
        base_matrix,
        variable_mask,
        effective_samples,
        radius.value,
    )
    return eigenvalues, variable_mask


@app.cell(hide_code=True)
def _(PALETTES, density_png, eigenvalues, mo, palette, variable_mask):
    variable_count = int(variable_mask.sum())
    if len(eigenvalues) == 0:
        artwork = mo.callout(
            mo.md("Select at least one position in the variable mask."),
            kind="warn",
        )
    else:
        background, foreground = PALETTES[palette.value]
        source = density_png(eigenvalues, background, foreground)
        artwork = mo.Html(
            f"""
            <figure class="eigenfish-figure">
              <img src="{source}" alt="Eigenvalue density generated from the edited complex matrix" />
              <figcaption>{len(eigenvalues):,} eigenvalues · {variable_count} torus-sampled entries</figcaption>
            </figure>
            """
        )
    artwork
    return


if __name__ == "__main__":
    app.run()
