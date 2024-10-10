---
date: 2024-10-03
tags:
  - python
---
I have recently started to like using ipython to do a lot of things I used to use tools like Jupyter, Desmos, and Mathematica for. And through this, I have found a powerful new tool to add to my collection.

## The Beauty Of the Command Line

I have always been someone who loves to do everything through the terminal. With the way I interact with my computer primarily being the keyboard(I try to refrain from using the mouse), the cli always ends up being the fastest way to do things. 

For this reason, I loved programs like [[Neovim]] as my idea, as I am able to work at a speed I could only dream of a few years back.

But the biggest pitfall has always been interactive python development, with things like Jupyter Notebooks.

---

## The pitfall of Text Buffers

Neovim, despite being easily one of the most customizable IDE's there are, is still only a text buffer. And even with programs like Neovide which seek to fix this pitfall, there are some GUI-related things it cannot do easily. 

The thing that this has hurt the most for me, has been Jupyter Notebooks. As someone who is very much in the world of [[Artificial Intelligence|AI]] and Deep Learning, Jupyter is the standard for combining research with production code. It allows us to blend markdown and annotations into our code, but also provides a more streamlined interpreter experience with python. 

---

## How iPython fits into this

iPython, while still only being a text buffer, allows me to keep this interpreter conversation style within the terminal. 

### But Ewan, how does this fix Jupyter Problem?

*Doesn't this mean it has the same problem that you had before, and you cant really blend your code the same way?*

Well, yes, but not really. The simplicity of the ipython interface means I can just embed the command log as a python code block. This, in combination with the Code Runner extension, mean I can make powerfull scientific notes within my code projects.

```python
[ins] In [1]: import random

[ins] In [2]: x = random.randint(1, 100)

[ins] In [3]: x
Out[3]: 63

[ins] In [4]: y
-----------------------------------------------------------------
NameError                                 Traceback (most recent call last)
Cell In[4], line 1
----> 1 y

NameError: name 'y' is not defined

[ins] In [5]: 
```

---

## Doing math with iPython

The thing that sealed the deal for me was one iPython extension: Copilot.

Copilot for iPython meant I could essentially have an Ai-assisted CLI(without wierd proprietary terminals, *cough cough* warp) in conjunction with a python interpreter. 

Since you can easily run shell commands while still in an iPython session, this serves as a great way for me to quickly do programming tasks that I realistically don't need to plan out - something like solving a calculus problem.

Now, I can solve an integral easily and quickly in the command line:

```python
[ins] In [1]: # setup integrand

[nav] In [2]: integrand = sym.cos(2*x)**2 + sym.sin(4*x)**3

[ins] In [3]: result = sym.integrate(integrand, x)

[ins] In [4]: result
Out[4]: x/2 + sin(2*x)*cos(2*x)/4 + cos(4*x)**3/12 - cos(4*x)/4
```