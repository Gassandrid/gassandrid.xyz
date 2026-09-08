---
date: 2025-06-26
updated: 2026-09-08T11:03:55-04:00
tags:
  - math/linear-algebra
class:
  - note
source:
related:
author:
description:
aliases:
---

>[!Abstract] Definition
> The Null space of an $m-by-n$ matrix $A$ is the collection of those vectors in $\mathbb{R}^n$ that $A$ maps to the zero vector in $\mathbb{R}^m$. More precisely:
>
> $$
> \mathcal{N}(A)= \{ x \in \mathbb{R}^n \mid Ax = 0\}
> $$

As an example, let's examine the matrix $A$:

$$
A = \begin{pmatrix}
0 & 1 & 0 & 0 \\
-1 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$

From this we can find that the null space of the matrix is the following:

$$
\mathcal{N}(A) = \{ t \begin{pmatrix}
1 \\
0 \\
1 \\
0
\end{pmatrix} \mid t \in \mathbb{R} \}
$$

This is a line in $\mathbb{R}^4$

The null space answers the question of uniqueness of solutions to $Sx = f$. For, if $Sx=f$ and $Sy=f$ then $S(x-y)=Sx-Sy = f-f=0$ and so $(x-y)\in \mathcal{N}(S)$. Hence, a solution to $Sx = f$ will be unique if ,and only if, $\mathcal{N}S=\{ 0 \}$
