# Critical Points in Calculus 3

> [!info] **Overview**  
Critical points occur where the gradient of a function is zero or undefined. They help identify maxima, minima, and saddle points in multivariable functions.

## Gradient and Critical Points

The **gradient** of a multivariable function $f(x, y, z)$ is a vector:

$$
\nabla f(x, y, z) = \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right)
$$

### Finding Critical Points
To find the critical points, solve:

$$
\nabla f(x, y, z) = \mathbf{0}
$$

or where it is undefined.

---

> [!warning] **Note**  
Ensure you check both where the gradient equals zero and where it is undefined, as these can also be critical points.

## Second Derivative Test for Multivariable Functions

To classify critical points, we use the **Hessian matrix**, which is the matrix of second-order partial derivatives:

$$
H = 
\begin{bmatrix}
    \frac{\partial^2 f}{\partial x^2} & \frac{\partial^2 f}{\partial x \partial y} & \frac{\partial^2 f}{\partial x \partial z} \\
    \frac{\partial^2 f}{\partial y \partial x} & \frac{\partial^2 f}{\partial y^2} & \frac{\partial^2 f}{\partial y \partial z} \\
    \frac{\partial^2 f}{\partial z \partial x} & \frac{\partial^2 f}{\partial z \partial y} & \frac{\partial^2 f}{\partial z^2}
\end{bmatrix}
$$

### Eigenvalues of the Hessian
1. If all eigenvalues are **positive**, the point is a **local minimum**.
2. If all eigenvalues are **negative**, the point is a **local maximum**.
3. If the eigenvalues have **mixed signs**, the point is a **saddle point**.

---

> [!tip] **Tip**  
For functions of two variables $ f(x, y$ $ the Hessian simplifies to:

$$
H = 
\begin{bmatrix}
    f_{xx} & f_{xy} \\
    f_{yx} & f_{yy}
\end{bmatrix}
$$

With the **discriminant** $D = f_{xx} f_{yy} - (f_{xy})^2$:
- $D > 0$ and $f_{xx} > 0$: local minimum.
- $D > 0$ and $f_{xx} < 0$: local maximum.
- $D < 0$: saddle point.
- $D = 0$: test is inconclusive.

## Lagrange Multipliers

To find critical points subject to a constraint $g(x, y, z = 0$ use **Lagrange multipliers**:

$$
\nabla f = \lambda \nabla g
$$

where $\lambda$ is a scalar (the Lagrange multiplier). Solve the system of equations formed by:

$$
\nabla f - \lambda \nabla g = 0
$$
and the constraint $g(x, y, z) = 0$.

---

> [!summary] **Summary**
- Find critical points by setting $\nabla f = \mathbf{0}$.
- Use the Hessian matrix and eigenvalues (or discriminant for two variables) to classify critical points.
- Apply Lagrange multipliers for constrained optimization problems.
