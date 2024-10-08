---
tags:
  - math
date: 2024-09-04
---
## How do you "add" two vectors together?

![[Pasted image 20240826123538.png]]

We can use the "tip to tail" method to add two or more vectors together as show in the figure.

## How do you "subtract" them?

![[Pasted image 20240826123719.png]]

We can subtract two vectors by representing one of them as a negative vector `-v`, and then adding those two together.

That works for adding and subtracting vectors geometrically, but what about arithmetically?

Vectors can be added or subtracted by adding or subtracting the corresponding components.
For example, to add two vectors, add the first components together, then add the second components together, and so on.
To subtract two vectors, subtract the corresponding components.


$$\begin{bmatrix} 1 \\ 2 \\ 5 \end{bmatrix} + \begin{bmatrix} -1 \\ -3 \\ -4 \end{bmatrix} = \begin{bmatrix} 0 \\ -1 \\ 1 \end{bmatrix}$$

## Multiplication of vectors

![[Pasted image 20240826124335.png]]

To multiply vectors, we can use the **dot product** to find the magnitude.

$$\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} \cdot \begin{bmatrix} 4 \\ 5 \\ 6 \end{bmatrix} = 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32$$

We can also use the cross product

![[Pasted image 20240826124530.png]]

The cross product of two vectors is another vector that is perpendicular to both of the original vectors.

$$\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} \times \begin{bmatrix} 4 \\ 5 \\ 6 \end{bmatrix} = \begin{bmatrix} 2*6 - 3*5 \\ 3*4 - 1*6 \\ 1*5 - 2*4 \end{bmatrix} = \begin{bmatrix} 12 - 15 \\ 12 - 6 \\ 5 - 8 \end{bmatrix} = \begin{bmatrix} -3 \\ 6 \\ -3 \end{bmatrix}$$