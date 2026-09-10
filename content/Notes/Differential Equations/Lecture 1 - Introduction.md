---
class:
  - note
  - lecture
source: https://tlakoba.w3.uvm.edu/26_fall/math_3230/Lectures/Lecture_1.pdf
lecture-number: 1
date: 2026-09-09T14:32:37-04:00
updated: 2026-09-09T14:41:33-04:00
---

## Differential equations and initial conditions

A first-order **ordinary differential equation** specifies a rate of change:

$$
y'(t)=f(t,y(t)).
$$

$t$ is the independent variable; $y$ is the dependent variable. A solution is a differentiable function satisfying the equation on an interval.

An **initial value problem (IVP)** adds a starting value:

$$
y'=f(t,y), \qquad y(t_0)=y_0.
$$

If the velocity depends only on time, $y'=v(t)$, direct integration gives

$$
\boxed{y(t)=y_0+\int_{t_0}^t v(s)\,ds.}
$$

$s$ is a dummy variable; $t$ is the endpoint. For constant velocity, $y(t)=y_0+v(t-t_0)$.

For continuous $f$, the general IVP can be written as

$$
y(t)=y_0+\int_{t_0}^t f(s,y(s))\,ds.
$$

This is an implicit relation: the unknown function still appears inside the integral.

## Exponential growth and decay

For constant $a$,

$$
y'=ay
\quad\Longrightarrow\quad
y=Ce^{at}.
$$

Differentiating verifies $(Ce^{at})'=aCe^{at}$. The initial condition determines $C$:

$$
\boxed{y(t)=y_0e^{a(t-t_0)}.}
$$

For example, $y(0)=3$ gives $y=3e^{at}$. For nonzero initial data, the magnitude grows when $a>0$ and decays when $a<0$.

| Model | Equation | Solution |
| --- | --- | --- |
| Radioactive decay, $a>0$ | $m'=-am$ | $m=m_0e^{-a(t-t_0)}$ |
| Cooling toward constant room temperature $T_r$, $k>0$ | $T'=-k(T-T_r)$ | $T=T_r+(T_0-T_r)e^{-k(t-t_0)}$ |
| Population growth with unlimited resources, $b>0$ | $n'=bn$ | $n=n_0e^{b(t-t_0)}$ |

## Order and time dependence

The **order** is the highest derivative present, regardless of its power:

$$
\begin{aligned}
y''=1 &\qquad \text{second order},\\
\sin(y')+\cos(y''')=0 &\qquad \text{third order},\\
(y'')^5+(y')^2+\ln y=0 &\qquad \text{second order}.
\end{aligned}
$$

An ODE involves derivatives with respect to one independent variable. A **partial differential equation** involves partial derivatives, such as $u_t$ and $u_{xx}$ for $u(x,t)$.

An **autonomous** equation has no explicit time dependence:

$$
y'=f(y), \qquad \text{e.g. }y'=y^2-\sin(e^y).
$$

A **non-autonomous** equation depends explicitly on time, such as $y'=y^2-t$.

## Direction fields and equilibria

The **direction field** assigns a slope $f(t,y)$ to each point $(t,y)$. Solution curves are tangent to these slopes. For an autonomous equation, the slope is constant along each horizontal line.

For $y'=\sin y$:

$$
\begin{aligned}
\sin y>0 &\quad\text{on }(2k\pi,(2k+1)\pi),\\
\sin y<0 &\quad\text{on }((2k-1)\pi,2k\pi),
\qquad k\in\mathbb Z.
\end{aligned}
$$

![[MATH3230-L1-direction-field.png|380]]

An **equilibrium** is a constant solution $y(t)=y_*$, so

$$
f(t,y_*)=0 \qquad\text{for every }t\text{ in the interval}.
$$

| Equation | Equilibria |
| --- | --- |
| $y'=\sin y$ | $y_*=k\pi$, $k\in\mathbb Z$ |
| $y'=t(y+1)$ | $y_*=-1$ |
| $y'=ty+1$ | None: no constant $y_*$ makes $ty_*+1=0$ for every $t$ |
| $y'=y^2+1$ | None over $\mathbb R$ |

For $y'=\sin y$, nearby solutions move toward odd multiples of $\pi$ and away from even multiples.

Next: [[Lecture 2 - Linear First-Order Differential Equations]]
