---
date: 2024-10-01
---

> [!note] **Cartesian Product**
> 
> The **Cartesian Product** of two sets \( A \) and \( B \), denoted as \( A \times B \), is the set of all ordered pairs where the first element comes from \( A \) and the second comes from \( B \).

---

## Definition

The Cartesian product of two sets \( A \) and \( B \) is defined as:

$$
A \times B = \{ (a, b) \ | \ a \in A, b \in B \}
$$

This means that each element in set \( A \) is paired with every element in set \( B \).

---

### Example

Consider two sets \( A = \{1, 2\} \) and \( B = \{x, y\} \).

$$
A \times B = \{ (1, x), (1, y), (2, x), (2, y) \}
$$

> [!tip] **Key Insight**
> 
> The Cartesian product is not commutative: $A \times B \neq B \times A$. This means that:
> 
> $$ A \times B \neq B \times A $$
> 
> In particular:
> 
> $$ A \times B \neq B \times A \text{ unless } A = B $$

---

## Generalization

The concept of Cartesian product can be extended to more than two sets. For example, the Cartesian product of three sets \( A \), \( B \), and \( C \) is:

$$
A \times B \times C = \{ (a, b, c) \ | \ a \in A, b \in B, c \in C \}
$$

If \( A = \{1, 2\}, B = \{x\}, C = \{y, z\} \), the product is:

$$
A \times B \times C = \{ (1, x, y), (1, x, z), (2, x, y), (2, x, z) \}
$$

> [!abstract] **Visualizing the Cartesian Product**
> 
> - For \( A \times B \), imagine a grid where each row corresponds to an element of \( A \) and each column to an element of \( B \). The intersections represent the pairs.
> - For higher dimensions, the visualization extends to cubes, and hypercubes for further sets.
