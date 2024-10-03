---
id: CH2 - Sampling Statistics Continued
aliases: []
tags:
  - latex
  - standardDev
  - python
---

> How do we find the standard deviation of a sample?
> Why is it important to know the standard deviation of a sample?

## Standard Deviation of a Sample

The standard deviation of a sample is a measure of the amount of variation or dispersion of a set of values. It is calculated as the square root of the variance, which is the average of the squared differences from the mean.

Here's the formula for standard deviation (σ):
$$ \sigma = \sqrt{\frac{\sum\_{i=1}^{N} (x_i - \mu)^2}{N}} $$

Where:

- Σ is the sum of...
- (xi - μ)^2: the squared difference between each data point (xi) and the mean (μ)
- N is the number of data points in the sample

Knowing the standard deviation of a sample is important because it gives us an understanding of how spread out the values in our data are around the mean. A low standard deviation means that the values tend to be close to the mean, while a high standard deviation means that the values are spread out over a wider range.

It's a key concept in statistics and is used in many areas, including finance, physics, and machine learning, to name a few.

---

### Example

Let's consider a simple example with a sample of five values: 2, 4, 6, 8, 10.

First, we calculate the mean (μ):

$$ \mu = \frac{\sum\_{i=1}^{N} x_i}{N} = \frac{2 + 4 + 6 + 8 + 10}{5} = 6 $$

Next, we calculate the squared differences from the mean:

- (2 - 6)^2 = 16
- (4 - 6)^2 = 4
- (6 - 6)^2 = 0
- (8 - 6)^2 = 4
- (10 - 6)^2 = 16

Then, we calculate the average of these squared differences (this is the variance):

$$ \text{Variance} = \frac{\sum\_{i=1}^{N} (x_i - \mu)^2}{N} = \frac{16 + 4 + 0 + 4 + 16}{5} = 8 $$

Finally, we take the square root of the variance to get the standard deviation:

$$ \sigma = \sqrt{\text{Variance}} = \sqrt{8} \approx 2.83 $$

So, the standard deviation of our sample is approximately 2.83.

## Variance

Variance is a statistical measurement that describes the spread of data points in a data sample. It measures how far each number in the set is from the mean (average) and thus from every other number in the set. Variance is often denoted by the symbol σ².

Here's the formula for variance:

$$ \sigma^2 = \frac{\sum\_{i=1}^{N} (x_i - \mu)^2}{N} $$

Where:

- Σ is the sum of...
- (xi - μ)^2: the squared difference between each data point (xi) and the mean (μ)
- N is the number of data points in the sample

Variance is used to see how individual numbers relate to each other within a data set, rather than using broader mathematical techniques such as arranging data into quartiles. It's a key concept in many areas of statistics, including finance, physics, and machine learning.

### Example

Continuing with our previous example where we had a sample of five values: 2, 4, 6, 8, 10. We calculated the variance as:

$$ \text{Variance} = \frac{\sum\_{i=1}^{N} (x_i - \mu)^2}{N} = \frac{16 + 4 + 0 + 4 + 16}{5} = 8 $$

So, the variance of our sample is 8.

### Calculating Variance, Standard Deviation, and more using the TI 84 Calculator

In [[1 Variable Stats On Calculator]], I discuss how you can use the 1-Var Stats function on the TI-84 Plus CE to calculate the mean, sum of x, sum of x squared, sample standard deviation, population standard deviation, and more for a single-variable data set. This is a useful tool for quickly obtaining these statistics for your data.

---

## Python Program to Calculate and Graph Information

```python

	import micropip
	await micropip.install("numpy")
	await micropip.install("matplotlib")
	await micropip.install("scipy")

	from scipy.stats import trim_mean
	import numpy as np
	import matplotlib.pyplot as plt

	# Example data list
	lst = [12, 15, 14, 10, 18, 20, 24, 13, 17, 22]

	# Calculate one-var stats
	mean = np.mean(lst)
	sum_x = np.sum(lst)
	sum_x_squared = np.sum(np.square(lst))
	sample_std_dev = np.std(lst, ddof=1)
	population_std_dev = np.std(lst)
	n = len(lst)
	min_x = np.min(lst)
	q1 = np.percentile(lst, 25)
	median = np.median(lst)
	q3 = np.percentile(lst, 75)
	max_x = np.max(lst)

	# Calculate 20% trimmed mean
	trimmed_mean = trim_mean(lst, 0.2)

	# Print the stats
	print(f"Mean (x̄): {mean}")
	print(f"Sum of x (Σx): {sum_x}")
	print(f"Sum of x squared (Σx²): {sum_x_squared}")
	print(f"Sample Standard Deviation (Sx): {sample_std_dev}")
	print(f"Population Standard Deviation (σx): {population_std_dev}")
	print(f"Number of data points (n): {n}")
	print(f"Minimum value (minX): {min_x}")
	print(f"First Quartile (Q1): {q1}")
	print(f"Median (Med): {median}")
	print(f"Third Quartile (Q3): {q3}")
	print(f"Maximum value (maxX): {max_x}")
	print(f"20% Trimmed Mean: {trimmed_mean}")

	# Plotting the results
	plt.figure(figsize=(6, 4))

	# Boxplot
	plt.subplot(1, 2, 1)
	plt.boxplot(lst, vert=False)
	plt.title('Boxplot of Data')
	plt.xlabel('Value')

	# Histogram with mean and trimmed mean
	plt.subplot(1, 2, 2)
	plt.hist(lst, bins=8, edgecolor='black', alpha=0.7)
	plt.axvline(mean, color='r', linestyle='dashed', linewidth=2, label=f'Mean: {mean:.2f}')
	plt.axvline(trimmed_mean, color='g', linestyle='dashed', linewidth=2, label=f'Trimmed Mean: {trimmed_mean:.2f}')
	plt.title('Histogram of Data')
	plt.xlabel('Value')
	plt.ylabel('Frequency')
	plt.legend()

	plt.tight_layout()
	plt.show()

```
