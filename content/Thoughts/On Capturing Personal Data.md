---
class:
  - note
tags:
  - cs/data-science
  - cs/homelab/data
  - comp-neuro
  - journal
  - OCD
  - tree
source:
related:
author:
date: 2025-10-08
updated: 2026-09-09T15:42:30-04:00
aliases:
  - Quantified Self
---

While working on a project for my class [[Brainstorming Data Science Temporal Project]], I had the opportunity to sit down and actually view the data that I had been collecting in my vault without really thinking about it. This vault contains notes yes, but also structured data for **videos** I watch,

---

## Longevity

The start of this obession came with the idea of perfecting my life as if it was parameterized by latent variables for which I could not observe. This was simple enough at first, tracking things like air quality using a [[Home Assistant]] device called the [[AirGradient ONE]]. This would just give me basic, single dimensional sample which I could use to retune the parameters of my environment.

But the dreams of [[Mutual Information]] soon took over. Dreams of cross correlating air quality with things like say, a sleep score from a [[Garmin Venu 4]] watch gave the promise of double the information, but exponentially more insight. The inherent richness of the multi dimensional data could drive me down a rabbit hole of ML models for tuning my life. This was also motivated by the idea of high frequency immediate feedback, where methods/changes could be tested in rapid iteration and the results observed immediately. This mirrored workflow ideals I had garnered from the software engineering world, but also through the [[3d Printing]] process.

## Mind Mapping

This is much more in line with both the fundamental purpose of obsidian, but also my ventures into understanding the nature of [[Consuming and Choosing Content Effectively|content consumption]] and domains of [[Computational Neuroscience]]

This also includes physical sensors to provide that mutual information seen above. An obvious pairing with [[ActivityWatch]] would be some kind of [[Using an Eye Tracker for more computer data|eye tracker]] like the [[Tobii Eye Tracker 5]], but the real cream of the crop would come from combining this with an EEG headset (maybe [[BrainAccess HALO]] ) as a means to denoise the signal when filtered via meaningfull eye capture.

While quite an unrealistic idea, I also often have dreams of a world in which I could perform the same kind of parameter tuning to "descend the gradient" of my own mind for learning/habit optimization. Quite unlikely given todays modeling capabities, but I view this as a "store now decrypt later" kind of problem. If I can capture all the data about my mind wandering now, it is possible I would have the tools later in my research career to extract meaningfull output.

---

## Data Sources

To satiate my OCD desires, I think it best to compile a list of all data ventures planned and already doing, serving as an entry point to

### Health Data

#### Wearable

[[Garmin Venu 4]] is the baseline passive wearable layer: heart rate, sleep, activity, stress proxies, Body Battery, and recorded activity GPS. For protocol-grade cardiac data during workouts, EEG sessions, or cognitive experiments, [[Polar H10]] is a better ground-truth instrument than wrist optical HR.

#### Body Scan

There are also health biomarker systems that track a lot more, but are not low delta timeseries data that wearables provide. They often take the form of a scale. The one that I have been looking at, while a bit contraversial in some cases, is the [[Withings Body Scan]] system. Beyond body composition data, it also measure nerve heatth and many other biomarkers.

##### [[01-10-2026]] Update - New Withings Scale

The [[Withings Body Scan 2]] was just announced, a big upgrade for [[Longevity]] tracking. Instead of getting bodyscan Ill just wait for this to release. I do not have this yet, however am considering despite some of the debates about its efficacy.

#### Air Quality

Using an [[AirGradient ONE]] with [[home assistant]]. Data is already collected by the server, so this is easy to integrate.

#### Campaign Devices

The next useful additions should add new explanatory axes without demanding a high-friction ritual. Possible extensions, although diminishing returns and I like my money so....

[[Polar H10]] is the cardiac ground-truth device. Use it for workouts, EEG sessions, cognitive experiments, and validation against Garmin optical heart rate. It is not another always-on wearable; it is a protocol instrument.

[[OMRON 3 Series Upper Arm Blood Pressure Monitor]] is the cheap, reliable blood-pressure layer. Blood pressure is clinically meaningful, not inferable from Garmin, and useful in short morning/evening campaigns or around interventions.

[[Dexcom Stelo]] is the glucose campaign tool. It should be used for a bounded 2 to 4 week period to learn meal, sleep, exercise, and stress responses, then stopped until there is another concrete question.

### Brain Data

#### EEG

Would likely use something like the [[Ultracortex "Mark IV" EEG Headset]] to record my own data. I compiled some useful information about this + some aliexpress addons under [[Exploring Personal EEG Solutions]].

On further thought, I have decided that this too expensive given the quality of the parts. Yes, OpenBCI is the most trusted in the game, but 600 for the [[Electrodes]], another 350 for the analog chip on ali express, and it gets out of hand. Likely will stick wtih something simpler like a [[BrainAccess HALO]].

#### Eye Tracking

Could use the [[Tobii Eye Tracker 5]] as another source of attention in correlation with [[ActivityWatch]]. Dot product could be computed to

### Online Data and Internet Exports

The crux of the *input* to my mind. In addition to manual takeouts/data requests, we can also use tracking services like [[ActivityWatch]] to collect timeseries data as we go by. I document this under [[Tracking EVERYTHING I do on my computer]].

