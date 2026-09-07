---
date: 2024-12-28
updated: 2026-08-06T09:25:44-07:00
tags:
  - OCD
  - seed
title: Tech Stacks
---

I am no web developer, but when I am going to do web development, I would prefer to use one of the following to make my UI's work.

> [!Warning] Database Choice
> I will probably go with [Turso](https://turso.tech/) if I am doing some sqlite stuff, [MongoDB](https://www.mongodb.com/) for Document database stuff, and [Valkey(redis alternative)](https://github.com/valkey-io/valkey) for high speed in memory db, although this could change.

---

## RAW HTML / HTMX Tech Stacks

### Golang + HTMX + Echo + Templ ( And Alpine Js if Needed)

**Links**:

- [Alpine.js](https://alpinejs.dev/)
	- Lightweight frontend js utilities
- [Templ](https://github.com/a-h/templ)
	- Template engine for Golang
- [HTMX](https://htmx.org/)
- [Echo ( for golang)](https://echo.labstack.com/)
	- enhanced http web framework
- And Golang of course

### Rust + HTMX + Axum + Askama ( And Alpine Js if Needed )

**Links**:

- [Alpine.js](https://alpinejs.dev/)
	- Lightweight frontend js utilities
- [Askama](https://github.com/rinja-rs/askama)
	- Template engine for Rust
- [Axum](https://github.com/tokio-rs/axum)
	- enhanced web framework
- [HTMX](https://htmx.org/)
- And Rust of course

---

## Svelte Version

I am not the biggest fan of javascript frameworks, but this one is okay and I am happy to use if needed.

### Svelte + Axum

Similar to rust stack above, just that it uses svelte for the frontend.

https://github.com/jbertovic/svelte-axum-project

### Maybe - Python With Flask

I don't use python in production like this, only as a testing/data science tool, but this might be usefull if I am doing something with machine learning or other, and want a simple frontend for a python app.

**It might also just be simpler to host a api with python as a backend and svelte at the front.**
