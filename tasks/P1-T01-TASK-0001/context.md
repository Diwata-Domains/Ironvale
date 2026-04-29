# Context: TASK-0001

## Required Documents

### Runtime (always load)
- `docs/runtime/PROJECT_RULES.md`

### Canonical (load for this task)
- `docs/canonical/product_scope.md` — package scope, token dependency, and distribution expectations.
- `docs/canonical/architecture.md` — layer model, package exports, and build pipeline contract.

### Working (load if needed)
- `docs/working/implementation_plan.md` — Phase 1 sequencing.
- `docs/working/backlog.md` — selected backlog item P1-T01.
- `docs/working/current_focus.md` — current constraints for Aether token consumption.
- `docs/working/open_questions.md` — blocker check.
- `docs/working/change_proposals.md` — canonical change proposal check.

### Packet Files
- `tasks/P1-T01-TASK-0001/task.md`
- `tasks/P1-T01-TASK-0001/plan.md`
- `tasks/P1-T01-TASK-0001/deliverable_spec.md`

## Adapter Context
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none
- **Adapter Rationale:** This task changes package build configuration, source entrypoints, and a Node validation script.

## Excluded Context
- Component implementation task folders P1-T02 through P1-T05 are excluded because this task is limited to build pipeline and token integration.
- Storybook and future-phase docs are excluded because documentation UI is not part of P1-T01.

## Context Sufficiency Note
The selected runtime, canonical, working, and packet documents are sufficient to implement and review the P1-T01 build pipeline without expanding into component work.