#### [[ActivityWatch]] Plugins

[[ActivityWatch]] itself is quite extendable

#### Youtube / Google

Can use **Google Takeout** to extract your data, but some web scraping like [[Scraping My Youtube History]] will work as well.

#### Browsing History

Firefox stores all this data locally in a file called `places.sqlite`, not too hard to get. 

Given that I have [[ActivityWatch]] set up now, this seems to do a better job of caputuring the high frequency nature of browsing activity (switching between a lot of tabs really quickly), and it has a firefox extension for more detailed history. I will still keep the places.sqlite file as a backup/general purpose for all the content before I set it up, but this will be the primary method from now on.

#### Agent Harness Activity

These are becoming very very common in most workflows, and thus carry a significant pedigree of information about what we are thinking/doing. I have done a lot with memory systems in the past, many require a lot of expensive inference for extracting useful information.

For now living by the [[Store Now Utilize Later]] philosophy, the best thing to do is have every sesion create a durable fragment summary of what was done that session and *where/when* it was done. Doing it then has the advantage of KV cache hits, and allows for later use agents looking for meaningful sessions. These fragments serve as RAG-queryable maps of each session, meaning later content/topic extraction can be done efficiently ( when the reconsolidation model understands WHERE things happens it uses more scoped tool calls on the transcript ).

#### Instagram

#### Spotify

Spotify has an option for this on the privacy section of their website: <https://www.spotify.com/us/account/privacy/>

I have requested the data, it should hopefully take no longer than 30 days.

- [[Get requested spotify data]]

#### Discord

This one was easy enough. I have used a tool in the past called [[DiscordChatExporter]] which allows you to select channels to export from.

#### Location Data

This is under online data because the best passive location source is the iPhone, using [[OwnTracks]] with [[Home Assistant]] for coarse geofenced place episodes. This will hopefully turn out very intereststing, as a lot of things can be cross referenced with location for novel findings. I document setting up this idea under [[Capturing my Phones Location Data]]

[[Garmin Venu 4]] should remain the activity-GPS source: recorded runs, walks, rides, and exportable activity tracks that can be graphed with [[garmin-grafana]], not the primary 24/7 place-context recorder.

### Self Reported Data

This is all stuff obsidian, but there is an issue at hand. For one, a lot of the data I record here are just extracts from **Online Data**. In the future, I want to find a way to merge these two data sources together, without crashing my obsidian in an instant. 

- [[05-23-2026]] had some philosophical qualms with this as of late, see [[On Self Reported Data]]
- [[05-26-2026]] addressed these qualms with [[Self reported data via phone app]]

#### Obsidian Daily Notes

The best spot for self reported data aggregation, mostly semantic but also has a checklist and some rudimentary front matter to fill out. In all honesty, there isnt that much numerical data to self report that Iwouldn'tt just be using a tool for anyway. This would mostly be for relationship management and semantic data tracking.

Some external options have been around like [exist.io](https://exist.io/), but I think I can honestly integrate that into obsidian with the daily note system. I updated the [[daily note template]], but I dont want to add too much that I'll just end up tracking with the [[health]] data.

>[!Warning] Updates
> I have taken some time to do some [[Private/Garden Tending|Garden Tending]] on the workflow, and have changed the structure of the [[daily note template]]. While I did say I didnt want to add too much, I sort of changed my mind, and added a **bunch** of yaml properties in place of the old everyday checklist. This also has options besides checkboxes, for thinkgs like exact wakeup/bedtime and meal choices ( which can be links to meal notes I have prepared, eg [[Super Veggie]])

#### Financial Tracking

I do this with [[Hledger docs|hledger]], but luckily this is still inside of the obsidian vault so no consolidation needs to be done. It is plain text, and thus no fancy work needs to be done to track this in accordance wtih all my other stuff. 

It would be nice to integrate this better into a database format for cross referencing, but this woudl require that I use [[Hledger docs|hledger]] more often, as right now the only thing I use it for is my college expenses.

##### [[01-09-2026]] Update - Obsidian Solution

While Hledger has been great for a lot of things in the short term, it wasnt exactly cut out for my purpose. It was simultaneously far too complex and feature rich, having actual accountants in mind as the user base, but the interface itself was also limiting in its platform compatability. I am all for command line interfaces, but this required something closer to my personal life.

With obsidian bases and a few templating plugins, I created a drop in replacement that has the exact same prompts as [[Hledger docs|hledger]], but as obsidian notes. [[Transactions.base]] now handles this for me.

---

## Checklist

- [x] air quality
- [x] wearable
- [x] instagram
- [x] youtube - SEMI DONE
- [x] spotify
- [x] discord
- [x] browser 

---

## Data Aggregation

There are a lot of options here, all of which will likely involve Homelab + Obsidian. But, given the complexity of how much data I will have around, I think the best choice is to have a **MonoRepo** using **Git** and **DVC**(data version control) to manage all the different data source I have there. With the monorepo architecture, it would be easy to handle processing and whatnot when I please, maybe adding to [[Grafana]] and other visualization tools.

This is begginging to be designed under [[Setting up a sort of Monorepo for personal data]], namely splitting the data from the stuff we collect automatically (air quality,)

**Claude Idea:**

<https://claude.ai/chat/6a037e65-1106-448c-b45b-57d6898cc5cc>
