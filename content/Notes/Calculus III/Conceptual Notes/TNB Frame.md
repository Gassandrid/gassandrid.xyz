---
date: 2024-09-20
tags:
  - math
---

The TNB frame, also known as the **Frenet-Serret frame**, is a coordinate system associated with a point on a space curve. It consists of three mutually perpendicular vectors:
1. **Tangent vector (T)**
2. **Normal vector (N)**
3. **Binormal vector (B)**

This frame moves along the curve, providing insight into the curve’s geometry in 3D space.

---

### 1. **Tangent Vector  $\mathbf{T}$ **

The tangent vector at a point on the curve represents the direction of the curve at that point. It is the unit vector in the direction of the velocity vector.

$$\mathbf{T}(t) = \frac{\mathbf{r}'(t)}{|\mathbf{r}'(t)|}
$$
where $\mathbf{r}(t)$ is the vector-valued function describing the curve, and $\mathbf{r}'(t)$ is its derivative (velocity vector).

### 2. **Normal Vector  $\mathbf{N}$ **

The normal vector points in the direction of the curve's instantaneous acceleration, perpendicular to the tangent vector. It indicates how the curve is bending.

$$\mathbf{N}(t) = \frac{\mathbf{T}'(t)}{|\mathbf{T}'(t)|}
$$
- The normal vector is obtained by differentiating the tangent vector and normalizing it.
- It points towards the **center of curvature** of the curve.

### 3. **Binormal Vector  $\mathbf{B}$**

The binormal vector is perpendicular to both the tangent and normal vectors. It completes the right-handed coordinate system and indicates the direction in which the curve is twisting out of the plane formed by \( \mathbf{T} \) and \( \mathbf{N} \).

$$\mathbf{B}(t) = \mathbf{T}(t) \times \mathbf{N}(t)
$$
- It is the cross product of the tangent and normal vectors.
- \( \mathbf{B}(t) \) is orthogonal to both \( \mathbf{T}(t) \) and \( \mathbf{N}(t) \).

### 4. **Curvature and Torsion**

- **Curvature (\( \kappa \))**: Measures how fast the curve is changing direction (bending). It is related to the normal component of the acceleration.
  $$\kappa = \left| \frac{d\mathbf{T}}{ds} \right|$$
- **Torsion $\tau$ **: Measures how fast the curve is twisting out of the plane defined by $\mathbf{T}$ and $\mathbf{N}$.

$$  \tau = -\frac{d\mathbf{B}}{ds}
$$
### 5. **Frenet-Serret Formulas**

The TNB frame obeys a set of differential equations known as the Frenet-Serret formulas, which describe how the TNB vectors change as you move along the curve:

$$\frac{d\mathbf{T}}{ds} = \kappa \mathbf{N}
$$
$$\frac{d\mathbf{N}}{ds} = -\kappa \mathbf{T} + \tau \mathbf{B}
$$
$$\frac{d\mathbf{B}}{ds} = -\tau \mathbf{N}
$$
Where:
- \( s \) is the arc length.
- \( \kappa \) is the curvature.
- \( \tau \) is the torsion.

### 6. **Geometric Interpretation**

- The **tangent vector** $$$ \mathbf{T}$$  tells you the direction of the curve.
- The **normal vector** \( \mathbf{N} \) tells you how the curve bends.
- The **binormal vector** \( \mathbf{B} \) tells you how the curve twists.

Together, these vectors form an orthonormal basis that fully describes the local geometry of the curve at any point.

### 7. **Example: Helix**

For a 3D helix given by \( \mathbf{r}(t) = \langle a\cos(t), a\sin(t), bt \rangle \), the TNB frame can be computed as follows:
- Tangent vector \( \mathbf{T}(t) \): Direction of motion along the helix.
- Normal vector \( \mathbf{N}(t) \): Points toward the center of the helix.
- Binormal vector \( \mathbf{B}(t) \): Points along the axis of the helix, perpendicular to the plane formed by \( \mathbf{T}(t) \) and \( \mathbf{N}(t) \).

### 8. **Applications of the TNB Frame**

- **Physics**: Describing the motion of particles along curved paths.
- **Robotics**: Path planning for robotic arms or autonomous vehicles.
- **Computer Graphics**: Modeling curves and surfaces in 3D space.
- **Engineering**: Analyzing stresses in curved beams or surfaces.

---

### References
- Stewart, James. *Calculus: Early Transcendentals*. (For further exploration of the TNB frame)
- [Frenet-Serret Equations - Wolfram MathWorld](https://mathworld.wolfram.com/Frenet-SerretFormulas.html)