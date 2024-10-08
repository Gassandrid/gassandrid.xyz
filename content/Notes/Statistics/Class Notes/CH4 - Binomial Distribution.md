---
id: CH4 - Binomial Distribution
aliases: 
tags:
  - statistics
date: 2024-09-12
---

# Binomial Distribution

> [!summary] **Summary**
> The binomial distribution models the probability of a specific number of successes in a fixed number of independent Bernoulli trials, each with the same probability of success.

---

## Definition

A **binomial distribution** describes the number of successes in a sequence of $n$ independent trials, where each trial has two possible outcomes: _success_ or _failure_. The probability of success in each trial is denoted by $p$.k

The **binomial probability mass function (PMF)** is given by:

$$
P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}
$$

where:

- $n$ is the number of trials,
- $k$ is the number of successes,
- $p$ is the probability of success on a single trial,
- $\binom{n}{k}$ is the binomial coefficient, representing the number of ways to choose $k$ successes from $n$ trials.

---

## Properties

- **Mean**: The expected value (mean) of a binomial distribution is given by:

  $$
  \mu = np
  $$

- **Variance**: The variance of a binomial distribution is:

  $$
  \sigma^2 = np(1 - p)
  $$

- **Support**: The possible values of $X$ range from $0$ to $n$, where $X$ is the number of successes.

---

## Example

> [!example] **Example: Tossing a Coin**
> Suppose you flip a fair coin ($p = 0.5$) 10 times. What is the probability of getting exactly 6 heads?
>
> Using the binomial formula:
>
> $$
> P(X = 6) = \binom{10}{6} (0.5)^6 (0.5)^{4} = \frac{10!}{6!(10-6)!} (0.5)^{10}
> $$
>
> This simplifies to:
>
> $$
> P(X = 6) = 210 \cdot (0.5)^{10} = 0.205
> $$

---

## Key Points

> [!tip] **Key Characteristics of Binomial Distribution**
>
> - Trials are independent.
> - Each trial has exactly two outcomes.
> - Probability of success remains constant across trials.

> [!info] **Common Use Cases**
>
> - Quality control: Checking defective products in a batch.
> - Clinical trials: Success rate of a treatment.
> - Survey analysis: Probability of a certain number of people agreeing with a statement.

---

## Inverse Binomial Distribution

$$ P(X = k) = \binom{k + r - 1}{k} p^r (1 - p)^k $$

> [!question]
> How many trials are needed to achieve $k$ successes in a binomial distribution with probability $p$?

TODO

