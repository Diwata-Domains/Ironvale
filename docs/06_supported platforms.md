# Supported Platforms
---
## Overview

The library is designed to work across a wide range of environments due to its CSS-first architecture.

---
## Tier 1 — First-Class Support

These environments are actively supported and tested.

Core
- HTML + CSS + JavaScript

Frameworks
- React
- Next.js
- Vue
- Svelte
- Astro
- Tooling
- Storybook

## Tier 2 — Fully Compatible

Supported through standard CSS usage but not deeply integrated.
- Nuxt
- Remix
- Angular
- SvelteKit

Server-rendered frameworks
- Django (Jinja templates)
- Flask (Jinja)
- Rails (ERB)
- Laravel (Blade)
- Phoenix (HEEx)

Static site generators
- Eleventy
- Hugo
- Jekyll

## Tier 3 — Compatible but Not Primary Focus

- Web Components (Lit, custom elements)

- Electron apps

- Browser extensions

---
## Compatibility Principles

1. No dependency on runtime frameworks
2. CSS must function independently
3. Minimal assumptions about DOM structure
4. No reliance on build tools for basic usage

---
## Integration Modes

1. Direct CSS Usage

- Import CSS file
- Use classes directly in markup

2. Component Wrappers (Optional)

- React/Vue wrappers
- Not required for core usage

3. Token Consumption

- Use CSS variables directly
- Override at root or scoped level