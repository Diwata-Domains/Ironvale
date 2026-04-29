# Deliverable Spec: TASK-0002

## Required Output

### New Files
- `src/base.css` — minimal reset and base document styles.
- `results.md` — execution summary and verification.
- `handoff.md` — review/close handoff.

### Modified Files
- `src/ironvale.css` — imports base CSS first.
- `docs/working/current_task.md` — active task status.
- `tasks/P1-T02-TASK-0002/context.md` — resolved packet context.
- `tasks/P1-T02-TASK-0002/plan.md` — resolved execution plan.
- `tasks/P1-T02-TASK-0002/deliverable_spec.md` — resolved acceptance contract.

## Acceptance Checklist
- [ ] `src/base.css` defines minimal reset/base rules and no `.iv-*` selectors.
- [ ] Token-expressible values use `var(--ae-*)` references only.
- [ ] `dist/ironvale.css` contains base rules before future component layers/imports.
- [ ] `pnpm build`, `pnpm validate`, and `pnpm typecheck` pass.
- [ ] Review bundle complete in `results.md` and `handoff.md`.

## Not Required
- Button, Text, Stack, Surface, or Input primitives.
- Storybook configuration.
- Additional theme or Aether token changes.
