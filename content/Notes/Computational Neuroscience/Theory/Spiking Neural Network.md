---
date: 2026-02-09T12:50:35-05:00
updated: 2026-09-04T16:24:45-04:00
source:
  - https://artemkirsanov.substack.com/p/the-hardware-lottery
  - https://en.wikipedia.org/wiki/Spiking_neural_network
  - https://artemkirsanov.substack.com/p/the-smooth-lie-that-makes-spikes
class:
  - note
tags:
  - comp-neuro/models
  - cs/ai/spiking
related:
author:
description:
aliases:
---

- can be done in [[Brian2]], probably the easiest way to go about it at this point, seems to be the most stable neural computation library and has a CUDA version
- [[Artem Kirsanov]] seems to like them a lot, he highlighted the "**hardware lottery**", where Spiking neural nets didnt take off because it did not fit into our standard von neumann architecture, and not parellizable in the sense like GPUs allow for
- kind of industry standard ( with variations ) for neuromorphic algorithms, can be run on [[Intel Loihi]]. usually using [[Leaky Integrate And Fire]] neuron models.
- what makes SNNs hard to train is that a spike, represented usually by the [[Dirac Delta Function]], is non differentiable, so [[Gradient Descent]] becomes difficult to compute.
	- in practice, we often just *lie* in the backward pass by using a **surrogate function**, usually a very close approximation of the [[Heaviside Function]] with a [[Sigmoid Function]], then on the forward pass we swap it out for the [[Heaviside Function]] in its full. This *works* well enough, however will accumulate error on larger networks through the **vanishing gradient issue**.

$$
\frac{\partial S}{\partial V} \left|\right._{\text{forward}} = \delta \left(V - V_{\text{th}}\right) \rightarrow \frac{\partial S}{\partial V} \left|\right._{\text{backward}} \approx \frac{1}{\left(\right. 1 + \beta \left|\right. V - V_{\text{th}} \left|\right. \left.\right)^{2}}
$$

- Bio inspired, energy efficient(especially on [[Neuromorphic Computing|Neuromorphic]] hardware, both analog and digital, however analog an order of magnitued more efficient ). Process information in sparse, discrete spikes in a continuous time environment. 
	- Would be ideal if the hardware permitted them to scale, however they do still excel in low power edge ai and temporal pattern recognition.

Much harder to train since spiking is non differentiable so [[Gradient Descent]] is not viable.

![[SNN.png]]
