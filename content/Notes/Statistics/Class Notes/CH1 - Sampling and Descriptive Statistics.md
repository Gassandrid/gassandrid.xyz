---
id: CH1 - Sampling and Descriptive Statistics
aliases: 
tags:
  - sampling
  - data
  - latex
  - statistics
date: 2024-09-12
---
# CH1 - Sampling and Descriptive Statistics

> How do we get data?
> How do we describe data?

## 1.1 sampling

**[[Population]]:** the entire collection of objects or outcomes about which information is sought

**[[Sample]]:** a subset of the population containing the objects or outcomes that are actually _observed_

### Idea

We want to know something about the population. We collect a sample that is representative of the population. We take the measurements/outcomes from the sample to infer/say something about the population.

It is very important to have a representative sample.

Our best tool to get a representative sample is SIMPLE RANDOM SAMPLE(SRS).

An SRS of size "n" is a sample chosen by a method in which each collection of n population items is equally likely to occur.

$$ \binom{50}{5} = 2,118,760 $$
This is the number of ways to choose 5 items from a population of 50 items, where the order of selection does not matter.

---

Every time you take a number, the results will vary. This is known as Natural Sampling Variability

---

**Random Question**: What is the population of UVM undergrads that are out of state?

**Population:** all UVM undergrads

**Sample:** STAT2430A, where

- A: In State
- B: Out of State

**Calculations:**
$$ \hat{p} = \frac{x}{n} = \frac{7}{50} = 0.14 $$

From the poll, we can infer that 14% of the population is out of state. However, this might not be the case as the sample is not representative.

---

**Another Random Question:** What proportion of all UVM undergrads are in CEMS?

**Population:** All UVM undergrads

**Sample:** STAT2430A, where

- A: CEMS
- B: Not CEMS

**Calculations**:

Sample:
$$ \hat{p} = \frac{x}{n} = \frac{46}{50} = 0.92 $$

Full Population:
$$ p = \frac{x}{N} = \frac{1372}{10925} = 0.126 $$

From the poll, we can infer that 92% of the population is in CEMS. However, this might not be the case as the sample is not representative. Why is this the case?

> [!Answer]
> STAT2430A is a class that is predominantly CEMS. This is not representative of the population.

---

**Understanding the difference between Tangible and Conceptual Population**

When we say "All UVM undergrads", we are talking about a conceptual population. This is not tangible. We cannot measure this population.
When we say "STAT2430A", we are talking about a tangible population. This is measurable.

When measurements are taken from a process under identical experimental conditions, we consider the measurements to be an SRS of the population.

These measurements come from a population of all possible values that might be observed.

---

## Categorical and Quantitative Data

Data collected in a study can be broadly classified into two types: Categorical and Quantitative.

### Categorical Data

Categorical data, also known as qualitative or nominal data, is data that can be divided into several categories but has no order or priority. It is often non-numeric and may include data such as colors (red, blue, green), gender (male, female), or types of cuisine (Italian, Chinese, Mexican).

Categorical data can further be classified into:

- **Nominal data:** This is data that cannot be ordered or prioritized. Examples include colors or countries.
- **Ordinal data:** This is data that can be ordered or prioritized but the intervals between data points are not known. Examples include ratings or rankings.

### Quantitative Data

Quantitative data, also known as numerical data, is data that is measured or counted. It is always numeric. It includes data such as height (in inches or centimeters), time (in seconds or minutes), or age (in years).

Quantitative data can further be classified into:

- **Discrete data:** This is numeric data that has a countable number of values. Examples include the number of students in a class or the number of cars in a parking lot.
- **Continuous data:** This is numeric data that has an infinite number of values within a specified range. Examples include the height of a person or the time taken to run a race.

Understanding the type of data you are dealing with is crucial as it determines the type of statistical analysis that can be performed on the data.
