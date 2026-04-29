# Context: TASK-0004

## Required Documents

### Runtime (always load)
- `docs/runtime/PROJECT_RULES.md`

### Canonical (load for this task)
- `docs/canonical/product_scope.md` — confirms CSS-first, optional React wrapper approach.
- `docs/canonical/architecture.md` — defines primitive layer, file layout, and export model.

### Working (load if needed)
- `docs/working/implementation_plan.md` — confirms P1-T04 sequencing.
- `docs/working/backlog.md` — selected backlog item P1-T04.
- `docs/working/current_focus.md` — current component constraints and `iv-` prefix rule.

### Packet Files
- `tasks/P1-T04-TASK-0004/task.md`
- `tasks/P1-T04-TASK-0004/plan.md`
- `tasks/P1-T04-TASK-0004/deliverable_spec.md`

## Adapter Context
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none
- **Adapter Rationale:** This task adds component CSS, typed React wrappers, and package exports across the remaining primitive set.

## Excluded Context
- Validation gate task P1-T05 is excluded because this task should implement primitives, not strengthen validation rules.
- Storybook phase work is excluded because documentation remains out of scope here.

## Context Sufficiency Note
The selected context is sufficient to implement and review the remaining primitives without changing architecture or planning future phases.
