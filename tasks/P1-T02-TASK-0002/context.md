# Context: TASK-0002

## Required Documents

### Runtime (always load)
- `docs/runtime/PROJECT_RULES.md`

### Canonical (load for this task)
- `docs/canonical/product_scope.md` — confirms Ironvale consumes Aether tokens and ships a CSS-first package.
- `docs/canonical/architecture.md` — defines Layer 1 reset/base and `dist/ironvale.css` ordering.

### Working (load if needed)
- `docs/working/implementation_plan.md` — confirms P1-T02 follows P1-T01.
- `docs/working/backlog.md` — selected backlog item P1-T02.
- `docs/working/current_focus.md` — active constraints for Aether semantic token usage.

### Packet Files
- `tasks/P1-T02-TASK-0002/task.md`
- `tasks/P1-T02-TASK-0002/plan.md`
- `tasks/P1-T02-TASK-0002/deliverable_spec.md`

## Adapter Context
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none
- **Adapter Rationale:** This task changes package CSS source files and validates build output.

## Excluded Context
- Component task packets P1-T03 through P1-T05 are excluded because this task must not define `.iv-*` component selectors.
- Storybook documentation is excluded because it is planned for a later phase.

## Context Sufficiency Note
The selected context is sufficient to implement and review base CSS wiring without expanding into primitive components.
