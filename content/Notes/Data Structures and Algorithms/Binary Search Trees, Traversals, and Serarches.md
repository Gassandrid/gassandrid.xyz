---
date: 2024-10-04
tags:
  - generated
---
## Overview
In a binary search tree (BST), nodes are arranged such that:
- The left child of a node contains a value smaller than the node.
- The right child of a node contains a value greater than the node.

There are four common tree traversal methods and two important search strategies:
1. **In-order Traversal**
2. **Pre-order Traversal**
3. **Post-order Traversal**
4. **Level-order Traversal**
5. **Breadth-First Search (BFS)**
6. **Depth-First Search (DFS)**

---

## 1. In-order Traversal
In-order traversal visits nodes in ascending order (for a BST).

> **Algorithm**:  
> 1. Traverse the left subtree.
> 2. Visit the root.
> 3. Traverse the right subtree.

```cpp
void inOrder(Node* root) {
    if (root == nullptr) return;
    inOrder(root->left);
    std::cout << root->data << " ";
    inOrder(root->right);
}
```

> [!note] **Use Case**
> In-order traversal is used when you want to print nodes of a binary search tree in sorted order.

---

## 2. Pre-order Traversal
Pre-order traversal visits the root before its subtrees.

> **Algorithm**:  
> 1. Visit the root.
> 2. Traverse the left subtree.
> 3. Traverse the right subtree.

```cpp
void preOrder(Node* root) {
    if (root == nullptr) return;
    std::cout << root->data << " ";
    preOrder(root->left);
    preOrder(root->right);
}
```

> [!tip] **Use Case**
> Pre-order is useful for copying a tree or evaluating prefix expressions.

---

## 3. Post-order Traversal
Post-order traversal visits the root after its subtrees.

> **Algorithm**:  
> 1. Traverse the left subtree.
> 2. Traverse the right subtree.
> 3. Visit the root.

```cpp
void postOrder(Node* root) {
    if (root == nullptr) return;
    postOrder(root->left);
    postOrder(root->right);
    std::cout << root->data << " ";
}
```

> [!warning] **Use Case**
> Post-order is important in deleting a tree, as it ensures you delete children before their parent.

---

## 4. Level-order Traversal
Level-order traversal visits nodes level by level.

> **Algorithm**:  
> 1. Visit each level of the tree starting from the root.
> 2. Traverse left to right within each level.

```cpp
void levelOrder(Node* root) {
    if (root == nullptr) return;
    std::queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* current = q.front();
        q.pop();
        std::cout << current->data << " ";
        if (current->left != nullptr) q.push(current->left);
        if (current->right != nullptr) q.push(current->right);
    }
}
```

> [!info] **Use Case**
> Level-order traversal is used for breadth-first search in trees.

---

## 5. Breadth-First Search (BFS)
Breadth-First Search explores the tree level by level, starting at the root.

> **Algorithm**:  
> 1. Start from the root.
> 2. Use a queue to traverse the tree level by level.
> 3. Visit all nodes at the current depth before moving to the next level.

```cpp
bool BFS(Node* root, int target) {
    if (root == nullptr) return false;
    std::queue<Node*> q;
    q.push(root);
    
    while (!q.empty()) {
        Node* current = q.front();
        q.pop();
        if (current->data == target) return true;
        
        if (current->left != nullptr) q.push(current->left);
        if (current->right != nullptr) q.push(current->right);
    }
    return false;
}
```

> [!example] **Use Case**
> BFS is useful when searching for the shortest path in an unweighted tree or graph.

---

## 6. Depth-First Search (DFS)
Depth-First Search explores the tree as deep as possible before backtracking.

> **Algorithm**:  
> 1. Start at the root and explore as far as possible along each branch before backtracking.
> 2. Can be implemented recursively (in-order, pre-order, post-order) or iteratively using a stack.

### DFS - Recursive In-Order Example
```cpp
bool DFS(Node* root, int target) {
    if (root == nullptr) return false;
    if (root->data == target) return true;
    
    if (target < root->data) return DFS(root->left, target);
    return DFS(root->right, target);
}
```

### DFS - Iterative Pre-Order Example
```cpp
bool iterativeDFS(Node* root, int target) {
    if (root == nullptr) return false;
    std::stack<Node*> s;
    s.push(root);
    
    while (!s.empty()) {
        Node* current = s.top();
        s.pop();
        if (current->data == target) return true;
        
        if (current->right != nullptr) s.push(current->right);
        if (current->left != nullptr) s.push(current->left);
    }
    return false;
}
```

> [!info] **Use Case**
> DFS is useful when searching in depth-first scenarios, like pathfinding where deep paths are prioritized over breadth.

---

## Inserting Elements into an Empty Binary Search Tree

When inserting elements into an empty BST:
- Recursively place a node into the correct position, adhering to the BST property.

```cpp
Node* insert(Node* root, int data) {
    if (root == nullptr) {
        root = new Node(data);
    } else if (data < root->data) {
        root->left = insert(root->left, data);
    } else {
        root->right = insert(root->right, data);
    }
    return root;
}
```

> [!example] **Example**
> To insert the sequence `10, 5, 15, 3, 7, 12, 17` into an empty BST:
> - Insert `10` as the root.
> - Insert `5` to the left of `10`.
> - Insert `15` to the right of `10`.
> - Continue similarly for the rest.

---

## Summary

Traversals of a BST allow for different ways of visiting and processing nodes. Understanding them is crucial for manipulating and analyzing trees efficiently. BFS and DFS provide powerful ways to search for specific nodes.

- **In-order**: Left, Root, Right (sorted output for BST).
- **Pre-order**: Root, Left, Right (copying structure, prefix expressions).
- **Post-order**: Left, Right, Root (deleting or evaluating postfix expressions).
- **Level-order**: Breadth-first search (top-down level-wise traversal).
- **BFS**: Searches the tree level by level.
- **DFS**: Searches the tree as deeply as possible before backtracking.
