---
tags:
  - math
date: 2024-09-25
---
Curvature is a very intuitive concept.

If you have a straight line, does it have curvature? No, of course not.
Does a circle have a curvature? Yeah, it has some curvature.

It is our job to quantify how "much" curvature is in a given problem.

## Recalling [[Vectors]]

Lets have a look at a simple circle.

> [!example] Does a smaller circle have more curvature than a bigger one?
> Yes, it has more curvature, but why?

**Python Visual:**
```python
import micropip
await micropip.install("matplotlib")
await micropip.install("numpy")

import matplotlib.pyplot as plt
import numpy as np

# Create a figure and axis
fig, ax = plt.subplots()

# Define the center and radius of the larger circle
center_large = (0, 0)
radius_large = 1.5

# Define the center and radius of the smaller circle
center_small = (1, 0)  # Positioned to intersect the larger circle
radius_small = 0.5

# Draw the larger circle
large_circle = plt.Circle(center_large, radius_large, fill=False, color='blue', linewidth=2)
ax.add_patch(large_circle)

# Draw the smaller circle
small_circle = plt.Circle(center_small, radius_small, fill=False, color='red', linewidth=2)
ax.add_patch(small_circle)

# Label the circles
ax.text(center_large[0] - 0.8, center_large[1] + 1.7, 'some curvature', color='blue', fontsize=12)
ax.text(center_small[0] + 0.2, center_small[1] - 0.7, 'less curvature', color='red', fontsize=12)

# Set the limits of the plot
ax.set_xlim(-2, 3)
ax.set_ylim(-2, 2)

# Set aspect of the plot to be equal
ax.set_aspect('equal')

# Remove axes
ax.axis('off')

# Display the plot
plt.show()

```

So we know the smaller the circle, the more curvature it has. 

**Definition:** Curvature is a measure of how much the direction vector changes

## How does the derivative of a direction/tangent vector change?

Essentially, this is talking about the speed/velocity of the curve. But the thing is, the velocity at which we traverse the curve has no effect on the actual curvature itself. 

Lets examine an equation.

$$
curvature = K = \frac{dT}{ds}
$$

## Finding the curvature

To find the curvature, parametrize the unit tangent vector, which is 

$$T = \frac{r\prime(t)}{|r\prime(t)|}$$
Where we differentiate with respect to arc length

This yields something like 
$$ r\prime(s)$$
Which always equals 1, meaning `r'(s)` is _the_ unit tangent vector

## Curvature of a circle


> [!example] Find the curvature of a circle with radius R
> **Q:** how do you parameterize a circle?

**Answer:** use the following formula
$$ \vec{r} = \langle R \cos \theta, R \sin \theta \rangle $$
which becomes 

$$ \vec{r}(s) = \langle R \cos \frac{s}{R}, R \sin \frac{s}{R} \rangle $$

and thus

$$ \vec{r}' = \langle -\sin \frac{s}{R}, \cos \frac{s}{R} \rangle $$

and then second derivative

$$ \vec{r}'' = \langle -\frac{1}{R} \cos \frac{s}{R}, -\frac{1}{R} \sin \frac{s}{R} \rangle $$
and then finding the magnitude

$$ \left\| \vec{r}'' \right\| = \sqrt{\left( -\frac{1}{R} \cos \frac{s}{R} \right)^2 + \left( -\frac{1}{R} \sin \frac{s}{R} \right)^2} $$
which yields

$$ =\frac{1}{R}$$
