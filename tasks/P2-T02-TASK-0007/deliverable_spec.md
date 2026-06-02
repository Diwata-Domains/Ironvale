# Deliverable Spec: TASK-0007

## Required Output

### New Files
- `src/stories/Button.stories.tsx` — Button primitive stories covering defaults, variants, and sizes.
- `src/stories/Text.stories.tsx` — Text primitive stories covering semantic variants and rendered elements.
- `src/stories/Stack.stories.tsx` — Stack primitive stories covering vertical, horizontal, and wrapping layouts.
- `src/stories/Surface.stories.tsx` — Surface primitive stories covering base, raised, and overlay variants.
- `src/stories/Input.stories.tsx` — Input primitive stories covering default usage, supported input types, and disabled/error-adjacent guidance as applicable.
- `results.md` — execution summary and verification.
- `handoff.md` — review/close handoff.

### Modified Files
- `src/stories/Introduction.stories.tsx` — trim, reposition, or retain only if it still adds useful top-level docs after primitive stories exist.
- `docs/working/current_task.md` — active task status.
- `tasks/P2-T02-TASK-0007/task.md` — resolved task metadata and scope.
- `tasks/P2-T02-TASK-0007/context.md` — resolved packet context.
- `tasks/P2-T02-TASK-0007/plan.md` — resolved execution plan.
- `tasks/P2-T02-TASK-0007/deliverable_spec.md` — resolved acceptance criteria.

## Acceptance Checklist
- [ ] Storybook contains dedicated stories for Button, Text, Stack, Surface, and Input.
- [ ] Stories cover default usage plus each primitive’s supported variants, sizes, or layout permutations where applicable.
- [ ] Storybook docs include concise accessibility or usage notes for each primitive.
- [ ] `pnpm storybook:build` succeeds with the new stories.
- [ ] `pnpm build`, `pnpm validate`, and `pnpm typecheck` remain green.
- [ ] Review bundle complete in `results.md` and `handoff.md`.

## Not Required
- Canonical documentation edits.
- Theming or adoption-flow documentation from P2-T03.
- Any changes to primitive runtime behavior, token contracts, or exported component APIs.
