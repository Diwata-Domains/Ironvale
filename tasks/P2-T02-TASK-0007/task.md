# Task: Author primitive stories and usage notes

## Metadata
- **ID:** TASK-0007
- **Status:** done
- **Phase:** Phase 2 — Documentation Layer
- **Backlog:** P2-T02 — Author primitive stories and usage notes
- **Packet Path:** tasks/P2-T02-TASK-0007/
- **Dependencies:** TASK-0006
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none

## Objective
Add Storybook stories for Button, Text, Stack, Surface, and Input that document the shipped primitive API with defaults, supported variants, size or layout permutations where applicable, and concise accessibility or usage notes for consumers.

## Why This Task Exists
Phase 2 exists to turn the completed primitive set into usable documentation. The backlog explicitly calls for story coverage across all five Phase 1 primitives before theming and adoption guidance can be authored in P2-T03.

## Scope
- Create component stories for Button, Text, Stack, Surface, and Input under `src/stories/`.
- Replace the temporary introduction-only Storybook surface with stories that demonstrate the real primitive API and document accessibility expectations in Storybook docs metadata.

## Constraints
- Stories must reflect the existing primitive API exactly and must not introduce new component behavior or token contracts.
- Canonical docs are approval-gated, so this task stays within Storybook/package files and working-task artifacts only.

## Escalation Conditions
- Escalate if the existing component API cannot express the backlog-required examples without changing the public primitive contract.
- Escalate if documenting a primitive reveals a missing semantic token or a behavior gap that requires a canonical architecture or scope decision.
