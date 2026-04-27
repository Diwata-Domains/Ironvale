# Token Architecture
---
## Overview

The token system is the foundation of the design system. All styling must derive from tokens to ensure consistency, themeability, and scalability.

---
## Token Layers

### 1. Global Tokens (Raw Values)

Primitive values with no semantic meaning.

Examples:
- colors
- spacing scale
- typography scale
- radii
- shadows
- z-index
- motion durations

Rules:
- never used directly in components
- purely foundational

### 2. Semantic Tokens (Meaning-Based)

Abstract tokens representing intent.

Examples:
- background
- foreground
- border
- accent
- success
- warning
- danger

Rules:
- components should consume semantic tokens
- semantic tokens are themeable

3. Component Tokens (Scoped Overrides)

Component-specific tokens derived from semantic tokens.

Rules:
- used when components need specialization
- should fallback to semantic tokens

---
## Token Naming Convention

Format: 
    --iv-{category}-{role}-{variant}

Examples:
    --iv-color-bg-surface
    --iv-space-4
    --iv-button-bg-hover

## Token Categories

- color
- space
- size
- radius
- typography
- shadow
- z-index
- motion
- opacity

## Dark Mode Strategy

Override semantic tokens only:
[data-theme="dark"] {
  --iv-color-bg-surface: #111827;
  --iv-color-fg-default: #f9fafb;
}

Do not override global tokens unless necessary.

## Token Rules

1. No hardcoded values in components
2. Always prefer semantic tokens
3. Component tokens only when necessary
4. Maintain consistent naming patterns
5. Avoid duplication across layers