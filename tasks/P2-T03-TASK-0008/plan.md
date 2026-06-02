# Plan: TASK-0008

## Approach

Use Storybook as the delivery surface for adoption guidance so the documentation lives next to the primitive stories it references. Create a guide page that explains import order, theme activation, token override patterns, and both plain-HTML and React usage, using examples that match the current package exports exactly.

---

## Step 1 — Resolve the actual package contract

Cross-check the Aether and Ironvale package exports plus existing canonical docs so all example code uses the real import paths and theme toggles rather than stale architecture examples.

---

## Step 2 — Author adoption and theming docs

Add a Storybook docs page that covers installation order, CSS import order, plain-HTML class usage, optional React wrapper usage, dark-theme activation, and safe token override examples.

---

## Step 3 — Verify story discovery and package health

Run Storybook static build plus package build, validation, and typecheck to confirm the new documentation page compiles and does not regress the package.

---

## Verification

Confirm Storybook renders the new adoption guide, the code examples match real export paths, and `pnpm storybook:build`, `pnpm build`, `pnpm validate`, and `pnpm typecheck` all succeed.
