---
class:
  - note
tags:
  - journal/workflow
source:
related:
author:
description:
aliases:
date: 2026-07-30T11:47:44-07:00
updated: 2026-09-03T13:03:51-04:00
---
- I have talked a lot on various youtube interviews about how I use my obsidian vault to mannage the [[Consuming and Choosing Content Effectively|content I consume]]
	- I have several base view for mediums of content: [[Youtube.base]], [[Papers.base]], [[Books.base]], however most of the notes of various youtube videos or papers have no content besides the content that the clipper creates - they kind of just serve as a tracker for if I have watched that youtube video and where I wrote about it.
	- But [[07-30-2026|today]] I found myself going through my resources folder and surfacing old notes from the `website` section, notes dedicated to articles or web pages of interest. I realized exports like [[TRIBE v2]] could serve much better as actual notes on the thoughts frontend, not just a web reminder of this tool, as I reference this note a LOT now! Much like the ideas discussed under [[Using an Inbox System]] and [[Write Stub Notes]], areas to work on will emerge on their own by accumulating links and associative events, [[Passive Obsidian Worktime]] will address it.
		- I will still use my old system for [[Consuming and Choosing Content Effectively|content consumption]] management, using web clipper and all, but I will look at places where a piece of content can be *digested* and turned into an actual note, at which point I will move to atomic/thoughts/notes and give it the `class:note` ( while still keeping its old class )
- also another way to practice low intensity [[Passive Obsidian Worktime]] - digesting content I have here makes me do this by extension
- good way to turn slop into real ideation in general. i talk about applying to scrapbook property-only notes, but the same can be done for LLM chats stored as a resource.

## [[09-01-2026]] Rethinking Some Clippings

While I have been making excellent progress in the act of digesting my scrapbook ( key examples from just the past few days include [[FlyWire]], [[MouthPad]], [[OwnTracks]] ), I am starting to rethink where clippings should fit in. With these key examples, they are articles or projects that are their own self contained idea, that I can then write about later.

Even for papers, this works great, as papers here love being annotated. But in regards to youtube videos, it becomes a little more difficult, as the way I use youtube videos in the vault is usually as a supplemental to another atomic note representing a core idea. You will go to some youtube note, and then find the actual concept it talks about in the `related` property. In this sense, *digesting* the resource notes would just be to write in the linked note, even taking notes specifically in regards to that video would likely go in that linked note. So, in essence, it is impossible to digest these.

However, these still serve a lot of use, as oftentimes I find myself using the [[Youtube.base]] to search for videos in relation to topics. This is very flexible, as I can search by the author property, or the related property, or just use the tag system that is universal here. Also, at least for the [[Consuming and Choosing Content Effectively]] process, we use the `task` property to manage work we can do when we have nothing to do. However I do think this can be negated by just posting links in [[Using an Inbox System|inbox]] notes, which also manages concepts to learn. Still undecided, but if so will likely just begin moving video backlinks to URLs in the `source` property

## [[09-02-2026]] Digesting a Youtube Video

I think I was conflating *digesting* a clipping with *promoting* it into `Thoughts/Atomic`. Digesting a video does not require the video note itself to become an atomic note. It means deciding what role the video has in the vault and routing anything useful out of it.

A video note can remain in `Resources/youtube` even when I annotate it. This is the right place for source-specific comments: timestamps, memorable explanations, disagreements with the presenter, or relational observations such as how something Artem discusses connects to [[Neural Manifolds]] or another idea. These annotations make the resource easier to recover and evaluate, but do not necessarily change its identity: it is still primarily a note *about that video* and not the concept it duscusses.

If an observation advances my understanding of the related concept, I should also write the useful part in the concept note and link back to the video as its source. The video note then acts as a source record and retrieval object, while the atomic note holds the understanding I want to compound. I do not need to duplicate every annotation between them; only the idea that matters outside the context of the video needs to leave the resource note.

Moving the video note itself into `Thoughts/Atomic` makes sense only when my writing becomes independently worth revisiting as a thought: for example, a response to a philosophy video, a critique of its argument, a reconstruction of its model, or an idea organized around the video as a whole. At that point the note is no longer merely evidence that I watched something. It has become one of my notes, while retaining `class: video` and its original source metadata.

This gives video digestion a few possible endings:

- A video was only considered: keep it as a lightweight resource while it remains intentionally queued, or delete/drop it if it no longer deserves attention.
- A video was useful as a source: keep it in `Resources/youtube`, annotate it as lightly as useful, link its related concepts, and route transferable insights into those notes.
- My response became the main object: add `class: note` and move it into `Thoughts/Atomic`.
- I prune the video after finding it to never be touched or used. Pruning

Therefore folder location should follow what the note *is*, not whether I happened to write in it. A few relational comments do not require promotion. Digestion is complete once the useful material has a home and I have made an explicit decision about the source; `done` can represent that without implying that every video note must become an atomic note.
