---
id: Unstable Manifold
aliases:
  - Unstable Manifolds
  - Unstable Direction
tags:
  - university
  - math/chaos
class:
  - note
course: "[[Chaos, Fractals, and Dynamical Systems]]"
date: 2026-02-05T10:32:28-05:00
description: concept in dynamical systems describing points that converge to a saddle fixed point under backward iteration
related:
  - "[[Stable Manifold]]"
  - "[[Saddle fixed point]]"
  - "[[Linearization and the Jacobian]]"
  - "[[Sinks, Sources, and Saddles]]"
updated: 2026-02-05T10:35:50-05:00
---
The **unstable manifold** of a [[Saddle fixed point|saddle]] fixed point is the set of points that converge to the fixed point under backward iteration. It's the direction of expansion.

For a linear map with a [[Saddle fixed point|saddle]] at the origin, the unstable manifold is the subspace spanned by eigenvectors with $|\lambda| > 1$.

---

## Linear

Consider the diagonal linear map:

$$
A = \begin{bmatrix}
2 & 0 \\
0 & \frac{1}{2}
\end{bmatrix}
$$

Eigenvalues: $\lambda_1 = 2$, $\lambda_2 = \frac{1}{2}$

Eigenvectors: $\vec{v}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$, $\vec{v}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$

The **x-axis** is the unstable manifold. Points on the x-axis satisfy:

$$
\vec{x}_n = A^n \vec{x}_0 = \begin{bmatrix}
x_0 \cdot 2^n \\
0
\end{bmatrix} \to \infty
$$

As $n \to \infty$, points on the x-axis diverge from the origin because $2^n \to \infty$.

But under **backward iteration**, points on the x-axis converge to the origin:

$$
\vec{x}_{-n} = A^{-n} \vec{x}_0 = \begin{bmatrix}
x_0 \cdot \left(\frac{1}{2}\right)^n \\
0
\end{bmatrix} \to \begin{bmatrix} 0 \\ 0 \end{bmatrix}
$$

---

## Geometric

The unstable manifold represents the set of initial conditions that "came from" the fixed point. If you start on the unstable manifold and iterate backward, you approach the fixed point.

Near a saddle, the unstable manifold looks like the eigenvector direction associated with the expanding eigenvalue.

For [[Saddle fixed point|saddles]] in $\mathbb{R}^2$:

- The unstable manifold is typically a curve (1-dimensional)
- Points on the manifold diverge from the fixed point under forward iteration
- The unstable manifold acts as a "source direction" from the saddle

---

## Nonlinear

For nonlinear maps, the unstable manifold is generally **curved** (not a straight line). But near the fixed point, it's tangent to the unstable eigenvector direction.

The [[Stable Manifold Theorem]] also guarantees that smooth unstable manifolds exist for hyperbolic fixed points, and they're tangent to the unstable eigenspace at the fixed point.

---

- **[[Stable Manifold]]**: converges to the fixed point under **forward** iteration ($n \to \infty$)
- **Unstable manifold**: converges to the fixed point under **backward** iteration ($n \to -\infty$)

The unstable manifold expands under forward iteration while the stable manifold contracts.

---

- form the "outflow" from saddle points
- for chaotic systems unstable manifolds of different saddles can intersect stable manifolds (creating [[Homoclinic Orbit|homoclinic]] and [[Heteroclinic Orbit|heteroclinic]] tangles)
- intersections are the geometric signature of chaos


----

## [[09-08-2026]] Update

Paper [@churchlandPreparatoryActivityExpansive2024] shows that