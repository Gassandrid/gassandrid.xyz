---
id: CH1 - Categorical Variable
aliases: 
tags:
  - chart
  - boxplot
  - python
date: 2024-09-12
---
# CH 1 Continued - Categorical Variables in Statistics

---

Continuing from the previous chapter, we will now look at how to represent categorical data in statistics with an example.

> [!example] **1000 ball bearings classified as:**
>
> - conforming (`910`)
> - too thick (`53`)
> - too thin (`37`)

Here, the data is classified into three categories, which are mutually exclusive and exhaustive. The data is categorical because it is classified into categories and not measured.

Lets make a table of counts for the data.

---

## Table of Counts

| Classification | frequency | f/n - relative frequency proportion |
| -------------- | --------- | ----------------------------------- |
| Conforming     | 910       | .910                                |
| too thick      | 53        | .053                                |
| too thin       | 37        | .037                                |

---

## Bar Chart with MatPlotLib

```python
import micropip
await micropip.install("matplotlib")
import matplotlib.pyplot as plt

# Data
labels = ['Conforming', 'Too Thick', 'Too Thin']
values = [0.910, 0.053, 0.037]

# Create the bar chart
plt.figure(figsize=(6, 4))
plt.bar(labels, values, color=['green', 'red', 'blue'])

# Add title and labels
plt.title('Bar Chart of Measurements')
plt.xlabel('Measurement Type')
plt.ylabel('Proportion')

# Show the values on top of the bars
for i, value in enumerate(values):
    plt.text(i, value + 0.01, f'{value:.3f}', ha='center', va='bottom')

# Display the chart
plt.show()
```

This will create a bar chart with the proportion of each category, where the height of the bar represents the proportion of the category.

---

## Variable Statistics and Boxplots

Now, lets look at another example

> [!example] **Chromium VS Nickel Simple Dataset**  
> **Chromium**: `31, 1, 511, 2, 574, 496, 322, 424, 269, 140, 244, 252, 76, 108, 24, 38, 18, 43, 30, 191`
>
> **Nickel**: `23, 22, 55, 39, 283, 34, 159, 37, 61, 34, 163, 140, 32, 23, 54, 837, 64, 354, 376, 471`

We are going to find:

- Mean
- Median
- Standard Deviation
- Quartiles

Lets find these with python.

```python
import micropip
await micropip.install("numpy")
await micropip.install("scipy")
await micropip.install("matplotlib")

import numpy as np
import matplotlib.pyplot as plt
import scipy as stats

# Data
chromium = [31, 1, 511, 2, 574, 496, 322, 424, 269, 140, 244, 252, 76, 108, 24, 38, 18, 43, 30, 191]
nickel = [23, 22, 55, 39, 283, 34, 159, 37, 61, 34, 163, 140, 32, 23, 54, 837, 64, 354, 376, 471]

# Mean
mean_chromium = np.mean(chromium)
mean_nickel = np.mean(nickel)

# standard deviation
std_chromium = np.std(chromium)
std_nickel = np.std(nickel)

# Median
median_chromium = np.median(chromium)
median_nickel = np.median(nickel)

# Quartiles
first_quartile_chromium = np.percentile(chromium, 25)
second_quartile_chromium = np.percentile(chromium, 50)
third_quartile_chromium = np.percentile(chromium, 75)
fourth_quartile_chromium = np.percentile(chromium, 100)

firsst_quartile_nickel = np.percentile(nickel, 25)
second_quartile_nickel = np.percentile(nickel, 50)
third_quartile_nickel = np.percentile(nickel, 75)
fourth_quartile_nickel = np.percentile(nickel, 100)

# print the results as f string
print(f"Chromium Mean: {mean_chromium}, Median: {median_chromium}, Standard Deviation: {std_chromium}")
print(f"Chromium Quartiles: {first_quartile_chromium}, {second_quartile_chromium}, {third_quartile_chromium}, {fourth_quartile_chromium}")

print(f"Nickel Mean: {mean_nickel}, Median: {median_nickel}, Standard Deviation: {std_nickel}")
print(f"Nickel Quartiles: {firsst_quartile_nickel}, {second_quartile_nickel}, {third_quartile_nickel}, {fourth_quartile_nickel}")

```

This yield the 1-Variable Statistics we would normally get from a Ti-84 Graphing Calculator.

And now let's plot it as a box plot:

```python
# Boxplot
plt.figure(figsize=(6, 4))
plt.boxplot([chromium, nickel], labels=['Chromium', 'Nickel'])
plt.title('Boxplot of Chromium and Nickel')

# Display the chart
plt.show()
```
