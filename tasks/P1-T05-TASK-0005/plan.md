# Plan: TASK-0005

## Approach

Strengthen the existing `validate-tokens.mjs` script so it enforces the full Phase 1 contract on emitted CSS: no hardcoded colors, no hardcoded px spacing/radius values outside `var()`, and no dangling `var(--ae-*)` references. Then rebuild and rerun validation against the current primitive set.

---

## Step 1 — Tighten validator checks

Add a px-literal scan with line reporting and preserve the existing color-function and dangling-reference checks.

---

## Step 2 — Rebuild and validate emitted CSS

Run `pnpm build` so `dist/ironvale.css` reflects the current primitive set, then run `pnpm validate` and `pnpm typecheck`.

---

## Step 3 — Confirm Phase 1 gate behavior

Inspect the emitted CSS and validation output to confirm that the primitive set passes the stricter enforcement gate without allowlists or weakened rules.

---

## Verification

Confirm `pnpm validate` exits 0, reports the number of checked Aether references, and would fail on hardcoded hex/rgb/hsl or px literals if introduced.
