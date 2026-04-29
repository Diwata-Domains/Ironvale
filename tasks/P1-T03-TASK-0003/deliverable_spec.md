# Deliverable Spec: TASK-0003

## Required Output

### New Files
- `src/components/Button/button.css` — Button class API styles.
- `src/components/Button/Button.tsx` — typed React Button wrapper.
- `results.md` — execution summary and verification.
- `handoff.md` — review/close handoff.

### Modified Files
- `src/index.ts` — exports Button.
- `src/ironvale.css` — imports Button CSS after base CSS.
- `package.json` — adds React type dependency if required for wrapper compilation.
- `../../pnpm-lock.yaml` — refreshed if dependency metadata changes.
- `docs/working/current_task.md` — active task status.
- `tasks/P1-T03-TASK-0003/context.md` — resolved packet context.
- `tasks/P1-T03-TASK-0003/plan.md` — resolved execution plan.
- `tasks/P1-T03-TASK-0003/deliverable_spec.md` — resolved acceptance contract.

## Acceptance Checklist
- [ ] Button CSS includes base, primary, ghost, danger, sm, md, lg, disabled, and busy states.
- [ ] Button CSS values use Aether `--ae-*` tokens for token-expressible values.
- [ ] React wrapper is typed, presentation-only, and exported from `src/index.ts`.
- [ ] `dist/ironvale.css` contains Button classes after base rules.
- [ ] `pnpm build`, `pnpm validate`, and `pnpm typecheck` pass.
- [ ] Review bundle complete in `results.md` and `handoff.md`.

## Not Required
- Other primitives.
- Storybook stories.
- Runtime Button interaction logic.
