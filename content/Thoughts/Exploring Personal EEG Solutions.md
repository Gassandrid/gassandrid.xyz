---
class:
  - note
tags:
  - journal
  - comp-neuro/equipment/eeg
source:
related:
author:
date: 2025-10-08
updated: 2026-09-03T17:01:10-04:00
---

As it might be clear by now, I have been getting quite obsessed with collecting data about myself in every faucet. This has mostly been for health work ( tracking biomarkers, etc ), with my new [[AirGradient ONE]] air quality monitor for [[Home Assistant]]. I am also considering getting a wearable like a [[Garmin Venu 4]] so as to collect even more data day to day ( without all the unnecessary features on the more expensive Garmin wearables ).

I have also been collecting a bunch of data about my online work, namely by analysing my own pattern in this vault through [[Vault Link Timeseries Analysis]] and [[Scraping My Youtube History]], and how I plan to compare the two using [[Vault to Youtube Cross Synchronization]]. 

But given that I am studying [[Computational Neuroscience]] and have been interested in [[Brain Computer Interfaces]], I have been thinking about how I can extend this data hoarding interest of mine into my own domain.

If I have access to EEG equipment, I would hope I could do something like the [[Vault to Youtube Cross Synchronization]] idea, but by cross synchronizing my youtube/obsidian data with the EEG readings when exposed to that stimulus(modeling the experiment would be its own challenge).

---

## Some Options

I want something that both gets me the data I need, but also does it without needing some bloated subscription based proprietary software. I also want to own my data, and I want to do this all for a *somewhat* affordable price.

The most obvious choice given these conditions is the [[Ultracortex "Mark IV" EEG Headset]] by OpenBCI. Given the DIY nature of the device, it is a bit of a premium at 600$, but there are a lot of savings given that I dont need to get some extremely overpriced monthly subscription just to access my data. This would be less usefull for the fun "controlling stuff with your brain", and more focused on the research that I would be doing on my own day to day activities, possibly tracking stimulus through the content I consume/write about.

Found this post regarding working with **OpenBCI** stuff:

<https://www.reddit.com/r/TargetedIndividSci/comments/1mm3s4c/openbci_32bit_8_channels_at_a_low_cost/>

There are other, likely better solutions like **Emotiv Epoc X**, but as said above, we dont want proprietary software that we are reliant on, in addition to having some random company have my brain data.

### New Option Update on [[12-16-2025]]

Given some comments I made in [[On Capturing Personal Data#EEG|the personal data index]], I think it would be best to just go with something like the [[BrainAccess HALO]]. It is an entry level headset, only about 400$. And it comes with a well documented python SDK for instant deployment and whatnot.

---

This idea may remain on the backburner for a while given the cost of such an endeavor, but I still believe in the utility as a project/resume builder, and also the data that could be obtained from such a device ( in relation to my other media consumption data sources, namely [[ActivityWatch]] )
