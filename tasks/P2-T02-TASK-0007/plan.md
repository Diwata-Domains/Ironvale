# Plan: TASK-0007

## Approach

Use Storybook’s existing React+Vite setup to add one story module per primitive under `src/stories/`, keeping the stories close to the exported React wrappers while documenting the CSS-first API they represent. Cover default rendering first, then add targeted stories for each component’s variants or layout states, and use docs parameters/description fields for concise accessibility and usage guidance instead of expanding into full adoption documentation.

---

## Step 1 — Audit primitive props and current Storybook entrypoint

Inspect each primitive wrapper and the temporary `Introduction.stories.tsx` scaffold so the new stories match the actual public API, naming, and supported variants without inventing behavior.

---

## Step 2 — Author primitive story files

Create Storybook stories for Button, Text, Stack, Surface, and Input that show the default state plus key variants, sizes, or directional layouts where applicable. Include concise accessibility or usage notes in docs metadata so each story communicates when to use the primitive and what consumers must supply, such as labels for form inputs.

---

## Step 3 — Verify Storybook and package health

Run Storybook build and the package validation commands to confirm the new story files compile cleanly and do not regress the existing build, token validation, or type surface.

---

## Verification

Confirm Storybook discovers all new primitive stories, renders each primitive without prop/type errors, and that `pnpm storybook:build`, `pnpm build`, `pnpm validate`, and `pnpm typecheck` complete successfully.
