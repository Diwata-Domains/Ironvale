# Context: TASK-0007

## Required Documents

### Runtime (always load)
- `docs/runtime/PROJECT_RULES.md`

### Canonical (load for this task)
- `docs/canonical/product_scope.md` — confirms Storybook documents every component and variant.
- `docs/canonical/architecture.md` — defines the primitive inventory, class/API expectations, and Storybook minimum coverage requirements.

### Working (load if needed)
- `docs/working/backlog.md` — selected backlog item P2-T02 and dependency on P2-T01.
- `docs/working/current_focus.md` — Phase 2 goal plus active constraints to preserve while documenting primitives.
- `docs/working/implementation_plan.md` — confirms that story authoring is the current phase step after Storybook setup.

### Packet Files
- `tasks/P2-T02-TASK-0007/task.md`
- `tasks/P2-T02-TASK-0007/plan.md`
- `tasks/P2-T02-TASK-0007/deliverable_spec.md`

## Adapter Context
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none
- **Adapter Rationale:** This task adds and validates Storybook source files that document the existing React wrapper surface and CSS-first primitive API.

## Excluded Context
- `docs/canonical/*` edits are excluded because canonical docs require human approval and P2-T02 does not need them.
- The theming, install-order, and adoption guidance for P2-T03 is excluded because this task is limited to primitive stories and usage notes.

## Context Sufficiency Note
The selected context is sufficient to author accurate primitive stories and verify them without expanding scope into theming guidance or new component development.
