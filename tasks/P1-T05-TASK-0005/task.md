# Task: Validate build output and token consumption

## Metadata
- **ID:** TASK-0005
- **Status:** done
- **Phase:** Phase 1 — Primitive Components
- **Backlog:** P1-T05
- **Packet Path:** tasks/P1-T05-TASK-0005/
- **Dependencies:** TASK-0001, TASK-0002, TASK-0003, TASK-0004
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none

## Objective

This is the Phase 1 gate. Validate that `dist/ironvale.css` contains no hardcoded values (no hex, rgb, hsl, or px-literal spacing/radius outside `var()`) and that all `var(--ae-*)` references correspond to tokens defined in `@diwata/aether/tokens/tokens.css`. Run `pnpm validate` — it must exit 0. Fix any violations found before closing.

## Why This Task Exists

Phase 1 closes only when the enforcement contract is proven: every component value traces back to an Aether token. Without this gate, drift can accumulate silently. The same validation script also becomes the CI check going forward.

## Scope

- Complete the `scripts/validate-tokens.mjs` stub from TASK-0001 with two checks:
  1. **Hardcoded value check** — scan `dist/ironvale.css` for bare hex colors (`#...`), `rgb()`, `rgba()`, `hsl()`, and hardcoded spacing/radius px values not inside a `var()` call. Report each violation with line number.
  2. **Dangling reference check** — extract all `var(--ae-*)` references from `dist/ironvale.css`; load `packages/aether/tokens/tokens.css` (via relative path from the ironvale root); confirm every referenced `--ae-*` name is defined. Report any undefined references.
- The script exits 0 only if both checks pass
- Add `"validate": "node scripts/validate-tokens.mjs"` to `package.json` (may already exist from TASK-0001)
- Fix any violations found — do not just report and skip
- If more than 5 dangling references are found, flag to the user before fixing (may indicate Aether is missing a whole token category)

## Constraints

- No external dependencies in `validate-tokens.mjs` — Node.js built-ins only (`fs`, `path`)
- The script must resolve the Aether tokens path relative to the package root, not an absolute path
- Do not weaken the check by adding allowlist exclusions without flagging to the user first

## Escalation Conditions

- If more than 5 dangling `--ae-*` references exist in the output, flag them all before proceeding — may indicate a gap in Aether Phase 2 theming
- If the tsup build cannot produce a single `dist/ironvale.css` concatenating all component CSS, flag the build approach as blocked and propose an alternative
