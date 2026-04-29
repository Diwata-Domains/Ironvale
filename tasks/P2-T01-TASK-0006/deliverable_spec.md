# Deliverable Spec: TASK-0006

## Required Output

### New Files
- `.storybook/main.ts` — Storybook framework and story discovery config.
- `.storybook/preview.ts` — global preview imports and parameters for Ironvale.
- Optional minimal docs-only story if needed to validate startup/build.
- `results.md` — execution summary and verification.
- `handoff.md` — review/close handoff.

### Modified Files
- `package.json` — Storybook and runtime dev dependencies as needed.
- `../../pnpm-lock.yaml` — lockfile updates for Storybook dependencies.
- `docs/working/current_task.md` — active task status.
- `tasks/P2-T01-TASK-0006/context.md` — resolved packet context.
- `tasks/P2-T01-TASK-0006/plan.md` — resolved execution plan.
- `tasks/P2-T01-TASK-0006/deliverable_spec.md` — resolved acceptance criteria.

## Acceptance Checklist
- [ ] Storybook config exists and uses the React+Vite framework.
- [ ] Preview loads `@diwata/aether` tokens and Ironvale CSS in the correct order.
- [ ] `pnpm storybook` can start cleanly and `pnpm storybook:build` succeeds.
- [ ] Existing `pnpm build`, `pnpm validate`, and `pnpm typecheck` remain green.
- [ ] Review bundle complete in `results.md` and `handoff.md`.

## Not Required
- Full primitive story authoring.
- Theming/adoption guides.
- Canonical documentation edits.
