# Task: Wire build pipeline and Aether token integration

## Metadata
- **ID:** TASK-0001
- **Status:** done
- **Phase:** Phase 1 — Primitive Components
- **Backlog:** P1-T01
- **Packet Path:** tasks/P1-T01-TASK-0001/
- **Dependencies:** none
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none

## Objective

Configure Ironvale's build pipeline with tsup and validate that `@diwata/aether` token consumption works end-to-end. The task is done when `pnpm build` produces `dist/ironvale.css` and `dist/index.js`, and a smoke-test HTML file confirms that Aether semantic tokens resolve correctly when both CSS files are imported in order.

## Why This Task Exists

Ironvale has no build output yet. Before any component can be written and consumed, the pipeline must be in place and the Aether token dependency must be proven to work at runtime. Every downstream task in Phase 1 depends on this being correct.

## Scope

- Update `package.json`:
  - Add `@diwata/aether: "workspace:*"` as a `peerDependency`
  - Add `"validate": "node scripts/validate-tokens.mjs"` script
  - Confirm `"build": "tsup src/index.ts --dts --format esm"` is present
- Add `tsconfig.json` if not present — target `ES2022`, module `NodeNext`
- Create `src/index.ts` as an empty barrel (will gain exports in TASK-0003/0004)
- Create `scripts/validate-tokens.mjs`:
  - After build, reads `dist/ironvale.css`
  - Finds any raw hex (#rrggbb), rgb(), rgba(), hsl() values
  - Reports them as violations (no hardcoded color values allowed — only `var(--ae-*)`)
  - Exits non-zero if any violations found
- Run `pnpm build` — confirm `dist/` is created with both output files
- Write `smoke-test.html` at the root of the package that imports both CSS files and renders a `<div>` with a known Aether token as `background-color` — open in browser to confirm the token resolves

## Constraints

- `@diwata/aether` must be `peerDependencies`, not `dependencies` — consumers are responsible for installing it
- Do not add style injection via JS — CSS is imported by the consuming app, not bundled into JS
- `scripts/validate-tokens.mjs` must use only Node.js built-ins — no external packages

## Escalation Conditions

- If tsup cannot emit a standalone CSS bundle from CSS imports, document the exact error and propose an alternative approach (e.g., postcss-concat) before proceeding
- If `@diwata/aether` is not resolvable in the workspace, check that the monorepo's `pnpm-workspace.yaml` includes `packages/*`
