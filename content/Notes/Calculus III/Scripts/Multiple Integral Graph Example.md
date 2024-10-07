
## Abstract

## Code

```python
import micropip
await micropip.install("matplotlib")
await micropip.install("numpy")

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Define the limits of the rectangle R in the xy-plane
x_min, x_max = 0, 2  # Limits for x
y_min, y_max = 0, 3  # Limits for y

# Create a grid of points in the xy-plane (for R)
x = np.linspace(x_min, x_max, 30)
y = np.linspace(y_min, y_max, 30)
X, Y = np.meshgrid(x, y)

# Define a surface z = f(x, y), an arbitrary function for the example
Z = np.sin(X) * np.cos(Y)

# Plotting the surface and the rectangle
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Plot the surface S
ax.plot_surface(X, Y, Z, cmap='Blues', edgecolor='k', alpha=0.7)

# Highlight the rectangle R in the xy-plane (z = 0)
ax.plot([x_min, x_max, x_max, x_min, x_min],
        [y_min, y_min, y_max, y_max, y_min],
        [0, 0, 0, 0, 0], color='green', lw=3)

# Plot vertical lines from the surface to the xy-plane (z = 0)
for i in range(0, X.shape[0], 5):  # Plot every 5th line for clarity
    ax.plot([X[i, 0], X[i, 0]], [Y[i, 0], Y[i, 0]], [0, Z[i, 0]], 'k--', lw=1)
    ax.plot([X[i, -1], X[i, -1]], [Y[i, -1], Y[i, -1]], [0, Z[i, -1]], 'k--', lw=1)

# Labels and title
ax.set_xlabel('X axis')
ax.set_ylabel('Y axis')
ax.set_zlabel('Z axis')
ax.set_title('Double Integral Visualization Over a Rectangle R')

plt.show()

```