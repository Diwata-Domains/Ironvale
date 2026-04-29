# Task: Write CSS reset and base styles

## Metadata
- **ID:** TASK-0002
- **Status:** done
- **Phase:** Phase 1 — Primitive Components
- **Backlog:** P1-T02
- **Packet Path:** tasks/P1-T02-TASK-0002/
- **Dependencies:** TASK-0001
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none

## Objective

Write `src/base.css` — a minimal CSS reset and root-level base styles that every Ironvale component will inherit. The file must use only Aether semantic tokens for any value that is token-expressible (font size, line height, background, text color). When `ironvale.css` is imported by a consuming app, these base styles are the first thing applied.

## Why This Task Exists

Without a shared reset, browser defaults (box-sizing, margin, font inheritance) introduce inconsistency across components. The base layer ensures every primitive starts from the same baseline. It is also the only place where document-level defaults from Aether tokens are applied.

## Scope

- Write `src/base.css` with:
  - `*, *::before, *::after { box-sizing: border-box; }`
  - `body` margin reset
  - Font stack defaulting to `var(--ae-font-family-base)` (or closest Aether semantic)
  - `font-size` from `var(--ae-text-size-base)`
  - `line-height` from `var(--ae-text-leading-base)`
  - `color` from `var(--ae-color-text-default)`
  - `background-color` from `var(--ae-color-bg-base)` on `:root` or `body`
- The reset must NOT define any component-level selectors (`.iv-*`)
- Import `src/base.css` in `src/index.ts` (or configure tsup to include it as CSS entry)
- Run `pnpm build` — verify `dist/ironvale.css` contains the reset rules

## Constraints

- No hardcoded values — every token-expressible property must reference `var(--ae-*)`
- Do not duplicate Aether's own `:root` block — only consume its variables, do not redefine them
- The base layer must be the first CSS in `dist/ironvale.css` (before any component CSS)

## Escalation Conditions

- If an Aether semantic token for a needed base property doesn't exist (e.g., no `--ae-font-family-base`), check `packages/aether/tokens/tokens.css` for the actual token name before assuming it's missing
- If Aether is missing the token entirely, raise a change proposal to Aether rather than hardcoding a fallback
