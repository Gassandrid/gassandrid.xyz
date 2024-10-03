---
id: CH2 - Probability
aliases: []
tags: []
---

# Probability In statistics

---

## Basic idea

**Experiment**: a process the results in an outcome that cannot be predicted in advance with certainty.

> [!example] **Toss a Coin**
> S = {H,T}

**Sample space**: set of all possible outcomes

> [!example] **Rolling a die**
> S = {1,2,3,4,5,6}

**Event**: subset of the sample space

Back to the examples:

Let even `A` be the roll of 1, `A`={1}
Let event `E` be an even role, `E`={2,4,6}

---

Up to this point, you have been a "**frequentist**"

$$
p(A) = \lim_{n \to \infty} \frac{\text{favorable outcomes}}{\text{total number of trials}}
$$

Plugging in the numbers:

$$
p(A) = \frac{1}{6}
$$

## Basic Axioms:

Axioms are the basic building blocks of probability theory.

Here are the three basic axioms:

P(a) is greater than or equal to 0, but less than or equal to 1 for all events a

$$
0 \leq P(a) \leq 1
$$

P(S) is equal to 1

$$
P(S) = 1
$$

P(A or B) = P(A) + P(B) - P(A and B)

$$
P(A \cup B) = P(A) + P(B) - P(A \cap B)
$$

### Ven Diagrams

Setting up the environment:

```python
import micropip
await micropip.install("matplotlib")
await micropip.install("matplotlib_venn")

import matplotlib.pyplot as plt
from matplotlib_venn import venn2

# Data
labels = ['A', 'B', 'A and B']


plt.figure(figsize=(6, 4))
```

1. **Not in A**

```python
venn2(subsets=(1, 0, 0), set_labels=labels)
plt.title('Not in A')
plt.show()
```

2. **Not in B**

```python
venn2(subsets=(0, 1, 0), set_labels=labels)
plt.title('Not in B')
plt.show()
```

3. **A and B**

```python
venn2(subsets=(0, 0, 1), set_labels=labels)
plt.title('A and B')
plt.show()
```

4. **A or B**

```python
venn2(subsets=(1, 1, 1), set_labels=labels)
plt.title('A or B')
plt.show()
```

5. **DeMorgans Law**

DeMorgan's Law states that the complement of the union of two sets is equal to the intersection of the complements of the two sets.

```python
venn2(subsets=(1, 1, 0), set_labels=labels)
plt.title("DeMorgan's Law")
plt.show()
```

Lets examine the ideas DeMorgans Law presents.

## Quantification vs Complement

| Quantification | Complement            |
| -------------- | --------------------- |
| All 5          | Not all 0, 1, 2, 3, 4 |
| 1,2,3,4,5      | Not some              |

> [!question] Are events mutually exclusive?
> Depends on the problem.

Lets look at a deck of cards:

> [!example] **Deck of Cards**
> S = {52 cards}
> A = {red cards}
> B = {face cards}
> A and B = {red face cards}

Are A and B mutually exclusive?

> [!answer] No, because there are red face cards.
> The intersection of A and B is not empty.
