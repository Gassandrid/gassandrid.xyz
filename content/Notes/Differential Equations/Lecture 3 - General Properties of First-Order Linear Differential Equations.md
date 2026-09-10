---
class:
  - note
  - lecture
source: https://tlakoba.w3.uvm.edu/26_fall/math_3230/Lectures/Lecture_3.pdf
lecture-number: 3
---

## Existence and uniqueness

If $p,g$ are continuous on an open interval $I$ containing $t_0$, then

$$
y'+p(t)y=g(t), \qquad y(t_0)=y_0
$$

has exactly one solution on all of $I$.

**Existence.** Set $P(t)=\int_{t_0}^t p(s)\,ds$. The integrating-factor formula gives

$$
y(t)=e^{-P(t)}\left[y_0+\int_{t_0}^t e^{P(s)}g(s)\,ds\right].
$$

Continuity of $p,g$ makes this expression differentiable. The product rule and fundamental theorem of calculus give $y'=-py+g$, and evaluation at $t_0$ gives $y(t_0)=y_0$.

**Uniqueness.** If $y_1,y_2$ solve the same IVP, their difference $w=y_1-y_2$ satisfies

$$
w'+pw=0, \qquad w(t_0)=0.
$$

Therefore

$$
w(t)=w(t_0)e^{-P(t)}=0,
$$

so $y_1=y_2$ throughout $I$.

More generally, solutions with different initial values satisfy

$$
y_1(t)-y_2(t)
=\bigl[y_1(t_0)-y_2(t_0)\bigr]e^{-P(t)}.
$$

Since $e^{-P(t)}>0$, distinct solution curves cannot intersect on $I$.

## Singular coefficients and solution intervals

Continuity of the coefficients is a sufficient condition for the theorem. If it fails, examine the equation and its domain directly.

For

$$
y'=\frac yt, \qquad y(-2)=3,
$$

the solution is $y=-3t/2$ on $(-\infty,0)$. Its formula extends smoothly through zero, but the differential equation is undefined there.

For

$$
y'=-\frac yt, \qquad y(-2)=3,
$$

the solution is $y=-6/t$ on $(-\infty,0)$, and diverges as $t\to0^-$.

A formula extending past a singularity does not make it a solution at a point where the equation is undefined.

## Superposition

Define the linear operator

$$
L[y]=y'+p(t)y.
$$

For constants $c_1,c_2$,

$$
L[c_1y_1+c_2y_2]=c_1L[y_1]+c_2L[y_2].
$$

If $L[y_1]=L[y_2]=0$, then every linear combination $c_1y_1+c_2y_2$ is another homogeneous solution.

If $L[y_p]=g$ and $L[y_h]=0$, then

$$
L[y_p+Cy_h]=g.
$$

Conversely, any solution $y$ of $L[y]=g$ differs from $y_p$ by a homogeneous solution. Choosing a **nonzero** homogeneous solution $y_h$ therefore gives the general solution

$$
\boxed{y=y_p+Cy_h.}
$$

The homogeneous solution space is one-dimensional; the nonhomogeneous solution set is a translate of that space.

For two solutions of the same nonhomogeneous equation,

$$
L[y_1+y_2]=2g, \qquad L[y_1-y_2]=0.
$$

Their sum solves the original equation only if $g\equiv0$. Their difference always solves the homogeneous equation.

### Example

$$
y'=y-t+1.
$$

A particular solution is $y_p=t$, since $1=t-t+1$. The homogeneous equation $y_h'=y_h$ has the nonzero solution $e^t$, so

$$
\boxed{y=t+Ce^t.}
$$

## Why linearity matters

For the nonlinear equation

$$
y'=y^2-t^2+1,
$$

$y_p=t$ is a solution, and $z=-1/t$ solves $z'=z^2$ on intervals avoiding zero. Their combination $y=t-c/t$ gives

$$
\begin{aligned}
y'&=1+\frac{c}{t^2},\\
y^2-t^2+1&=1-2c+\frac{c^2}{t^2}.
\end{aligned}
$$

Equality on an interval would require

$$
2ct^2+c-c^2=0
$$

for every $t$, which forces $c=0$. Superposition does not hold in general for nonlinear equations.

Previous: [[Lecture 2 - Linear First-Order Differential Equations]]
