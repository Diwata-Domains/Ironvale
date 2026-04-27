# System Architecture
---
## Overview

The system is structured in layered architecture to ensure scalability, composability, and reuse.

---
## Core Layers

### 1. Foundation

- tokens (color, spacing, typography, motion)
- CSS reset/base styles
- global variables

### 2. Primitives

Low-level building blocks:
- Button
- Input
- Text
- Stack/Grid
- Surface

Characteristics:
- minimal styling
- composable
- reusable across contexts

### 3. Components

Higher-level UI elements:
- Dialog
- Tabs
- Dropdown
- Tooltip
- Table

Built from primitives.

4. Patterns

Composed structures:
- form layouts
- dashboards
- filter panels
- navigation bars

Not part of core API, but documented.

---
## Package Structure (Conceptual)

- core-tokens
- core-styles
- components
- themes
- docs
- examples

## Styling Strategy

- CSS variables for all tokens
- optional Sass layer for generation
- low specificity selectors
- consistent class naming
- optional cascade layers

## DOM Philosophy

Each component follows:
- root element
- named slots (children)
- modifier classes
- state classes

No deeply nested selector dependency.

## Theming Model

- global tokens → semantic tokens → component tokens
- themes override semantic layer
- components consume semantic tokens

## Documentation Architecture

- Storybook as primary interface
- docs organized by:
    - foundations
    - tokens
    - components
    - patterns

## Distribution Model

- CSS bundle
- modular imports
- token exports
- optional JS helpers