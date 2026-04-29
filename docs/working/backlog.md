# Backlog

**Project:** Ironvale
**Last updated:** 2026-04-27

Status values: `draft` | `ready` | `in_progress` | `blocked` | `done`

---

## 1. Phase 1 — Primitive Components

**Goal:** Ship a working component library with CSS class API and optional React wrappers for the five core primitives. All styling must derive from Aether semantic tokens.

### P1-T01 — Wire build pipeline and Aether token integration
- **Status:** done
- **Dependencies:** none
- **Summary:** Configure tsup for CSS + TS output, set `@diwata/aether` as peer dep, validate that importing `tokens/tokens.css` before `ironvale.css` resolves all `--ae-*` vars at runtime.

### P1-T02 — Write CSS reset and base styles
- **Status:** done
- **Dependencies:** P1-T01
- **Summary:** Write `src/base.css` with a minimal CSS reset (box-sizing, margin, font inheritance) and a `:root` block that sets base font-size and line-height from Aether type tokens.

### P1-T03 — Implement Button primitive
- **Status:** done
- **Dependencies:** P1-T01, P1-T02
- **Summary:** Write `src/components/Button/button.css` (`.iv-button`, `--primary`, `--ghost`, `--danger`, `--sm`/`--md`/`--lg`, disabled/busy states) and `Button.tsx` React wrapper. All values from Aether semantics only.

### P1-T04 — Implement Text, Stack, Surface, and Input primitives
- **Status:** done
- **Dependencies:** P1-T03
- **Summary:** Write CSS + React wrappers for Text (body/label/heading/caption), Stack (vertical/horizontal/wrap), Surface (base/raised/overlay), and Input (text/email/password/search).

### P1-T05 — Validate build output and token consumption
- **Status:** done
- **Dependencies:** P1-T04
- **Summary:** Run `pnpm build`; verify `dist/ironvale.css` and `dist/index.js` are emitted. Write a validation script that checks no hardcoded color/spacing/radius values exist in `dist/ironvale.css` — only `var(--ae-*)` references. Exit non-zero on violations.

---

## Under Consideration

- Storybook for each component (Phase 2 — documentation layer)
- Complex components: Dialog, Tabs, Dropdown, Tooltip, Table (Phase 2+)
- Ironvale Native (React Native / mobile) — Phase 3 toolkit item
- Brand-level CSS overrides per product (Prospects brand theme)

---

## 2. Phase 2 — Documentation Layer

**Goal:** Publish a usable documentation surface for the completed primitive set with Storybook, practical examples, and token override guidance.

### P2-T01 — Configure Storybook for Ironvale primitives
- **Status:** done
- **Dependencies:** P1-T05
- **Summary:** Add Storybook configuration, ensure Aether tokens and Ironvale CSS load in preview, and validate local Storybook startup/build.

### P2-T02 — Author primitive stories and usage notes
- **Status:** ready
- **Dependencies:** P2-T01
- **Summary:** Create stories for Button, Text, Stack, Surface, and Input covering defaults, variants, sizes, and accessibility notes.

### P2-T03 — Document theming and adoption flow
- **Status:** ready
- **Dependencies:** P2-T02
- **Summary:** Add Storybook or package-level docs for install order, token overrides, theming patterns, and plain-HTML plus React usage.
