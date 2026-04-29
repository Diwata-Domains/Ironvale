# Task: Implement Button primitive

## Metadata
- **ID:** TASK-0003
- **Status:** done
- **Phase:** Phase 1 — Primitive Components
- **Backlog:** P1-T03
- **Packet Path:** tasks/P1-T03-TASK-0003/
- **Dependencies:** TASK-0001, TASK-0002
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none

## Objective

Implement the Button primitive as the first Ironvale component: a CSS class-based API (`src/components/Button/button.css`) and an optional React wrapper (`src/components/Button/Button.tsx`). All styling must derive exclusively from Aether semantic tokens. This task proves the pattern works end-to-end before the remaining four primitives are implemented in TASK-0004.

## Why This Task Exists

Button is the most fundamental interactive component and the best proof that the token → component pipeline is sound. A working Button also makes Ironvale minimally useful for a consuming app, serving as an early integration checkpoint with Prospects.

## Scope

**CSS — `src/components/Button/button.css`:**
- `.iv-button` base: `display inline-flex`, `align-items center`, `gap`, padding, border, border-radius, cursor, font, transition
  - All colors, spacing, and radius from Aether semantics: `--ae-color-action-*`, `--ae-radius-*`, `--ae-space-*`, `--ae-text-*`
- `.iv-button--primary`: filled background from `--ae-color-action-primary-bg`, text from `--ae-color-action-primary-text`, hover/active states
- `.iv-button--ghost`: transparent background, border from `--ae-color-border-default`, hover state
- `.iv-button--danger`: filled background from `--ae-color-feedback-danger-*`, hover state
- `.iv-button--sm`: reduced padding and font size
- `.iv-button--md`: default — same as base
- `.iv-button--lg`: increased padding and font size
- `[disabled]` attribute: reduced opacity from `--ae-color-action-disabled-*`, cursor not-allowed
- `[aria-busy]` attribute: cursor wait

**React — `src/components/Button/Button.tsx`:**
```tsx
type ButtonVariant = 'primary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
```
- Render `<button className={`iv-button iv-button--${variant} iv-button--${size}`} {...props} />`
- Export named: `export { Button }`

**Barrel** — add to `src/index.ts`: `export { Button } from './components/Button/Button'`

**Build** — run `pnpm build`; confirm Button class appears in `dist/ironvale.css`

## Constraints

- Only Aether semantic tokens (`--ae-*`) in CSS — no hardcoded hex, rgb, or spacing values
- Do not reference Aether primitive tokens (`--ae-primitive-*`) directly — semantic layer only
- React wrapper must be typed; no `any` props
- No JavaScript interaction logic in the wrapper — purely presentation

## Escalation Conditions

- If a required Aether semantic token (e.g., `--ae-color-action-primary-bg`) is missing from `packages/aether/tokens/tokens.css`, raise a change proposal to Aether — do not hardcode a fallback
