---
class:
  - note
source:
  - https://tlakoba.w3.uvm.edu/26_fall/math_3230/index.html
  - https://tlakoba.w3.uvm.edu/26_fall/math_3230/homework.html
---

**Friday, September 11, 2026 — Lectures 1 and 2.** Confirmed on the [course page](https://tlakoba.w3.uvm.edu/26_fall/math_3230/index.html), checked September 9.

[[Homework 1 - Introduction and Direction Fields|Homework 1]] · [[Homework 2 - Linear First-Order Equations|Homework 2]]

Original practice problems modeled on the assigned homework, not a prediction of the quiz. Work each problem before opening its solution. Problems **21–22** are mixed checks; **19–20** cover Lecture 2's assigned piecewise reading.

> [!note]- Methods available
> [[Lecture 1 - Introduction]]: differentiate to verify; recover coefficients/forcing from a known function; direct and successive integration; autonomous equations, direction fields, and equilibria.
>
> [[Lecture 2 - Linear First-Order Differential Equations]]: standard linear form; homogeneous exponential/power-law solutions; integrating factor; variation of parameter; constant shift to equilibrium. Its assigned pp. 25–26 add solving and matching on successive intervals. HW 2 also assigns the linear-drag model on pp. 78–79.
>
> Use product/chain rules, the fundamental theorem of calculus, substitution, and exponential/logarithm algebra. No separation of variables, general superposition theorem, Euler method, Laplace transforms, or nonlinear stability derivative test is needed here.

> [!abstract]- Formula check
> $$
> y'=v(t)\quad\Longrightarrow\quad y(t)=y_0+\int_{t_0}^t v(s)\,ds.
> $$
>
> $$
> P(t)=\int_{t_0}^t p(s)\,ds,\qquad
> y'+py=g\quad\Longrightarrow\quad
> y(t)=e^{-P(t)}\left[y_0+\int_{t_0}^t e^{P(s)}g(s)\,ds\right].
> $$
>
> Variation of parameter: $y=C(t)e^{-P(t)}$ gives $C'=e^Pg$.
>
> $$
> y'=ay+b,\quad a\ne0:\qquad
> y_*=-b/a,\qquad y(t)=y_*+(y_0-y_*)e^{a(t-t_0)}.
> $$
>
> For $t>0$, $y'=(a/t)y$ gives $y=Ct^a$.

## 1. Classification

Classify each as linear or nonlinear. For linear equations, give $p(t),g(t)$ and homogeneous/nonhomogeneous status.

$$
\begin{aligned}
\text{(a)}\;&(1+t^2)y'+2ty=\cos t,\\
\text{(b)}\;&yy'+y=t,\\
\text{(c)}\;&e^ty'+t^2y=0,\\
\text{(d)}\;&\frac{y'}y=t+\frac1y\quad(y\ne0).
\end{aligned}
$$

Also give the order of $(y'')^3+\sin(y')=t$.

> [!success]- Solution
> (a) Divide by $1+t^2$:
>
> $$
> p=\frac{2t}{1+t^2},\qquad g=\frac{\cos t}{1+t^2}.
> $$
>
> Linear, nonhomogeneous.
>
> (b) Nonlinear: $y$ multiplies $y'$. For $y\ne0$, $y'=t/y-1$ still has nonlinear dependence on $y$.
>
> (c) Divide by $e^t$: $p=t^2e^{-t}$, $g=0$. Linear, homogeneous.
>
> (d) Multiply by $y$: $y'-ty=1$. Linear, nonhomogeneous on the original domain $y\ne0$; $p=-t$, $g=1$. Do not discard the domain restriction.
>
> The last equation is **second order**; the cube does not change the derivative order.

## 2. Verify a proposed solution

Find $k$ so that $y=e^{k\sin3t}$ solves $y'-6(\cos3t)y=0$. Then find $C$ so that $y=Ce^{k\sin3t}$ satisfies $y(\pi/6)=5$.

> [!success]- Solution
> Differentiate by the chain rule:
>
> $$
> y'=3k\cos3t\,e^{k\sin3t}.
> $$
>
> The residual is $(3k-6)\cos3t\,e^{k\sin3t}$, which vanishes identically only for $k=2$. At $t=\pi/6$, $\sin3t=1$, so $Ce^2=5$.
>
> $$
> \boxed{C=5e^{-2},\qquad y(t)=5e^{2(\sin3t-1)}.}
> $$
>
> This is verification by substitution; no nonlinear solution technique is needed.

## 3. Recover the equation

The function $y=2e^{-3t}+\cos t$ solves $y'+3y=g(t)$, $y(0)=y_0$. Find $g,y_0$.

> [!success]- Solution
> $$
> y'=-6e^{-3t}-\sin t,
> $$
>
> so
>
> $$
> \boxed{g(t)=y'+3y=3\cos t-\sin t,\qquad y_0=3.}
> $$

## 4. Successive integration

Solve $y'''=6$ with $y(0)=1$, $y'(0)=-2$, $y''(0)=0$. How many constants occur in the general solution?

> [!success]- Solution
> Integrate successively:
>
> $$
> \begin{aligned}
> y''&=6t+C_1,\\
> y'&=3t^2+C_1t+C_2,\\
> y&=t^3+\frac{C_1}{2}t^2+C_2t+C_3.
> \end{aligned}
> $$
>
> There are three constants. The data give $C_1=0$, $C_2=-2$, $C_3=1$:
>
> $$
> \boxed{y=t^3-2t+1.}
> $$

## 5. Direction field

For $y'=y(3-y)$, determine whether it is autonomous, find the equilibria, make a slope-sign table, and sketch the trajectory through $y(0)=1$. Do not solve the nonlinear equation explicitly.

> [!success]- Solution
> Autonomous; equilibria at $y=0,3$.
>
> | Region | $y'$ | Motion as $t$ increases |
> | --- | --- | --- |
> | $y<0$ | $-$ | Down |
> | $0<y<3$ | $+$ | Up |
> | $y>3$ | $-$ | Down |
>
> For a field sketch, repeat the same slopes along each horizontal line. Example slopes: $f(-1)=-4$, $f(1)=2$, $f(2)=2$, $f(4)=-4$.
>
> The trajectory through $(0,1)$ rises toward $y=3$ and flattens there. The field points toward $3$ from either side and away from $0$. This uses slopes and equilibria, without separation of variables.

## 6. Equilibrium or zero slope?

Find all constant solutions of (a) $y'=t(y+2)$ and (b) $y'=ty+2$. Then construct an autonomous equation with equilibria $-1,2$ whose slopes are positive between them and negative outside.

> [!success]- Solution
> (a) $y=-2$ makes the right-hand side zero for every $t$.
>
> (b) No constant works for every $t$. The curve $y=-2/t$ has zero field slope at its points, but its derivative is $2/t^2\ne0$; it is not an equilibrium solution.
>
> One construction is
>
> $$
> \boxed{y'=(y+1)(2-y).}
> $$
>
> Its roots and factor signs give exactly the requested behavior.

## 7. Homogeneous IVPs

Solve (a) $y'=-3y$, $y(2)=-4$; (b) $ty'-3y=0$, $y(2)=4$, $t>0$; (c) $y'+(1+t^2)y=0$, $y(0)=0$.

> [!success]- Solution
> (a) Use the exponential form from Lecture 2:
>
> $$
> \boxed{y=-4e^{-3(t-2)}.}
> $$
>
> The value increases toward zero; its magnitude decreases.
>
> (b) $y'=(3/t)y$, so use the power-law form $y=Ct^3$. Since $8C=4$,
>
> $$
> \boxed{y=\frac12t^3,\qquad t>0.}
> $$
>
> (c) $P=t+t^3/3$ and $y=Ce^{-P}$. At zero, $C=0$, so $\boxed{y\equiv0}$.

## 8. Integrating factor with a nonzero initial time

Solve

$$
y'-\frac{2t}{1+t^2}y=4t,\qquad y(1)=2.
$$

Use an integrating factor normalized at $t_0=1$.

> [!success]- Solution
> $$
> P(t)=\int_1^t\frac{-2s}{1+s^2}\,ds=\ln\frac{2}{1+t^2},
> \qquad e^P=\frac2{1+t^2}.
> $$
>
> Then
>
> $$
> \begin{aligned}
> y(t)&=\frac{1+t^2}{2}\left[2+\int_1^t\frac{8s}{1+s^2}\,ds\right]\\
> &=\boxed{\frac{1+t^2}{2}\left[2+4\ln\frac{1+t^2}{2}\right]}.
> \end{aligned}
> $$
>
> The logarithm vanishes at $t=1$, giving $y(1)=2$. Differentiating the final expression gives $y'-2ty/(1+t^2)=4t$.

## 9. Variation of parameter

Solve $2y'+4y=e^t$, $y(0)=1$ by variation of parameter.

> [!success]- Solution
> First divide by $2$: $y'+2y=\tfrac12e^t$. A nonzero homogeneous solution is $e^{-2t}$. Set $y=C(t)e^{-2t}$:
>
> $$
> C'e^{-2t}=\frac12e^t
> \quad\Longrightarrow\quad
> C'=\frac12e^{3t}
> \quad\Longrightarrow\quad
> C=\frac16e^{3t}+K.
> $$
>
> Hence $y=\tfrac16e^t+Ke^{-2t}$. The initial condition gives $K=5/6$:
>
> $$
> \boxed{y=\frac16e^t+\frac56e^{-2t}.}
> $$

## 10. Normalize before integrating

Find the general solution of $ty'+2y=t^3$ on $t>0$, then impose $y(1)=0$.

> [!success]- Solution
> $$
> y'+\frac2t y=t^2,\qquad P=2\ln t,\qquad \mu=t^2.
> $$
>
> Thus
>
> $$
> (t^2y)'=t^4
> \quad\Longrightarrow\quad
> t^2y=\frac{t^5}{5}+C.
> $$
>
> The general solution is $y=t^3/5+C/t^2$. Since $C=-1/5$,
>
> $$
> \boxed{y=\frac{t^3-t^{-2}}5,\qquad t>0.}
> $$

## 11. A forcing matched to the coefficient

Solve $y'+2ty=6t$, $y(0)=-1$, and find its limit as $t\to\infty$.

> [!success]- Solution
> Here $P=t^2$ and the integrating-factor integral is
>
> $$
> \int_0^t6s e^{s^2}\,ds=3(e^{t^2}-1).
> $$
>
> Therefore
>
> $$
> y=e^{-t^2}\left[-1+3(e^{t^2}-1)\right]
> =\boxed{3-4e^{-t^2}}.
> $$
>
> The limit is $3$. The substitution is $u=s^2$, $du=2s\,ds$.

## 12. Read the coefficient from a curve

A solution of $ty'-\alpha y=0$ on $t>0$ passes through $(1,2)$ and $(3,18)$. Find $\alpha$ and $y(t)$.

> [!success]- Solution
> The power-law form gives $y=Ct^\alpha$. At $t=1$, $C=2$. At $t=3$,
>
> $$
> 18=2\cdot3^\alpha
> \quad\Longrightarrow\quad
> 3^\alpha=9.
> $$
>
> Thus $\boxed{\alpha=2,\ y=2t^2}$.

## 13. Match qualitative behavior

All four solutions start at $y(0)=2$. Match each equation to its behavior: exponential decay; periodic variation; exponential growth; increasing with recurring horizontal tangents.

$$
\begin{aligned}
\text{(a)}\;&y'+2y=0,\\
\text{(b)}\;&y'+(\cos t)y=0,\\
\text{(c)}\;&y'-(1-\cos t)y=0,\\
\text{(d)}\;&y'-y=0.
\end{aligned}
$$

> [!success]- Solution
> Use $y=2\exp(-\int_0^t p(s)\,ds)$:
>
> | Equation | Solution | Behavior |
> | --- | --- | --- |
> | (a) | $2e^{-2t}$ | Exponential decay |
> | (b) | $2e^{-\sin t}$ | Periodic variation |
> | (c) | $2e^{t-\sin t}$ | Increasing, horizontal tangents at $t=2\pi n$ |
> | (d) | $2e^t$ | Exponential growth |
>
> For (c), $y'=(1-\cos t)y\ge0$. The slope vanishes at isolated times, so the curve has repeated flattening without decreasing.

## 14. Long-term behavior

Solve and find the limit:

$$
y'+(1+\cos t)y=2(1+\cos t),\qquad y(0)=5.
$$

> [!success]- Solution
> $$
> P=t+\sin t,\qquad
> \int_0^t2(1+\cos s)e^{s+\sin s}\,ds
> =2(e^{t+\sin t}-1).
> $$
>
> So
>
> $$
> \boxed{y=2+3e^{-t-\sin t}}.
> $$
>
> Since $\sin t$ stays bounded, $t+\sin t\to\infty$ and $y\to2$.

## 15. What controls the limit?

(a) A nonconstant solution satisfies $y'+\lambda y=4$. For which real $\lambda$ does it have a finite limit as $t\to\infty$?

(b) Does $p(t)>0$ alone force every solution of $y'+p(t)y=0$ to tend to zero? Test $p(t)=e^{-t}$, $y(0)=2$.

> [!success]- Solution
> (a) If $\lambda\ne0$, the equilibrium shift gives
>
> $$
> y=\frac4\lambda+Ce^{-\lambda t},\qquad C\ne0.
> $$
>
> For $\lambda>0$, the limit is $4/\lambda$. For $\lambda<0$, the nonconstant exponential term is unbounded. For $\lambda=0$, $y=4t+C$, also unbounded. Thus $\boxed{\lambda>0}$ is necessary and sufficient here.
>
> (b)
>
> $$
> P(t)=\int_0^t e^{-s}\,ds=1-e^{-t},
> \qquad y(t)=2e^{e^{-t}-1}\longrightarrow\boxed{2/e}.
> $$
>
> Positive $p$ decreases the magnitude. Decay to zero requires the accumulated integral to diverge to $+\infty$ for nonzero initial data.

## 16. Approach to equilibrium

Solve $y'=-2y+12$, $y(1)=3$. Find the equilibrium and the first time $t\ge1$ when $y$ has completed 90% of the change from its initial value toward equilibrium.

> [!success]- Solution
> The equilibrium is $y_*=6$. Set $z=y-6$, giving $z'=-2z$, $z(1)=-3$:
>
> $$
> \boxed{y=6-3e^{-2(t-1)}}.
> $$
>
> After 90% of the change, the remaining gap is $0.1(6-3)=0.3$:
>
> $$
> 3e^{-2(t-1)}=0.3
> \quad\Longrightarrow\quad
> \boxed{t=1+\frac{\ln10}{2}}.
> $$

## 17. Cooling

(a) A metal sample has temperature $T(t)=18+72e^{-t/5}$ in degrees Celsius. Under Newton's cooling law, find its initial temperature, room temperature, and rate constant.

(b) Another sample starts at $80^\circ\mathrm C$ in a $20^\circ\mathrm C$ room and cools to $50^\circ\mathrm C$ in 10 min. Derive its temperature using the equilibrium shift. When does it reach $35^\circ\mathrm C$?

> [!success]- Solution
> (a) $T(0)=90^\circ\mathrm C$, the room is $18^\circ\mathrm C$, and $k=1/5$ per time unit.
>
> (b) $T'=-k(T-20)$. Set $z=T-20$:
>
> $$
> z'=-kz,\qquad z(0)=60,
> \qquad T=20+60e^{-kt}.
> $$
>
> At 10 min, $30=60e^{-10k}$, so $k=\ln2/10$ per minute. Thus
>
> $$
> \boxed{T(t)=20+60\,2^{-t/10}}.
> $$
>
> At $35^\circ\mathrm C$, the excess temperature is $15=60/4$, so $\boxed{t=20\text{ min}}$ from the start.

## 18. Free fall followed by linear drag

Use upward-positive velocity and $g=10\,\mathrm{m/s^2}$. A body is released from rest; after 3 s, a parachute opens. After opening, $v'=-10-2v$. Find the velocity at opening and 2 s after opening. Derive the second phase by shifting to equilibrium.

> [!success]- Solution
> Before opening, $v'=-10$, $v(0)=0$, so $v=-10t$. At opening, $v=-30\,\mathrm{m/s}$ (speed $30\,\mathrm{m/s}$).
>
> Reset time to $\tau=0$ at opening. The equilibrium velocity is $v_*=-5$. Set $z=v+5$:
>
> $$
> z'=-2z,\qquad z(0)=-25,
> \qquad v(\tau)=-5-25e^{-2\tau}.
> $$
>
> Two seconds later,
>
> $$
> \boxed{v(2)=-5-25e^{-4}\,\mathrm{m/s}}.
> $$
>
> The velocity moves upward toward $-5$ while the body continues downward; its speed decreases.

## 19. Piecewise forcing

Find a continuous solution on $[0,2]$:

$$
y'+y=g(t),\qquad y(0)=0,\qquad
g(t)=\begin{cases}2,&0\le t<1,\\0,&1\le t\le2.\end{cases}
$$

Must the derivative be continuous at $t=1$?

> [!success]- Solution
> On $0\le t<1$, shift to equilibrium $2$:
>
> $$
> y=2-2e^{-t}.
> $$
>
> The matching value is $y(1)=2(1-e^{-1})$. On the second interval solve $y'+y=0$ with that initial value:
>
> $$
> \boxed{y(t)=\begin{cases}
> 2(1-e^{-t}),&0\le t<1,\\
> 2(1-e^{-1})e^{-(t-1)},&1\le t\le2.
> \end{cases}}
> $$
>
> The one-sided derivatives are $2e^{-1}$ and $-2(1-e^{-1})$, so there is a corner. The function is continuous and solves the DE on each open piece; it has no two-sided derivative at the switch.

## 20. Piecewise coefficient-matched forcing

Find a continuous solution on $[0,2\pi]$:

$$
y'+(\sin t)y=g(t),\quad y(0)=2,\qquad
g(t)=\begin{cases}
\sin t,&0\le t\le\pi,\\
-\sin t,&\pi<t\le2\pi.
\end{cases}
$$

> [!success]- Solution
> On the first interval, $P(t)=1-\cos t$. The integral of $e^P\sin t$ is $e^P$, so
>
> $$
> y=1+e^{\cos t-1},\qquad y(\pi)=1+e^{-2}.
> $$
>
> For the second interval, normalize at $\pi$:
>
> $$
> P_2(t)=\int_\pi^t\sin s\,ds=-\cos t-1,
> $$
>
> and
>
> $$
> \int_\pi^t-e^{P_2(s)}\sin s\,ds=1-e^{P_2(t)}.
> $$
>
> Thus
>
> $$
> \boxed{y(t)=\begin{cases}
> 1+e^{\cos t-1},&0\le t\le\pi,\\
> -1+(2+e^{-2})e^{\cos t+1},&\pi<t\le2\pi.
> \end{cases}}
> $$
>
> Both pieces give $1+e^{-2}$ at $\pi$. Here both one-sided derivatives are zero because $\sin\pi=0$; a piecewise definition does not necessarily create a corner.

## 21. Mixed check A

Without looking up a method, solve

$$
(1+t^2)y'+2ty=2t,\qquad y(0)=3.
$$

Give the equilibrium, limit, and whether the solution increases or decreases for $t>0$.

> [!success]- Solution
> Normalize, then use $P=\ln(1+t^2)$ and $\mu=1+t^2$:
>
> $$
> \bigl((1+t^2)y\bigr)'=2t
> \quad\Longrightarrow\quad
> (1+t^2)y=t^2+C.
> $$
>
> $C=3$, so
>
> $$
> \boxed{y=1+\frac2{1+t^2}}.
> $$
>
> The equilibrium is $1$, and $y\to1$. Since $y'=-4t/(1+t^2)^2<0$ for $t>0$, it decreases.

## 22. Mixed check B

Solve $y'+2y=e^{-t}$, $y(1)=0$, by variation of parameter. Check both the equation and the initial condition.

> [!success]- Solution
> Set $y=C(t)e^{-2t}$. Substitution gives $C'e^{-2t}=e^{-t}$, so $C'=e^t$ and $C=e^t+K$.
>
> Thus $y=e^{-t}+Ke^{-2t}$. At $t=1$, $K=-e$:
>
> $$
> \boxed{y=e^{-t}-e^{1-2t}}.
> $$
>
> Verification:
>
> $$
> y'+2y=(-e^{-t}+2e^{1-2t})+2(e^{-t}-e^{1-2t})=e^{-t},
> $$
>
> and $y(1)=e^{-1}-e^{-1}=0$.

> [!info]- Scope and source map
> The [Quiz 1 announcement](https://tlakoba.w3.uvm.edu/26_fall/math_3230/index.html) explicitly names Lectures 1–2. The matching regular assignments are HW 1–2; the [homework page](https://tlakoba.w3.uvm.edu/26_fall/math_3230/homework.html) preserves the instructor's intended order and special instructions. The [syllabus](https://tlakoba.w3.uvm.edu/26_fall/math_3230/syllabus_26F_3230.pdf) says quizzes draw on homework assigned at least one day earlier; the website does not establish the exact in-class completion date of every topic.
>
> | Practice | Homework models |
> | --- | --- |
> | 1 | 1.2.3; 2.1.1, 3, 5, 6, 9 |
> | 2–3 | 1.2.5, 7, 8, 9, 13, 14 |
> | 4 | 1.2.10, 23 |
> | 5–6 | 1.3.5, 1, 2, 4, 10 |
> | 7–11 | 2.2.1, 3, 4, 7, 11, 14, 20, 21 |
> | 12–15 | 2.2.25, 27, 28, 36, 37, 39 |
> | 16–18 | 2.2.29(c); 2.3.19, 21; 2.9.18(a,b) |
> | 19–20 | 2.2.41 and assigned pp. 25–26 |
> | 21–22 | Mixed linear-IVP practice |
>
> Reviewed: [Lecture 1](https://tlakoba.w3.uvm.edu/26_fall/math_3230/Lectures/Lecture_1.pdf), [direction-field supplement](https://tlakoba.w3.uvm.edu/26_fall/math_3230/Lectures/Lecture_1_Ex4.pdf), [Lecture 2](https://tlakoba.w3.uvm.edu/26_fall/math_3230/Lectures/Lecture_2.pdf), linked homework scans and answer sheets, [piecewise reading](https://tlakoba.w3.uvm.edu/26_fall/math_3230/HW_sec2pt2_pp2526.pdf), [linear-drag reading](https://tlakoba.w3.uvm.edu/26_fall/math_3230/HW_sec2pt9.pdf), [background sheet](https://tlakoba.w3.uvm.edu/26_fall/math_3230/background.pdf), and [homework approach](https://tlakoba.w3.uvm.edu/common_files/HowToApproachHomeworkProblems.html).
>
> The linked [Test 1 preparation sheet](https://tlakoba.w3.uvm.edu/26_fall/math_3230/prep_test1.pdf) concerns a later assessment and does not narrow Quiz 1. Its calculator/formula-sheet rules are not assumed to apply to this quiz. Lecture 3 and later methods, and the separately labeled extra-credit tasks, are not used in this set.
