# Current Focus

## Current Phase
Phase 3 — Brand Components

**Goal:** Integrate Diwata brand palette, add the six missing components (Card, Badge, NavItem, StatusDot, Table, Spinner), and migrate existing apps to use Ironvale instead of raw CSS classes.

**Status:** done — all 9 tasks complete

---

## Active Focus

Phase 3 is complete. Next: Phase 4 planning (diwata.domains integration, Astro compatibility, marketing components).

---

## Active Constraints

- All component CSS must consume only Aether semantic tokens (`--ae-*`) — no hardcoded values
- New border-width tokens: `--ae-border-width`, `--ae-border-width-thick`, `--ae-border-width-xl`
- New size tokens: `--ae-size-icon-*`, `--ae-size-dot-*`
- CSS class prefix: `iv-`
- React wrappers are typed and presentation-only — no internal state
- `@diwata/aether` is listed as a peerDependency, not a dependency
- Canonical docs require human approval before edits

Phase 2 closed: 2026-04-29 — Storybook docs complete
Phase 3 started: 2026-06-11
