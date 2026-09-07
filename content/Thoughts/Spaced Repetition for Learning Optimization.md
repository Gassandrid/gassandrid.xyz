---
date: 2026-07-18T12:37:32-07:00
updated: 2026-09-03T10:53:37-04:00
class:
  - note
tags:
  - transhumanism/self-configuration
  - journal/workflow
source:
related:
author:
description:
aliases:
  - Spaced Repetition
  - Anki
---

- Spaced Repetition is nothing new to me; I have been using anki for almost a year now for [[Dutch Language Aquisition]]. I origionally started using anki in high school by requirement from my spanish teacher for vocabulary learning. I didnt appreciate it at the time, but there is serious power in this learning method.
	- not only that, even other people in the [[Neuropharmacology]]/cognitive enhancement sphere are into this, specifically in [[Yana Log Notes]] and their post about Language Acquisition
- But now I am starting to really see the use cases beyond just language learning and more for learning anything I need to. Not only that, but in the age of agents there is a whole new side to the potential use cases.
	- In my limited tests it has shown to be a great way to learn [[Mathematics]] and [[Computational Neuroscience]] key facts, particularly in my little exploration into [[Group Theory in Neuroscience - Gemini|gropu theory in neuroscience]].
	- The way that agents empower these is that anki decks are just plaintext with maybe some multimedia of some kind. In my test for math and neuro I simply asked my coding agent to make me a new deck based on a given paper I had been reading.
		- This feels like the best way to solve the big problem with language models in workflow, that being you absorb and know less. [[Large Language Model|LLM]]s have the potential to be the greatest learning assistant there is, however it is quite easy for it to DO and SHOW without really TELLING. I think spaced could be the key to solving that, taking a concept or paper you had largely been digesting with language model assistance, and turning it into a deck for you to program in.
- where I am a little unsure is whether to commit to anki or go with the spaced repetition plugin for obsidian
	- anki is the established software, it has great sync, and just works. however I dont have the iphone app and that thing is 25$. nevertheless it has a lot of great features that make it a good candidate ( even though I dont really use them bsides the classic space + 1234 ).
	- obsidian is more finnicky, like for example for audio files they wont play the audio file automatically, i have to click the play button with mouse ( annoying ). however it integrates very nicely with my vault, along with the option of having a sync method to my phone. it also uses the fsrs algorithm. However I am not sure of the quality of the phone app.
		- more importantly, for the dream of having the LLM backbone for learning optimization, having it close to my vault allows it to evolve with what I am doing. I could do some work exploring group theory in my obsidian notes, and just through that and online/apper supplementation could ask an agent to build cards for said work, very low latency.
		- however i fear the [[Yak Shaving]] that comes from creating the "everything app", so I must proceed with caution.
		- another thing is that for example my dutch learning has some 13k audio files, and having atomic notes for cards would be insane. I think you can have many many cards on one note which is good, but I would also prefer to keep the media files like that out of the vault. For future learning on content from the vualt, however, this is a feature, as agents can compose cards from elements already present in my notes ( images, latex math, etc )
- I think the clean boundary is to keep anki as the actual review medium, while keeping the interface for making cards close to the vault. The vault can hold the source material and explicit card definitions for agents to work with, while a small Lab workspace handles the bridge into anki; anki itself stays responsible for FSRS, audio, sync and review state. This gets the useful part of the everything app without making obsidian own everything.

## [[08-05-2026]] Update: Anki Remains

I did finally get syncing in real time working between Obsidian on the phone and desktop. I've settled into the place where I don't need to have an everything app. You can just treat Obsidian as the surface for mind organization. Learning happens in Anki. I have my own app for self-reported data. I bought the Anki mobile app on my iPhone. It's $25, but I think it was worth it.
