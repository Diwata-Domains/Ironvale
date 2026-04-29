# Plan: TASK-0006

## Approach

Add the minimum Storybook runtime needed for Ironvale’s React wrapper surface using the current React+Vite framework, wire preview imports so Aether tokens and Ironvale source CSS load globally, and verify both `storybook dev` startup and `storybook build` output. Keep actual per-component stories out of scope for the next task.

---

## Step 1 — Add Storybook dependencies and config

Install the Storybook framework/tooling and create `.storybook/main.ts` plus `.storybook/preview.ts` so Storybook can discover future stories and load the package styling contract.

---

## Step 2 — Add a minimal docs entrypoint if needed

If Storybook requires at least one story to validate startup/build cleanly, add a minimal documentation-only story as a scaffold without expanding into the full primitive story set.

---

## Step 3 — Verify Storybook runtime

Run `pnpm storybook --smoke-test` if supported or otherwise boot the dev server briefly, then run `pnpm storybook:build` and keep `pnpm build`, `pnpm validate`, and `pnpm typecheck` green.

---

## Verification

Confirm Storybook can load Aether tokens plus Ironvale CSS through preview config, starts without config errors, and produces a static build successfully.
