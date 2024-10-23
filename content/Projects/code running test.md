also seems to break syntax highlighter, though should be an easy fix

```python
print("hello world")
```


matplotlib test m

```python
import matplotlib.pyplot as plt
import numpy as np

# Define the function f(x) and its derivative f'(x)
def f(x):
    return np.sin(x)  # Example of a function with a local max and min

def df(x):
    return np.cos(x)  # Derivative of sin(x)

# Create x values
x_vals = np.linspace(0, 2 * np.pi, 500)

# Points of local max and min (pi/2 and 3pi/2 for sin(x))
x_max = np.pi / 2
x_min = 3 * np.pi / 2
y_max = f(x_max)
y_min = f(x_min)

# Tangent lines at local max and min
tangent_max_x = np.linspace(x_max - 1, x_max + 1, 100)
tangent_max_y = df(x_max) * (tangent_max_x - x_max) + y_max

tangent_min_x = np.linspace(x_min - 1, x_min + 1, 100)
tangent_min_y = df(x_min) * (tangent_min_x - x_min) + y_min

# Create plot
plt.figure(figsize=(6, 6))
plt.plot(x_vals, f(x_vals), label=r'$f(x) = \sin(x)$', color='black')

# Plot points of local max and min
plt.scatter([x_max, x_min], [y_max, y_min], color='black', zorder=5)

# Plot tangent lines
plt.plot(tangent_max_x, tangent_max_y, color='red', linestyle='-', linewidth=2)
plt.plot(tangent_min_x, tangent_min_y, color='red', linestyle='-', linewidth=2)

# Add labels and title
plt.text(x_max + 0.1, y_max + 0.01, 'Local Max', fontsize=12)
plt.text(x_min + 0.1, y_min - 0.3, 'Local Min', fontsize=12)
plt.title(r'Demonstration of Local Max and Min of $f(x) = \sin(x)$')

# Add axes
plt.axhline(0, color='black',linewidth=0.5)
plt.axvline(0, color='black',linewidth=0.5)

# Show plot
plt.show()
```