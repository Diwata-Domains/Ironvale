# Context: TASK-0003

## Required Documents

### Runtime (always load)
- `docs/runtime/PROJECT_RULES.md`

### Canonical (load for this task)
- `docs/canonical/product_scope.md` — confirms CSS-first class API and optional React wrappers.
- `docs/canonical/architecture.md` — defines Button file layout, class API pattern, package exports, and CSS layer order.

### Working (load if needed)
- `docs/working/implementation_plan.md` — confirms P1-T03 follows P1-T01 and P1-T02.
- `docs/working/backlog.md` — selected backlog item P1-T03.
- `docs/working/current_focus.md` — active constraints for `iv-` prefix and Aether semantic token usage.

### Packet Files
- `tasks/P1-T03-TASK-0003/task.md`
- `tasks/P1-T03-TASK-0003/plan.md`
- `tasks/P1-T03-TASK-0003/deliverable_spec.md`

## Adapter Context
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none
- **Adapter Rationale:** This task adds component CSS, a typed React wrapper, and package exports.

## Excluded Context
- P1-T04 primitives are excluded because this task is Button-only.
- Storybook setup is excluded because it belongs to a later documentation phase.

## Context Sufficiency Note
The selected context is sufficient to implement and review the Button primitive without expanding into other components.
