---
id: CH5 - Confidence Intervals
aliases: []
tags: []
---

For confidence intervals and the like, we need to start with a **Research Question:**

Taking a sample and find the sample statistic, What to estimate about the population grown, conduct a [[Hypothesis Test]]Proportions

## 5.1 - Point Estimates and Confidence Intervals

Point estimates are single values that are used to estimate population parameters. They are calculated from sample data and are used to estimate the true population parameter.

### Point Estimates

We can find point estimates for population parameters using sample data. For example, we can use the sample mean to estimate the population mean or the sample proportion to estimate the population proportion.

---

## 5.2 - Confidence Intervals for Proportions

> [!Warning] Note
> We'll do TRADITIONAL METHOD only (ignore other methods for this class)

Let's have a look at an example of a confidence interval for a fun divisive topic!

### CI Example - Presidential Approval Rating

Oftentimes we are presented with some statistics about approval rating of presidential candidates through the country, something like

$$45\% \pm 3\%$$

This form factor can be boiled down to something like

$$Sample \ Statistic \ \pm \ margin \ of \ error$$

Which are represented in the discrete math world as

$$\hat{p} \ \pm \ E$$

### How do you go about getting a CI?

Start with a [[Sampling Distribution]], where all candidates are equally likely to be selected. This is a **Random Sample**.

$$\hat{p} ~ N(p, \sqrt{\frac{p(1-p)}{n}})$$

Where $p$ is the population proportion, and $n$ is the sample size.

$$ \sigma = \sqrt{\frac{p(1-p)}{n}} $$

Let's make a normal distribution for a 95% Confidence Interval of a population.

### [[Normal Distribution Graph]]

![[Pasted image 20241015090052.png]]

---

Why does a CI do a better job at estimating population proportion?

With just $\hat{p}$, we can't be sure how close we are to the population proportion, but with a CI, we can be sure that the population proportion is within a certain range.

On the other hand, when we construct a CI, we can be sure that the population proportion is within a certain range.

With knowing the value of p, we can construct a CI that is within a certain range of the population proportion.

### How do we construct a CI?

Remember,

$$Point \ Estimate \pm Margin \ of \ Error$$

$$ Point \ Estimate \pm \frac{(critical \ value) \times (standard \ error)}{\sqrt{n}} $$

Also recall

$$\sigma = \sqrt{\frac{p(1-p)}{n}}$$

Plugging it all in,

$$\sigma = \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$

$$\sigma \approx SE(\hat{p})$$

---

Let's look at a useful equation derived from this reasoning.

$$ \hat{p} \pm z \sqrt{\frac{\hat{p}(1-\hat{p})}{n}} $$

Where $z$ is the critical value for the desired confidence level.

Let's take a sample ($n =$) and get a sample proportion ($\hat{p} =$), and then construct a 95% CI.

**For 95%**

$$C = 95\% \rightarrow \frac{\alpha}{2} = 0.025 \ rightarrow z_{.025} = | invNorm(0.025) | = 1.96$$

**For 90%**

$$C = 90\% \rightarrow \frac{\alpha}{2} = 0.05 \ rightarrow z_{.05} = | invNorm(0.05) | = 1.645$$

**For 80%**

$$C = 80\% \rightarrow \frac{\alpha}{2} = 0.10 \ rightarrow z_{.10} = | invNorm(0.10) | = 1.282$$

> [!Note] Something to notice
> As the confidence level increases, the margin of error increases as well, meaning our precision decreases.

