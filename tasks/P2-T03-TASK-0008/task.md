# Task: Document theming and adoption flow

## Metadata
- **ID:** TASK-0008
- **Status:** done
- **Phase:** Phase 2 — Documentation Layer
- **Backlog:** P2-T03 — Document theming and adoption flow
- **Packet Path:** tasks/P2-T03-TASK-0008/
- **Dependencies:** TASK-0007
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none

## Objective
Add Storybook or package-level documentation that explains how consumers should install and import Aether plus Ironvale, how theme activation and token overrides work, and how to adopt the library from either plain HTML or React.

## Why This Task Exists
After primitive story coverage is complete, Phase 2 still requires onboarding guidance so downstream consumers can apply the package correctly without guessing import order, theming behavior, or whether they need the React wrappers.

## Scope
- Add a documentation surface inside Storybook for install order, theming patterns, token override guidance, and plain-HTML plus React usage examples.
- Keep examples aligned with the current package export contract and the already-authored primitive stories.

## Constraints
- Documentation must match the real package contract: Aether token CSS loads before Ironvale CSS, and React wrappers remain optional.
- This task must not edit canonical docs directly or expand into API changes for components or tokens.

## Escalation Conditions
- Escalate if the existing package contract is ambiguous enough that install or theming guidance cannot be written without a canonical doc correction.
- Escalate if the required examples reveal a missing export path or unsupported usage mode that would require code changes outside documentation scope.
