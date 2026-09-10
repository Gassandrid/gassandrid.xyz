---
class:
  - note
source:
  - https://tlakoba.w3.uvm.edu/26_fall/math_3230/homework.html
  - https://tlakoba.w3.uvm.edu/26_fall/math_3230/HW_sec1pt2.pdf
  - https://tlakoba.w3.uvm.edu/26_fall/math_3230/HW_sec1pt3.pdf
---

[[Quiz 1 Practice]] · [[Lecture 1 - Introduction]] · [[Homework 2 - Linear First-Order Equations|Homework 2]]

Assigned order from the course website. Problem statements are condensed from the textbook scans; numbering and mathematical data are retained.

## Section 1.2

### 5

Find every constant $k$ for which $y=e^{kt}$ satisfies $y'+2y=0$.

### 7

Find every constant $k$ for which $y=e^{k\cos 2t}$ satisfies $y'+(\sin 2t)y=0$.

### 8

Find every constant $k$ for which $y=ke^{-t}$ satisfies $y'+y=0$.

### 9

Verify $y=Ce^{t^2}$ solves $y'-2ty=0$ for arbitrary $C$. Then impose $y(1)=2$.

### 13

For $t>0$, find every $c$ such that $y=c/t$ solves $y'+y^2=0$.

### 14

Given $y=-e^{-t}+\sin t$, recover $g(t)$ and $y_0$ in

$$
y'+y=g(t),\qquad y(0)=y_0.
$$

### 21

The solution of $y'=m+1$, $y(1)=y_0$ is the line shown. Determine the integer $m$, $y_0$, and $y(t)$.

![[MATH3230-HW1-1.2.21.png|320]]

### 23

An object is released from rest at height $y_0>0$. With constant gravitational acceleration $g>0$, derive the impact time and impact velocity in terms of $y_0,g$.

> [!hint]- Instructor hint
> Start with $y''=-g$, determine both initial conditions, and integrate twice as in Lecture 1. Count the arbitrary constants before imposing initial data. Impact occurs when $y(t)=0$.

### 3

Determine the order:

$$
(y')^3+t^5\sin y=y^4.
$$

### 10

Solve $y'''=2$ by successive antiderivatives. State its order and count the arbitrary constants.

## Section 1.3

For **5, 1, 2, 4**, determine whether the equation is autonomous, find all equilibria, and sketch its direction field on $-2\le t\le2$, $-2\le y\le2$.

### 5

$$
y'=-1.
$$

### 1

$$
y'=-y+1.
$$

Additionally sketch the solution through $y(0)=1/3$.

### 2

$$
y'=t-1.
$$

### 4

$$
y'=y^2-y.
$$

Additionally sketch the solution through $y(0)=1/3$.

> [!hint]- Instructor guidance for 1 and 4
> The original HW 1 instructions ask for Mathematica `DSolve` to obtain the two IVP curves, then a check against the direction fields. For #4, locate the equilibria first. For hand practice at the Quiz 1 cutoff, sketch the nonlinear trajectory qualitatively; separation of variables is introduced later. #1 can now be solved by Lecture 2's constant-shift method.

### 10

Construct an autonomous DE with equilibria $y=0,2$, positive slope for $0<y<2$, and negative slope for $y<0$ or $y>2$.

> [!info]- Sources and answer checks
> [Assignment and instructor hints](https://tlakoba.w3.uvm.edu/26_fall/math_3230/homework.html), checked September 9, 2026.
>
> Textbook: Kohler and Johnson, *Elementary Differential Equations*, 2nd ed., §§1.2–1.3. Local scans: [[MATH3230-HW-sec1.2.pdf]], [[MATH3230-HW-sec1.3.pdf]].
>
> Posted answers: [[MATH3230-HW-answers-sec1.2-1.3.pdf]]. Additional even-numbered answers appear on the assignment webpage.
