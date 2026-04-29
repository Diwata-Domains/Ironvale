# Plan: TASK-0002

## Approach

Add a minimal CSS reset and document-level base styles in `src/base.css`, consuming only Aether semantic tokens for token-expressible values. Wire `src/base.css` as the first import in `src/ironvale.css` so the existing CSS bundler emits reset/base rules before future component CSS.

---

## Step 1 — Add base CSS

Create `src/base.css` with box sizing, body margin reset, font inheritance for controls, and document font/color/background values sourced from Aether semantic tokens.

---

## Step 2 — Wire CSS bundle order

Update `src/ironvale.css` so `base.css` is imported before the Ironvale layer placeholder and any future component imports.

---

## Step 3 — Verify output

Run `pnpm build`, inspect `dist/ironvale.css`, then run `pnpm validate` and `pnpm typecheck`.

---

## Verification

Confirm `dist/ironvale.css` contains the reset rules before any component CSS, contains no `.iv-*` selectors, and references only defined Aether `--ae-*` tokens for token-expressible values.
