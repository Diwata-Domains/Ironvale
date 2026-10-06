# Task: DatePicker and Calendar components

## Metadata
- **ID:** TASK-0009
- **Status:** in_progress
- **Mode:** simple
- **Phase:** Phase 4 — Appearance System (design-system consolidation)
- **Backlog:** P4-T05 — DatePicker and Calendar components
- **Packet Path:** tasks/P4-T05-TASK-0009/
- **Dependencies:** P4-T02 (Select — the sibling it is modelled on)
- **Primary Adapter:** none
- **Secondary Adapters:** none

## Objective
A themed date field for the Diwata stack: `DatePicker` (a Select-style trigger with a portalled, viewport-clamped popover) built from an exported presentational `Calendar` month grid. Strings in, strings out — `YYYY-MM-DD` calendar days, with all arithmetic on integers so no timezone, DST change or UTC conversion can move a day. Full keyboard support per the WAI-ARIA date-picker dialog pattern; aether tokens only.

## Why This Task Exists
Founder, 2026-10-06, after editing a task's due date in Sanctum: the native date picker "looks really ugly… let's try having our own calendar component, check ironvale first if there's any, if none create one in ironvale then import." Ironvale had none. Sanctum adopts it in a separate PR.

## Scope
- src/components/DatePicker/: dateMath.ts, Calendar.tsx, DatePicker.tsx, date-picker.css, tests
- story, package index exports, ironvale.css import

## Constraints
- No Date object crosses the API; never `new Date("YYYY-MM-DD")`, never `toISOString()`
- Aether tokens only; no new hues; the chosen day uses the action colour pair, not the accent
- One product per PR: packages/ironvale only

## Escalation Conditions
- Merging touches packages/ironvale/** and triggers the conclave, apex, diwa-web and storybook deploy workflows and the ironvale sync
