# Deliverable Spec: TASK-0004

## Required Output

### New Files
- `src/components/Text/text.css` — Text primitive styles.
- `src/components/Text/Text.tsx` — typed Text wrapper.
- `src/components/Stack/stack.css` — Stack primitive styles.
- `src/components/Stack/Stack.tsx` — typed Stack wrapper.
- `src/components/Surface/surface.css` — Surface primitive styles.
- `src/components/Surface/Surface.tsx` — typed Surface wrapper.
- `src/components/Input/input.css` — Input primitive styles.
- `src/components/Input/Input.tsx` — typed Input wrapper.
- `results.md` — execution summary and verification.
- `handoff.md` — review/close handoff.

### Modified Files
- `src/index.ts` — exports the new primitives and their types.
- `src/ironvale.css` — imports the new primitive CSS files after base/Button.
- `docs/working/current_task.md` — active task status.
- `tasks/P1-T04-TASK-0004/context.md` — resolved packet context.
- `tasks/P1-T04-TASK-0004/plan.md` — resolved execution plan.
- `tasks/P1-T04-TASK-0004/deliverable_spec.md` — resolved acceptance criteria.

## Acceptance Checklist
- [ ] Text, Stack, Surface, and Input CSS/React wrapper files are implemented in the expected structure.
- [ ] Token-expressible values use Aether `--ae-*` references only.
- [ ] New primitives are exported from `src/index.ts`.
- [ ] `dist/ironvale.css` contains all four new primitive class sets.
- [ ] `pnpm build`, `pnpm validate`, and `pnpm typecheck` pass.
- [ ] Review bundle complete in `results.md` and `handoff.md`.

## Not Required
- Validation rule changes from P1-T05.
- Storybook stories.
- Complex components beyond the Phase 1 primitive set.
