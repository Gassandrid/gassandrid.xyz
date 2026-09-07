---
class:
  - note
  - lecture
tags:
  - university
  - math/chaos/fractals
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 15
source:
related:
author:
description:
aliases:
date: 2026-03-19T10:11:09-04:00
updated: 2026-09-03T20:36:13-04:00
---

>[!Abstract] Theorem
> The middle thirds [[Cantor Set]] $K_{\infty}$ consists of all numbers in the interval $[0,1]$ that can be expressed in base 3 (ternary) using only the digits $0$ and $2$

Consider in base 3:

$$
r = 0.\overline{02}_{3} \in K_{\infty}
$$

how many copies of:

$$
\underbrace{ 3^0 \cdot 3^{-1} \cdot 3^{-2} \cdot 3^{-3} }_{ base \ 10 }
$$

$$
\begin{align*}
r &= \frac{2}{9} + \frac{2}{81} + \frac{2}{729} + \dots \\
&= \frac{2}{9}\left(1 + \frac{1}{9} + \frac{1}{81} + \dots\right) \\
&= \frac{2}{9} \cdot \frac{1}{1-\frac{1}{9}} = \frac{2}{9} \cdot \frac{9}{8} = \frac{1}{4}
\end{align*}
$$

What about $x=\frac{1}{3} = 0.1_{3} = 0.0\overline{2}_{3}$

---

>[!Example]
> The set of left endpoints of middle thirds [[Cantor Set]] intervals is countable

>[!Example]
> subset of $K_{\infty}$ with a finite number of repeartint ternary digits ( e.g., ending in $\overline{0}$)

| $\mathbb{N}$ | ternary # in $K_{\infty}$                          | $a_{ij}\in \{ 0,2 \}$ |
| ------------ | -------------------------------------------------- | --------------------- |
| 1            | $r_{1}=0.a_{11}a_{12}a_{13}\dots$                  |                       |
| 2            | $r_{2}=0.a_{21}a_{22}a_{23}\dots$                  |                       |
| 3            | $r_{3}=0.a_{31}a_{32}a_{33}\dots$                  |                       |
| ...          | ...                                                |                       |
| n            | $r_{n}= 0.a_{n_{1}}a_{n_{2}}a_{n_{3}}\dots a_{nn}$ |                       |

what is wrong with this? doesnt this have all items?

thanks to [[Cantor's diagonal argument]], this will never work, as given that it is irrational, we can always construct another $r$ not in the list.
