---
id: Mechanistic Interpretability
aliases:
  - Interpretability
tags:
  - cs/ai/interpretability
  - cs/ai/llm
  - sapling
date: 2025-09-25
updated: 2025-09-25
class:
  - note
source:
  - "[[The Dark Matter of AI - Mechanistic Interpretability]]"
related:
  - "[[Sparse Autoencoder]]"
author:
---
**Mechanistic Interpretability** is a subfield of AI interpretability that focuses on understanding the internal workings of AI models, particularly large language models (LLMs). It aims to uncover how these models process information and make decisions, often through techniques like circuit analysis, feature visualization, and probing.

---

## Common Techniques

[Anthropic](https://www.anthropic.com/research/mapping-mind-language-model) and many other organizations have been working on mechanistic interpretability using techniques that focus on a single neuron or a small group of neurons.

What this looks like in practice looking at the probability distribution for a sample query, say "The reliability of wikipedia is very...", finding something interesting like a probability for "questionable" being high, and then going through layer by layer unembedding the logits to see which neurons are contributing to that probability.

When you have found a neuron of interest, you could try a few things to investigate, something like modifying the neuron value to see how it affects the output, or plotting a heatmap over the token sequence to see what parts of the input are activating the neuron.

> ![[anthropicGoldenGateNeuron.png]]
>
>  
> _Anthropic: A feature sensitive to mentions of the Golden Gate Bridge fires on a range of model inputs, from English mentions of the name of the bridge to discussions in Japanese, Chinese, Greek, Vietnamese, Russian, and an image. The orange color denotes the words or word-parts on which the feature is active._

### Key Methodologies

Here are some specific techniques for understanding what a model has learned:

- **[[Sparse Autoencoder]]s**: A promising approach that uses a separate learning algorithm to extract model features that often align with human-understandable concepts. Researchers can then amplify or suppress these features to observe their effect on the model's behavior.
- **Direct Modification of Neuron Values**: A straightforward method to test a neuron's function by manually setting its output to a very high or low value. By observing the impact on the model's predictions, one can infer what the neuron has learned.
- **Searching for Maximal Activation Examples**: To determine what a specific neuron or feature represents, one can search through a dataset for text examples that cause it to activate most strongly.
- **Modifying Model Architecture**: An experimental technique to combat _polysemanticity_ (where one neuron represents multiple unrelated concepts) by changing the model's architecture to encourage fewer neurons to fire for any given input. The goal is to isolate concepts to more specific neurons.
- **Sparse Cross-Autoencoders**: A developing approach that aims to overcome limitations of standard sparse autoencoders. It looks at multiple locations in the model simultaneously to better disentangle cross-layer superposition.

---

## [[Superposition in AI|Superposition]] And [[Polysemanticity]]

A theory that has emerged from mechanistic interpretability research is that of **superposition** and **polysemanticity**. This theory suggests that neural networks often encode multiple unrelated concepts within the same neuron or feature, leading to complex and entangled representations.
