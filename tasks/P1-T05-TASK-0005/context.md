# Context: TASK-0005

## Required Documents

### Runtime (always load)
- `docs/runtime/PROJECT_RULES.md`

### Canonical (load for this task)
- `docs/canonical/product_scope.md` — confirms the library contract is token-driven and framework-agnostic.
- `docs/canonical/architecture.md` — defines the expected emitted package outputs and token consumption rules.

### Working (load if needed)
- `docs/working/implementation_plan.md` — confirms this is the Phase 1 validation gate.
- `docs/working/backlog.md` — selected backlog item P1-T05.
- `docs/working/current_focus.md` — current token and wrapper constraints.

### Packet Files
- `tasks/P1-T05-TASK-0005/task.md`
- `tasks/P1-T05-TASK-0005/plan.md`
- `tasks/P1-T05-TASK-0005/deliverable_spec.md`

## Adapter Context
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none
- **Adapter Rationale:** This task changes the Node validation script and verifies build artifacts against the Aether token contract.

## Excluded Context
- Future Storybook and complex component work is excluded because this task is the Phase 1 gate only.
- Canonical doc edits are excluded because the validation contract already exists and should be enforced, not redesigned.

## Context Sufficiency Note
The selected context is sufficient to tighten Phase 1 validation and close the primitive phase without expanding scope.
