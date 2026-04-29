# Plan: TASK-0003

## Approach

Implement Button as the first component pattern: CSS class API under `src/components/Button/button.css`, a typed presentation-only React wrapper under `Button.tsx`, and a barrel export from `src/index.ts`. Wire Button CSS into `src/ironvale.css` after base styles so the emitted CSS preserves layer order.

---

## Step 1 — Add Button CSS

Create `.iv-button` base, variant, size, disabled, and busy selectors using Aether `--ae-*` tokens for color, spacing, radius, and type values.

---

## Step 2 — Add React wrapper and exports

Create `Button.tsx` with typed `variant` and `size` props, merge caller `className`, and export Button from `src/index.ts`. Add React type tooling if needed for typecheck.

---

## Step 3 — Verify build output

Run `pnpm install` if dependency metadata changes, then run `pnpm build`, `pnpm validate`, and `pnpm typecheck`. Confirm Button classes are present in `dist/ironvale.css`.

---

## Verification

Confirm `dist/ironvale.css` includes `.iv-button` selectors after base CSS, all Aether token references are defined, and React wrapper types compile without `any`.
