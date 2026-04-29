# Deliverable Spec: TASK-0005

## Required Output

### New Files
- `results.md` — execution summary and validation results.
- `handoff.md` — review/close handoff.

### Modified Files
- `scripts/validate-tokens.mjs` — stricter emitted CSS validation.
- `docs/working/current_task.md` — active task status.
- `tasks/P1-T05-TASK-0005/context.md` — resolved packet context.
- `tasks/P1-T05-TASK-0005/plan.md` — resolved execution plan.
- `tasks/P1-T05-TASK-0005/deliverable_spec.md` — resolved acceptance criteria.

## Acceptance Checklist
- [ ] `scripts/validate-tokens.mjs` checks hex/rgb/hsl hardcoded values, px literals, and dangling `--ae-*` references in `dist/ironvale.css`.
- [ ] `pnpm build`, `pnpm validate`, and `pnpm typecheck` pass for the current primitive set.
- [ ] Validation uses only Node built-ins and resolves Aether tokens via a relative workspace path.
- [ ] Review bundle complete in `results.md` and `handoff.md`.

## Not Required
- New primitive implementation.
- Storybook setup.
- Canonical doc changes.
