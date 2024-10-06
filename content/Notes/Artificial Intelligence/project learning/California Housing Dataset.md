---
date: 2024-09-12
---
# Analysis of my California Housing Dataset Neural Network

This document serves as a reflection on the process and design choices for my neural network. The code uses **PyTorch** to build and train a regression model to predict housing prices based on the **California Housing dataset**. Here’s a deeper analysis of its components:

## 1. **Dataset and Preprocessing**

The dataset used is the **California Housing dataset** from `sklearn.datasets`. The preprocessing steps include:
- **Normalization:** The features are normalized using `StandardScaler` to ensure that each feature has a mean of 0 and a standard deviation of 1. This helps the network converge faster.
- **Train-Test Split:** The dataset is split into training (80%) and testing (20%) data using `train_test_split`.

## 2. **Device Management**
The code handles **device management** effectively:
- It checks for **Apple M1's Metal Performance Shaders (MPS)** for GPU acceleration, then defaults to **CUDA** or **CPU** based on availability.
- Users can choose between "cpu", "cuda", or "mps" for the device during runtime.

## 3. **Neural Network Architecture**

The model, `HousingModel`, is a **fully connected feedforward neural network** consisting of **three layers** with **batch normalization**, **leaky ReLU activations**, and **dropout**.

### Layers Overview:
- **Input Layer (fc1):** The input layer takes the 8 normalized features from the dataset and passes them through a fully connected layer with 64 neurons.
- **Batch Normalization (bn1):** Applied after the first fully connected layer, batch normalization normalizes the outputs to stabilize training and reduce internal covariate shift.
- **Activation (LeakyReLU):** Leaky ReLU is used as the activation function, allowing for small negative values in the output, avoiding the dying ReLU problem.
- **Dropout (dropout1):** Dropout with a rate of 0.3 is applied to prevent overfitting by randomly turning off 30% of the neurons in this layer during training.
  
- **Second Layer (fc2):** A second fully connected layer maps from 64 to 32 neurons, followed by batch normalization and another Leaky ReLU activation.
  
- **Output Layer (fc3):** The final output layer maps the 32 neurons to a single output (the predicted house price).

### Key Design Choices:
- **Leaky ReLU** is preferred over standard ReLU to maintain small gradients for negative inputs, preventing neurons from becoming inactive during training.
- **Batch Normalization** is applied after each linear layer to speed up convergence and allow for higher learning rates.
- **Dropout** is used to regularize the network and mitigate overfitting.

## 4. **Loss Function and Optimizer**

- **Loss Function:** The loss function chosen is **Mean Squared Error (MSE)**, appropriate for this **regression task**.
- **Optimizer:** **Adam** optimizer with a learning rate of `0.001` is selected. Adam is a widely used optimizer due to its adaptive learning rate, making it a good default choice for most deep learning problems.

## 5. **Training Process**

The training loop uses a typical structure:
- **Batching:** The data is loaded into batches of size 64 using a `DataLoader`, which is efficient for training.
- **Gradient Descent:** For each batch, the model's gradients are calculated and optimized using the Adam optimizer.
- **Loss Calculation:** The mean squared error is computed at each step, and the loss is printed for every epoch to track progress.

## 6. **Prediction Process**

The model includes a simple prediction function:
- During prediction, the model is set to **evaluation mode** using `model.eval()`, which disables dropout and batch normalization behavior meant for training.
- Predictions are made on a random test sample, comparing the predicted house price with the actual value.

## 7. **File Management**

The code includes mechanisms to **save** and **load** the model's weights:
- **Saving:** After training, the model’s weights are saved to a file, `"model.pth"`.
- **Loading:** When training is initiated again, the code attempts to load the existing weights from `"model.pth"` to resume training from the last checkpoint.

## 8. **User Interaction**
The program allows the user to interact via a simple **menu system**:
- **Train:** Trains the model for a specified number of epochs, saving the model at the end.
- **Predict:** Makes predictions using a random sample from the test set.
- **Exit:** Stops the program.

## Summary

This model is a straightforward, well-architected neural network for a **regression task**. Key architectural elements, like **batch normalization**, **Leaky ReLU**, and **dropout**, enhance performance and generalization. The code demonstrates good practices in device management, model saving/loading, and user interaction, making it both efficient and user-friendly for a relatively small dataset.