# Plan: TASK-0001

## Approach

Create the minimum buildable Ironvale package foundation: TypeScript configuration, an empty package entrypoint, a CSS entry that can emit `dist/ironvale.css`, package exports/scripts aligned with the canonical architecture, and a Node-only token validation script. Verify Aether token availability through the workspace dependency and keep component implementation out of scope.

---

## Step 1 — Configure package build contract

Update package metadata so `pnpm build` emits ESM JavaScript, declarations, and a CSS bundle location that matches the canonical export contract. Add required dev tooling to the package manifest.

---

## Step 2 — Add source and validation scaffolding

Create `tsconfig.json`, `src/index.ts`, `src/ironvale.css`, `scripts/build-css.mjs`, and `scripts/validate-tokens.mjs`. The CSS entry should contain only a build sentinel for now because base/components are implemented in later tasks.

---

## Step 3 — Verify build and token integration

Run package install if needed, then run `pnpm build` and `pnpm validate`. Add a smoke-test HTML file showing the required import order for Aether tokens before Ironvale CSS.

---

## Verification

Confirm `dist/index.js`, `dist/index.d.ts`, and `dist/ironvale.css` are emitted. Confirm validation exits 0 and can read Aether's local `tokens/tokens.css`. Confirm no Phase 1 primitives are implemented in this task.
