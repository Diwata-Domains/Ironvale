# Deliverable Spec: TASK-0008

## Required Output

### New Files
- `src/stories/Adoption.stories.tsx` or equivalent Storybook docs page — install order, theming, token overrides, and adoption examples.
- `results.md` — execution summary and verification.
- `handoff.md` — review/close handoff.

### Modified Files
- `docs/working/current_task.md` — active task status.
- `tasks/P2-T03-TASK-0008/task.md` — resolved task metadata and scope.
- `tasks/P2-T03-TASK-0008/context.md` — resolved packet context.
- `tasks/P2-T03-TASK-0008/plan.md` — resolved execution plan.
- `tasks/P2-T03-TASK-0008/deliverable_spec.md` — resolved acceptance criteria.

## Acceptance Checklist
- [ ] Storybook includes a guide covering install/import order for Aether and Ironvale.
- [ ] Documentation explains theming behavior and a safe token override pattern without changing the package contract.
- [ ] Documentation includes both plain-HTML and React adoption examples.
- [ ] `pnpm storybook:build` succeeds.
- [ ] `pnpm build`, `pnpm validate`, and `pnpm typecheck` remain green.
- [ ] Review bundle complete in `results.md` and `handoff.md`.

## Not Required
- Canonical documentation edits.
- New component APIs, token definitions, or theming runtime behavior.
- Additional primitives or complex components.
