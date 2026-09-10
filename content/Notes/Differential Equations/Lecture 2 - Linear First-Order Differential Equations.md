---
class:
  - note
  - lecture
source: https://tlakoba.w3.uvm.edu/26_fall/math_3230/Lectures/Lecture_2.pdf
lecture-number: 2
date: 2026-09-09T14:35:20-04:00
updated: 2026-09-09T14:44:30-04:00
---

## Linear first-order equations

A first-order equation is **linear** if it can be written

$$
\boxed{y'+p(t)y=g(t).}
$$

It is **homogeneous** when $g\equiv0$ and **nonhomogeneous** otherwise.

| Equation | Classification |
| --- | --- |
| $y'=ty^2$ | Nonlinear |
| $y'=t^2y$ | Linear, homogeneous |
| $(y')^2=ty$ | Nonlinear |
| $(\cos t)y'+e^t y=\sin t$ | Linear, nonhomogeneous |

The last equation has standard form

$$
y'+\frac{e^t}{\cos t}y=\tan t
$$

on intervals where $\cos t\ne0$.

## Homogeneous solution

Let $P'(t)=p(t)$. Since

$$
\left(e^{-P(t)}\right)'=-p(t)e^{-P(t)},
$$

the homogeneous equation has solutions

$$
\boxed{y_h(t)=Ce^{-P(t)}.}
$$

These are all the solutions: multiplying $y'+py=0$ by $e^P$ gives $(e^Py)'=0$, hence $e^Py=C$.

## Integrating factor

For continuous $p,g$ on an interval, multiply by the **integrating factor** $\mu=e^P$:

$$
\begin{aligned}
y'+py&=g,\\
e^Py'+pe^Py&=e^Pg,\\
(e^Py)'&=e^Pg.
\end{aligned}
$$

Thus

$$
\boxed{y(t)=e^{-P(t)}\left(C+\int e^{P(t)}g(t)\,dt\right),}
$$

where the integral denotes one antiderivative and $C$ supplies the arbitrary constant.

For $y(t_0)=y_0$, choose

$$
P(t)=\int_{t_0}^t p(s)\,ds.
$$

Then $P(t_0)=0$, and integrating $(e^Py)'$ from $t_0$ to $t$ gives

$$
\boxed{y(t)=e^{-P(t)}\left[y_0+\int_{t_0}^t e^{P(s)}g(s)\,ds\right].}
$$

The outer factor depends on $t$; the integrand depends on $s$. They cannot be cancelled.

### Example

$$
y'-\frac{2t}{1+t^2}y=2t, \qquad y(1)=3.
$$

The general solution, using $P=-\ln(1+t^2)$, is

$$
y=(1+t^2)\left[C+\ln(1+t^2)\right].
$$

For the IVP, normalize at $t_0=1$:

$$
\begin{aligned}
P(t)&=\int_1^t\frac{-2s}{1+s^2}\,ds
=\ln2-\ln(1+t^2),\\
e^{P(t)}&=\frac{2}{1+t^2},\\
\int_1^t e^{P(s)}g(s)\,ds
&=\int_1^t\frac{4s}{1+s^2}\,ds
=2\ln\frac{1+t^2}{2}.
\end{aligned}
$$

Therefore

$$
\boxed{y(t)=\frac{1+t^2}{2}\left[3+2\ln\frac{1+t^2}{2}\right].}
$$

At $t=1$, the logarithm vanishes and $y(1)=3$.

## Variation of parameter

Start with the nonzero homogeneous solution $y_h=e^{-P(t)}$ and allow its coefficient to vary:

$$
y=C(t)y_h(t).
$$

Substitution gives

$$
\begin{aligned}
y'+py
&=C'y_h+C(y_h'+py_h)\\
&=C'y_h=g.
\end{aligned}
$$

Hence

$$
C'=\frac{g}{y_h}=e^Pg,
\qquad
y=e^{-P}\left(C_0+\int e^Pg\,dt\right).
$$

This recovers the integrating-factor formula. The same idea extends to linear systems.

## Special cases and long-term behavior

For the homogeneous IVP,

$$
y(t)=y_0\exp\left(-\int_{t_0}^t p(s)\,ds\right).
$$

Zero initial data gives $y\equiv0$. Nonzero solutions keep their sign, and

$$
\frac{d}{dt}\ln|y|=-p(t).
$$

Thus $p>0$ decreases the magnitude and $p<0$ increases it. For $y_0\ne0$, the limits depend on the accumulated integral:

$$
\begin{aligned}
\int_{t_0}^t p(s)\,ds\to+\infty
&\quad\Longrightarrow\quad y(t)\to0,\\
\int_{t_0}^t p(s)\,ds\to-\infty
&\quad\Longrightarrow\quad |y(t)|\to\infty.
\end{aligned}
$$

The sign alone does not determine the limit. For example, $p(t)=e^{-t}$ with $t_0=0$ gives

$$
y(t)=y_0e^{e^{-t}-1}\longrightarrow y_0/e.
$$

### Constant coefficient

$$
y'=ay, \qquad y(t_0)=y_0
\quad\Longrightarrow\quad
\boxed{y(t)=y_0e^{a(t-t_0)}.}
$$

### Power law

On $t>0$,

$$
y'-\frac at y=0,
\qquad P=-a\ln t
\quad\Longrightarrow\quad
\boxed{y=Ct^a.}
$$

### Constant forcing

For $y'=ay+b$ with $a\ne0$, the equilibrium is $y_*=-b/a$. Set $z=y-y_*$:

$$
z'=az
\quad\Longrightarrow\quad
\boxed{y(t)=y_*+(y_0-y_*)e^{a(t-t_0)}.}
$$

If $a<0$, every solution converges to $y_*$. If $a>0$, every non-equilibrium solution moves away from it. If $a=0$, $y=y_0+b(t-t_0)$.

## Piecewise coefficients

If $p$ or $g$ changes formula at $t=c$, solve the linear IVP on each interval and match the value of $y$ at the switch:

$$
y_c=\lim_{t\to c^-}y(t),\qquad y(c)=y_c.
$$

Use this as the initial condition for the second interval. The solution is continuous; its derivative may jump. At a derivative jump, the DE holds on each open piece rather than as a classical equation at the switch.

For example, if $y'+y=g(t)$, $y(0)=y_0$, and $g=g_1$ before $c>0$, $g=g_2$ afterward, with $g_1,g_2$ constant, then

$$
y(t)=\begin{cases}
g_1+(y_0-g_1)e^{-t},&0\le t<c,\\
g_2+(y_c-g_2)e^{-(t-c)},&t\ge c,
\end{cases}
\qquad y_c=g_1+(y_0-g_1)e^{-c}.
$$

Previous: [[Lecture 1 - Introduction]] · Next: [[Lecture 3 - General Properties of First-Order Linear Differential Equations]]
