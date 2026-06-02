# Context: TASK-0008

## Required Documents

### Runtime (always load)
- `docs/runtime/PROJECT_RULES.md`

### Canonical (load for this task)
- `docs/canonical/product_scope.md` — confirms Ironvale is CSS-first, framework-agnostic, and documented through Storybook.
- `docs/canonical/architecture.md` — defines package import order, dark theme behavior, and optional React wrapper usage.

### Working (load if needed)
- `docs/working/backlog.md` — selected backlog item P2-T03 and dependency on P2-T02.
- `docs/working/current_focus.md` — current Phase 2 constraints that documentation must preserve.

### Packet Files
- `tasks/P2-T03-TASK-0008/task.md`
- `tasks/P2-T03-TASK-0008/plan.md`
- `tasks/P2-T03-TASK-0008/deliverable_spec.md`

## Adapter Context
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none
- **Adapter Rationale:** This task adds Storybook documentation content and package-level examples rather than changing the runtime component implementation.

## Excluded Context
- Canonical documentation edits are excluded because canonical docs require human approval before modification.
- New component behavior, new tokens, or theming mechanics are excluded because this task documents the existing contract only.

## Context Sufficiency Note
The selected context is sufficient to document adoption and theming accurately because the package import contract, theme model, and wrapper boundaries are already defined in canonical docs and the completed primitive stories.
