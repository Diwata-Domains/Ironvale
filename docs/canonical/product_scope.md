# Product Scope — Ironvale

## Mission

Ironvale is a CSS-first, framework-agnostic component library for the Diwata stack. It provides composable UI primitives built entirely on Aether semantic tokens — no hardcoded values, no framework lock-in. A single CSS bundle and optional React wrappers make it consumable in any HTML, server-template, or JS framework context.

## Primary Consumer

- **Prospects** (`products/prospects/`) — React + FastAPI CRM; first app to run on Ironvale
- Future Diwata apps share the same library as a pnpm workspace dependency

## Token Dependency

Ironvale does not own a token layer. All styling derives from Aether semantic tokens (`@diwata/aether`). Aether must be installed and its `tokens/tokens.css` imported before Ironvale's CSS.

```
┌──────────────┐     consumes      ┌──────────────────────┐
│   Ironvale   │ ─────────────────▶│  Aether (semantic)   │
│  components  │                   │  --ae-color-bg-base  │
│    .css      │                   │  --ae-text-default   │
└──────────────┘                   └──────────────────────┘
```

## Goals

- Ship a complete CSS class-based API for each primitive (Button, Text, Stack, Surface, Input)
- Components consume only Aether semantic tokens — no inline values, no primitive references
- Framework-agnostic: works with plain HTML, React, Vue, Django templates, Jinja
- Optional React wrappers (typed props → class strings) exported from `src/index.ts`
- Storybook documents every component and variant

## Non-Goals

- Ironvale does not define primitive or semantic tokens (those live in Aether)
- No JS logic or state management — components are presentation only
- No design editor integration or Figma tokens in Phase 1
- No mobile/native targets in Phase 1 (Ironvale Native is a Phase 3 toolkit item)
- No animation or motion system in Phase 1

## Scope Boundaries

| In Scope | Out of Scope |
|----------|-------------|
| CSS class-based component API | JS state management |
| Aether token consumption | Defining tokens (owned by Aether) |
| Button, Text, Stack, Surface, Input primitives | Complex components (Dialog, Tabs, Table) |
| React wrapper components | Vue / Angular / Svelte adapters |
| tsup build pipeline | Vite / Webpack integration |
| Storybook documentation | Figma / design tooling |
| Dark theme via `[data-theme="dark"]` | Animation / motion tokens |

## Versioning

Ironvale starts at `0.0.1`. API stability is not guaranteed until `1.0.0`. Breaking changes follow semver.
