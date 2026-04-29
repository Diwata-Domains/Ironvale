# Current Focus

## Current Phase
Phase 2 — Documentation Layer

**Goal:** Turn the completed primitive set into usable documentation and onboarding material through Storybook and usage guides.

**Status:** planned — awaiting documentation task planning

---

## Active Focus

- Preserve the completed Phase 1 primitive set and validation gate.
- Plan the Storybook/documentation task sequence for the next phase.
- Keep token-contract enforcement in place while documentation work starts.

---

## Active Constraints

- All component CSS must consume only Aether semantic tokens (`--ae-*`) — no hardcoded values
- Primitive tokens (`--ae-primitive-*`) must never appear in component CSS — semantic only
- CSS class prefix: `iv-`
- React wrappers are typed and presentation-only — no internal state
- `@diwata/aether` is listed as a peerDependency, not a dependency
- Canonical docs require human approval before edits

Phase 1 closed: 2026-04-29 — primitive set and validation gate complete
