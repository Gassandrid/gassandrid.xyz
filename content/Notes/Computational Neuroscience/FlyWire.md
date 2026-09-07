---
source: https://flywire.ai/
image: https://www.google.com/s2/favicons?domain=https://flywire.ai/&sz=256
class:
  - website
  - note
tags:
  - website
  - comp-neuro/brain
  - university/research
  - comp-neuro/models/connectome
related:
date: 2026-02-08T10:21:07-05:00
updated: 2026-09-04T15:10:33-04:00
title: Drosophila Connectome
aliases:
  - Drosophila
  - Drosophila Connectome
  - Drosophila melanogaster
  - Fly Brain
---

Part of the brain mapping project, first full connectome of a brain. Partially done by researchers at [[University Of Vermont]]. First full connectome of a living brain!

>[!Warning] [[09-03-2026]] **BIG UPDATE**!!!
> The Janelia Research Campus has done it again, this time mapping the [male CNS counterpart](https://www.janelia.org/project-team/flyem/male-cns-connectome). For the first time in history, we can actually look at sexual dimorphism of brains in rigorous detail.
> 
> *"Comparing male and female fly brain connectomes, we identify 262 sex-specific and 114 sexually dimorphic cell types, comprising 4.8% of the central brain. Using whole-brain comparative connectomics, we reveal specific circuits originating from distinct sensory streams and uncover general principles governing how neural architecture encodes the capacity for sex-shared, sex-specific, and flexible behaviors."*

A funny project you see a lot of people doing is running the connectome as a [[Spiking Neural Network]] simulation within [[Brian2]] or other sim engines. While fun and interesting, those experiments of "uploading a fly brain" are a little exeggerated as they manually tagged a few motor neurons responsible for direction/orientation

I was able to recreate the "fly brain upload" myself quite easily:

![[flyBrainRecreation.mp4]]

If one wants to run itself as a [[Leaky Integrate And Fire]] model, have a look at [FastFly](https://github.com/eonfathom/FastFly) or the origonal [full brain emulation github project](https://github.com/eonsystemspbc/fly-brain).

Another funny thing being done with this cnnectome is it being used as a base for further RL postraining for other unintended tasks. **Tim Hwang** on twitter was able to train the connectome to drive a little robot vehicle towards a goal.

![[flybrainCar.mp4]]

![](https://x.com/timhwang/status/2091554909954961482)

---

## Clipped Content

![Buildings](https://flywire.ai/assets/bgd5.png)

Since 2019, scientists and experienced proofreaders have utilized FlyWire to proofread AI segmentation of a full fly brain ([Dorkenwald et al.](https://www.nature.com/articles/s41592-021-01330-0.pdf?proof=t), [Zheng et al.](https://www.cell.com/cell/pdf/S0092-8674\(18\)30787-6.pdf)). As of October 2024, the flagship FlyWire paper, Neuronal wiring diagram of an adult brain, has been published in *Nature*, which includes 139,255 proofread neurons ([Dorkenwald et al.](https://doi.org/10.1038/s41586-024-07558-y)). The companion papers include hierarchical annotation of all proofread neurons ([Schlegel et al.](https://doi.org/10.1038/s41586-024-07686-5)) and a comprehensive cell type catalog of the visual system ([Matsliah, Yu et al.](https://doi.org/10.1038/s41586-024-07981-1)).

Automatically extracted presynaptic and postsynaptic tags have been applied to all putative connections in the brain ([Buhmann et al.](https://www.nature.com/articles/s41592-021-01183-7)), and the dominant neurotransmitter assigned for most neurons ([Eckstein et al.](https://doi.org/10.1016/j.cell.2024.03.016)).

Explore the connectome and its annotations in [Codex](https://codex.flywire.ai/).

![Drosophila Melanogaster, connectome](https://flywire.ai/assets/bgd4.png)

## Creating the FlyWire Brain Connectome

FlyWire’s brain connectome was created through contributions of hundreds of scientists at numerous institutions who make up the FlyWire Consortium. The high-resolution image data was acquired in the [[Davi Bock|Bock]] lab at Janelia Research Campus and aligned by the Bock and Saalfeld labs at Janelia Research Campus. The Murthy and Seung labs at Princeton University then re-aligned and automatically reconstructed all the cells. The Murthy and Seung labs made the reconstructions openly available for large-scale proofreading by creating the FlyWire platform and establishing the FlyWire Consortium; the Murthy and Seung labs led the Consortium effort. The FlyWire platform was built on a proofreading and annotation infrastructure developed in collaboration between Princeton University and the Allen Institute for Brain Science, who continue to manage the platform jointly. The main 3D data viewer of FlyWire was developed by Google Research. At this stage, FlyWire incorporated synapse predictions from the Funke and Saalfeld labs at Janelia and neurotransmitter information provided by the Funke lab at Janelia and the Jefferis Lab at MRC Laboratory of Molecular Biology. Proofreading and annotation was carried out by hundreds of members of the FlyWire Consortium, including citizen scientists. The majority of the proofreading was carried out and orchestrated by the Murthy and Seung labs at Princeton University, the Jefferis Lab at MRC Laboratory of Molecular Biology and the Bock lab at [[University of Vermont]] who worked with SixEleven and ariadne.ai for proofreading services. The Jefferis and Bock labs curated hierarchical annotations for all neurons in the brain and detailed cell typings for all neurons in the central brain. The Murthy and Seung labs created cell type annotations for all intrinsic neurons of the optic lobes. The Murthy and Seung labs developed Codex (Connectome Data Explorer) for sharing and exploring the connectome. Groups at Princeton University, MRC Laboratory of Molecular Biology, the Allen Institute for Brain Science, Harvard Medical School, and the Larner College of Medicine at the [[University of Vermont]] built additional programmatic and interactive tools for accessing the resource.
