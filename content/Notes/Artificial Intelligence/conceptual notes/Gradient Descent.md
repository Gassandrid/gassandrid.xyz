
Gradient Descent is an optimization algorithm used to minimize the cost function by iteratively adjusting the model's parameters.

---

## Intuition Behind Gradient Descent

When training a model, the goal is to minimize the **cost function** (or **loss function**), which measures how far off the model's predictions are from the actual target values. Gradient Descent finds the direction and step size to adjust the parameters to reduce this loss.

> [!abstract] **Key Idea**
> Think of the cost function as a hilly terrain. Gradient Descent helps you "walk down the hill" to find the lowest point (global minimum).

### 1. The Cost Function
The cost function is denoted as $J(\theta)$ and depends on the model parameters $\theta$.  Our goal is to minimize $J(\theta)$.

$$ J(\theta) = \frac{1}{2m} \sum_{i=1}^{m} \left( h_\theta(x^{(i)}) - y^{(i)} \right)^2 $$

Where:
- $m$ is the number of training examples.
- $h_\theta(x^{(i)})$ is the hypothesis (or prediction) for input $x^{(i)}$.
- $y^{(i)}$ is the actual target value for $x^{(i)}$

### 2. The Gradient Descent Algorithm

At each iteration, Gradient Descent updates the parameters using the formula:

$$ \theta := \theta - \alpha \frac{\partial}{\partial \theta} J(\theta) $$

Where:
- $\alpha$ is the **learning rate**, controlling the step size.
- $\frac{\partial}{\partial \theta} J\theta$ is the **gradient** of the cost function with respect to $\theta$.

### 3. Choosing the Learning Rate

The learning rate $\alpha$ is crucial. If it's too small, the algorithm will take a long time to converge. If it's too large, the algorithm may overshoot the minimum.

> [!tip] **Tip: Visualizing the Gradient**
> At each step, Gradient Descent moves in the direction of the steepest descent based on the slope (gradient). The size of the steps is determined by the learning rate.

### 4. Convergence

Gradient Descent converges when the updates to $\theta$ become very small, i.e., when the change in the cost function is below a certain threshold.

> [!question] How do we know if the model converged?
> If $| J(\theta_{\text{new}}) - J(\theta_{\text{old}}) | < \epsilon$, where $\epsilon$ is a very small number (like $10^{-6}$), we can consider the model to have converged.

---

## Types of Gradient Descent

1. **Batch Gradient Descent**: Uses the entire dataset to compute the gradient at each step.
2. **Stochastic Gradient Descent (SGD)**: Updates the parameters based on a single training example per step.
3. **Mini-batch Gradient Descent**: A mix of both, using small random subsets (mini-batches) of the data for updates.

---

> [!info] **Additional Reading**
> - Explore different variants of Gradient Descent, such as Momentum, RMSProp, and Adam, to improve convergence speed and stability.

