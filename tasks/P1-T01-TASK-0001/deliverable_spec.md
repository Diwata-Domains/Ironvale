# Deliverable Spec: TASK-0001

## Required Output

### New Files
- `tsconfig.json` — TypeScript config for ESM package output and React JSX typing support.
- `src/index.ts` — package barrel and CSS import entrypoint.
- `src/ironvale.css` — CSS bundle entry file for future base/component imports.
- `scripts/build-css.mjs` — Node-only CSS bundle copy step for `dist/ironvale.css`.
- `scripts/validate-tokens.mjs` — Node-only validation for emitted CSS and Aether token references.
- `smoke-test.html` — manual token import-order smoke test.
- `results.md` — execution summary and validation results.
- `handoff.md` — review handoff.

### Modified Files
- `package.json` — build scripts, exports, and dev dependencies aligned with package architecture.
- `docs/working/current_task.md` — active task status.
- `tasks/P1-T01-TASK-0001/context.md` — resolved packet context.
- `tasks/P1-T01-TASK-0001/plan.md` — resolved execution plan.
- `tasks/P1-T01-TASK-0001/deliverable_spec.md` — resolved acceptance contract.

## Acceptance Checklist
- [ ] `pnpm build` emits `dist/index.js`, `dist/index.d.ts`, and `dist/ironvale.css`.
- [ ] `pnpm validate` exits 0 after reading `dist/ironvale.css` and local Aether tokens.
- [ ] Package export `./ironvale.css` points to `./dist/ironvale.css`.
- [ ] No component primitives are implemented in this task.
- [ ] Review bundle complete in `results.md` and `handoff.md`.

## Not Required
- CSS reset/base styles.
- Button, Text, Stack, Surface, or Input primitives.
- Storybook setup.
- Theme authoring beyond verifying Aether token availability.
