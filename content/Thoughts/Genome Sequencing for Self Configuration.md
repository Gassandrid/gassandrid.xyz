---
class:
  - note
tags:
  - seed
  - health
  - pharmacology/neuro
  - transhumanism/biohacking/wgs
  - cs/homelab/data
related:
  - "[[My Eternal Golden Braid]]"
  - "[[Self Configuration]]"
  - "[[Substance Protocol]]"
  - "[[Neuropharmacology]]"
  - "[[On Capturing Personal Data]]"
  - "[[Health Protocol]]"
  - "[[Gödel, Escher, Bach]]"
  - "[[On Whole Genome Sequencing]]"
author:
description: Genome sequencing as a structural layer for self-configuration, pharmacogenomic decoding, and retrospective interpretation of neuropharmacology logs.
aliases:
  - Genome sequencing as self configuration
  - Pharmacogenomics as decoder ring
date: 2026-04-24T12:56:30-04:00
updated: 2026-09-02T11:35:55-04:00
---

[[On Whole Genome Sequencing|Whole Genome Sequencing]] feels like quite an obvious step for me given what I have already done. it fits the [[My Eternal Golden Braid]] path well, another strand in the braid where [[Neuropharmacology]], [[On Capturing Personal Data|Quantified Self]], [[Computational Neuroscience]], and [[Self Configuration]] fold back into each other. Likely to do this using a kit from [[The ODIN]]

Beyond extended [[Health]]/[[Longevity]] data, there are some uses for experiment loops involving [[Neuropharmacology]].

- current neuropharmacology project is mostly inference from mechanisms, subjective logs, and sparse biomarkers. 
	- this would give us priors: how my body clears compounds, how receptors might differ from the population default, and what baseline neurochemical tendencies I may have been modulating without knowing it.

Reminiscent of [[Gödel, Escher, Bach]] self-reference. system is reading a low level description of itself, then using it to modify higher level behavior.

## Some Starting Pharmacogenomics Ideas

### CYP450 Clearance

cytochrome P450 system an the obvious first pass as its effects tolerability of many compounds. If I am an ultra-rapid, normal, intermediate, or poor metabolizer on specific CYP pathways, that changes the interpretation of almost every [[On Self Reported Data|Self Reported]] medication.

Genes of interest:

- CYP2D6
- CYP2C19
- CYP2C9
- CYP3A4 / CYP3A5
- CYP1A2
- CYP2B6
- UGTs and other conjugation pathways if the report is broad enough

### Some Specific Substances Worth Investigating

- [[Tropisetron]]: HTR3A / HTR3B variants may alter 5-HT3 receptor response. CHRNA7 variation could matter for α7 nicotinic signaling.
- [[Bromantane]] and other dopaminergic agents: DRD2, DRD4, SLC6A3/DAT1, TH, and dopamine pathway variants could explain differences in drive, side effects, or lack of felt stimulation.
- [[TAK-653]]: AMPAR subunit genes and glutamatergic baseline may matter for whether AMPA potentiation feels like cleaner cognition or overstimulation.
- [[Neboglamine]]: NMDA glycine-site response may depend on glutamatergic architecture and glycine/D-serine related pathways.
- serotonergic compounds: HTR variants and SLC6A4 could explain differential anxiolytic, compulsive, or affective response.

### Baseline Neurochemistry

A lot of stack design assumes a baseline state, but the baseline is exactly what is missing. Genetics can make the baseline less invisible.

Almost all compounds ( in this case lets look at the example of [[Citicoline]] ) are usually only showing improvement in RCTs for non-healthy people who have some deficiency. [[Citicoline]] will show little to no cognitive benefit if at a normal level, and maybe even cause negative effects if you already operate at a high level. I should only really be taking something like [[Citicoline]] if I have a deficiency OR am taking another substance that causes my base [[Acetylcholine]] levels to deplete faster.

High priority [[Neurotransmitters]]/etc to investigate

- **BDNF Val66Met**: activity-dependent BDNF secretion. Crucial for interpreting [[ACD-856]], [[BPN14770]], [[NSI-189]], Cerebrolysin-adjacent ideas, and anything framed as neurotrophic repair.
- **COMT Val158Met**: prefrontal dopamine clearance. Directly relevant for executive function, working memory, stress response, and stimulant/dopaminergic sensitivity.
- **MAO-A / MAO-B**: monoamine degradation baseline. Relevant to dopaminergic and serotonergic tone, [[Selegiline]], and mood/drive interpretation.
- **SLC6A4 / HTR genes**: serotonergic tone, SSRIs, 5-HT3 antagonism, anxiety/OCD-ish circuitry.
- **DRD2 / DRD4 / SLC6A3**: dopamine receptor/transporter architecture.
- **GRIN / GRIA genes**: NMDA and AMPA receptor architecture, relevant to [[TAK-653]] and [[Neboglamine]].
- **MTHFR / methylation genes**: one-carbon metabolism, methylfolate/B12 relevance, fatigue, mood, homocysteine.
- **APOE**: longevity and neurodegeneration risk, but interpret carefully because it has psychological load.
