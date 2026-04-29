# Plan: TASK-0004

## Approach

Implement Text, Stack, Surface, and Input by copying the Button task pattern: one CSS file plus one typed presentation-only React wrapper per primitive, imported into `src/ironvale.css` after Button. Keep every token-expressible value on `var(--ae-*)`, and only deviate where the task requests behavior that Aether does not currently model semantically.

---

## Step 1 — Add CSS primitives

Create `text.css`, `stack.css`, `surface.css`, and `input.css` with the requested base classes, variants, and states using Aether semantic tokens.

---

## Step 2 — Add typed wrappers and exports

Create `Text.tsx`, `Stack.tsx`, `Surface.tsx`, and `Input.tsx`, then export them from `src/index.ts`. Use simple typed polymorphism where needed and keep wrappers presentation-only.

---

## Step 3 — Verify emitted package output

Run `pnpm build`, `pnpm validate`, and `pnpm typecheck`. Confirm all primitive selectors appear in `dist/ironvale.css`.

---

## Verification

Confirm `dist/ironvale.css` contains `.iv-text`, `.iv-stack`, `.iv-surface`, and `.iv-input` selectors, that all Aether token references are defined, and that TypeScript declarations emit successfully for the new wrappers.
