# Architecture — Ironvale

## Layer Model

```
Layer 0 — Aether tokens (external — @diwata/aether)
  tokens/tokens.css: --ae-* primitive and semantic custom properties

Layer 1 — CSS Reset + Base  (src/base.css)
  Normalize, box-sizing, root font

Layer 2 — Primitives  (src/components/*)
  Button, Text, Stack, Surface, Input
  Each: single CSS file + optional React wrapper

Layer 3 — Package bundle  (dist/)
  ironvale.css (all layers merged via tsup CSS bundle)
  index.js / index.d.ts (React wrapper re-exports)
```

## Token Consumption Rules

- Components reference **only Aether semantic tokens** (`--ae-*`)
- Primitive tokens (`--ae-primitive-*`) must never appear in component CSS
- If a design decision cannot be expressed with existing semantic tokens, raise a change proposal to Aether — do not hardcode a value

## CSS Class API Pattern

Every component exposes a **BEM-style class API**. Class names use the `iv-` prefix.

```css
/* Base */
.iv-button { ... }

/* Variants */
.iv-button--primary { ... }
.iv-button--ghost   { ... }
.iv-button--danger  { ... }

/* Sizes */
.iv-button--sm { ... }
.iv-button--md { ... }  /* default */
.iv-button--lg { ... }

/* States */
.iv-button[disabled]     { ... }
.iv-button[aria-busy]    { ... }
```

HTML usage (no framework required):

```html
<button class="iv-button iv-button--primary iv-button--sm">Save</button>
```

## React Wrapper Pattern

Optional typed wrappers live in `src/components/{name}/{name}.tsx`. They accept typed props and render the corresponding HTML class string — no internal state.

```tsx
// src/components/Button/Button.tsx
export function Button({ variant = 'primary', size = 'md', children, ...props }) {
  return (
    <button
      className={`iv-button iv-button--${variant} iv-button--${size}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Component Inventory — Phase 1 Primitives

| Component | CSS file | React wrapper | Variants |
|-----------|----------|---------------|----------|
| Button | `src/components/Button/button.css` | `Button.tsx` | primary, ghost, danger |
| Text | `src/components/Text/text.css` | `Text.tsx` | body, label, heading, caption |
| Stack | `src/components/Stack/stack.css` | `Stack.tsx` | vertical, horizontal, wrap |
| Surface | `src/components/Surface/surface.css` | `Surface.tsx` | base, raised, overlay |
| Input | `src/components/Input/input.css` | `Input.tsx` | text, email, password, search |

## Package Exports

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./ironvale.css": "./dist/ironvale.css"
  }
}
```

Consumer import:

```tsx
// In app entry point — order matters
import '@diwata/aether/tokens/tokens.css';
import '@diwata/ironvale/ironvale.css';

// Optional React wrappers
import { Button, Text } from '@diwata/ironvale';
```

## Build Pipeline

- **tsup** bundles `src/index.ts` → `dist/index.js` + `dist/index.d.ts`
- CSS files are concatenated into `dist/ironvale.css` (base first, then components alphabetically)
- `"build"` script: `tsup src/index.ts --dts --format esm`
- CSS bundling: tsup injects CSS via `injectStyle: false` + a postcss step, or a manual concat. Exact approach: TBD in TASK-0001.

## Storybook

Storybook is the living documentation layer. Every component has at minimum:
- Default story
- All variant stories
- Keyboard / accessibility notes in the story description

Storybook runs independently of the main build — it reads source CSS directly.

## Dark Mode

Dark mode follows Aether's pattern. No Ironvale-specific token overrides are needed as long as Aether's dark theme is active. Components automatically flip because they consume only semantic tokens.

```html
<!-- In consuming app -->
<body data-theme="dark">
  <!-- All Ironvale components automatically use dark semantic values -->
</body>
```

## Directory Layout

```
packages/ironvale/
├── src/
│   ├── base.css                          # Reset + root base
│   ├── index.ts                          # React wrapper re-exports
│   └── components/
│       ├── Button/
│       │   ├── button.css
│       │   └── Button.tsx
│       ├── Text/
│       │   ├── text.css
│       │   └── Text.tsx
│       ├── Stack/
│       │   ├── stack.css
│       │   └── Stack.tsx
│       ├── Surface/
│       │   ├── surface.css
│       │   └── Surface.tsx
│       └── Input/
│           ├── input.css
│           └── Input.tsx
├── dist/                                 # Build output (gitignored)
├── docs/                                 # Pre-existing product docs
├── package.json
└── tsconfig.json
```
