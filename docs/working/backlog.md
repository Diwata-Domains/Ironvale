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

---

## 3. Phase 3 — Brand Components

**Goal:** Expand the component set with the pieces needed across Conclave, Apex, and diwata.domains, and integrate the Diwata brand theme from Aether.

### P3-T01 — Aether brand palette (tracked in Aether P6)
- **Status:** done
- **Dependencies:** Phase 2 complete, Aether Phase 6
- **Summary:** Aether now ships Crimson + Gold primitive scales, brand named tokens (`--ae-brand-*`), `[data-theme="diwata"]` canonical dark theme, and per-product theme files (`themes/conclave.css`, `themes/daemon.css`, `themes/diwa.css`).

### P3-T02 — Card component
- **Status:** done
- **Dependencies:** P3-T01
- **Summary:** `.iv-card`, `--base`/`--raised`/`--flush` variants. Replaces raw `.ap-card` / `.cp-card` class usage in apps.

### P3-T03 — Badge component
- **Status:** done
- **Dependencies:** P3-T01
- **Summary:** `.iv-badge`, intent variants (success/warning/error/neutral/info), tier variants (sovereign/adept/guild). Uses `color-mix()` for tinted backgrounds from semantic tokens.

### P3-T04 — NavItem component
- **Status:** done
- **Dependencies:** P3-T01
- **Summary:** `.iv-nav-item`, active state, icon slot. Replaces raw nav link CSS in both Apex and Conclave sidebar.

### P3-T05 — StatusDot component
- **Status:** done
- **Dependencies:** P3-T01
- **Summary:** `.iv-dot`, green/yellow/red/grey, sm/md/lg sizes, optional pulse animation. Replaces `.ap-dot--*` in Apex Services page.

### P3-T06 — Table component
- **Status:** done
- **Dependencies:** P3-T01
- **Summary:** `.iv-table`, compact + static variants, semantic React wrappers (Table, Thead, Tbody, Tr, Th, Td).

### P3-T07 — Spinner component
- **Status:** done
- **Dependencies:** P3-T01
- **Summary:** `.iv-spinner`, sm/md/lg sizes, all sizing via new `--ae-size-icon-*` and `--ae-border-width-*` tokens. Zero hardcoded px values.

### P3-T08 — Migrate Apex and Conclave to Ironvale components
- **Status:** ready
- **Dependencies:** P3-T02 through P3-T07
- **Summary:** Swap `.ap-*` / `.cp-*` raw CSS class usage in apps/apex and apps/conclave to Ironvale components.

### P3-T09 — Storybook: new components + brand theme switcher
- **Status:** ready
- **Dependencies:** P3-T08
- **Summary:** Add stories for Card, Badge, NavItem, StatusDot, Table, Spinner. Add toolbar theme switcher showing diwata/dark/conclave/daemon themes.

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
- **Status:** done
- **Dependencies:** P2-T01
- **Summary:** Create stories for Button, Text, Stack, Surface, and Input covering defaults, variants, sizes, and accessibility notes.

### P2-T03 — Document theming and adoption flow
- **Status:** done
- **Dependencies:** P2-T02
- **Summary:** Add Storybook or package-level docs for install order, token overrides, theming patterns, and plain-HTML plus React usage.
