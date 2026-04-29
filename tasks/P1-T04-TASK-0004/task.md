# Task: Implement Text, Stack, Surface, and Input primitives

## Metadata
- **ID:** TASK-0004
- **Status:** done
- **Phase:** Phase 1 — Primitive Components
- **Backlog:** P1-T04
- **Packet Path:** tasks/P1-T04-TASK-0004/
- **Dependencies:** TASK-0003
- **Primary Adapter:** code_adapter
- **Secondary Adapters:** none

## Objective

Implement the four remaining Phase 1 primitives — Text, Stack, Surface, and Input — following the exact same CSS + React wrapper pattern established by Button in TASK-0003. After this task, Ironvale has a complete Phase 1 primitive set ready for consumption by Prospects.

## Why This Task Exists

Phase 1 closes only when the full primitive set is available. These four components cover layout (Stack), surface/container (Surface), typography (Text), and form input (Input) — the minimum surface area required to build real product screens.

## Scope

**Text — `src/components/Text/text.css` and `Text.tsx`:**
- `.iv-text` base: `display block`, color from `--ae-color-text-default`, font from Aether type tokens
- `.iv-text--body`: default body size + leading
- `.iv-text--label`: smaller size, medium weight, uppercase tracking
- `.iv-text--heading`: larger size, heavy weight
- `.iv-text--caption`: small size, muted color from `--ae-color-text-muted`
- React props: `as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label'`, `variant?: 'body' | 'label' | 'heading' | 'caption'`

**Stack — `src/components/Stack/stack.css` and `Stack.tsx`:**
- `.iv-stack`: `display flex`, `flex-direction column` by default, gap from `--ae-space-*`
- `.iv-stack--horizontal`: `flex-direction row`
- `.iv-stack--wrap`: `flex-wrap wrap`
- React props: `direction?: 'vertical' | 'horizontal'`, `wrap?: boolean`, `gap?: 'sm' | 'md' | 'lg'`

**Surface — `src/components/Surface/surface.css` and `Surface.tsx`:**
- `.iv-surface`: `display block`, background, border-radius, padding
- `.iv-surface--base`: background from `--ae-color-bg-base`, no shadow
- `.iv-surface--raised`: background from `--ae-color-bg-raised`, box-shadow from `--ae-shadow-sm`
- `.iv-surface--overlay`: background from `--ae-color-bg-overlay`, box-shadow from `--ae-shadow-md`
- React props: `as?: 'div' | 'section' | 'article' | 'aside'`, `variant?: 'base' | 'raised' | 'overlay'`

**Input — `src/components/Input/input.css` and `Input.tsx`:**
- `.iv-input`: full-width, border from `--ae-color-border-default`, background from `--ae-color-bg-input`, padding, border-radius, font from Aether type tokens
- Focus state: border from `--ae-color-border-focus`, outline from `--ae-color-action-primary-bg`
- Error state (`.iv-input--error`): border from `--ae-color-feedback-danger-border`
- Disabled state: opacity, cursor not-allowed
- React props: extends `React.InputHTMLAttributes<HTMLInputElement>`, adds `error?: boolean`
- Handles `type="text" | "email" | "password" | "search"` via native `type` prop

**Barrel** — add all four to `src/index.ts`

**Build** — run `pnpm build`; confirm all four component class sets appear in `dist/ironvale.css`

## Constraints

- Only Aether semantic tokens (`--ae-*`) — no hardcoded values
- React wrappers fully typed, no `any`
- No interaction logic in wrappers — presentation only
- Follow the exact same file structure as Button: `src/components/{Name}/{name}.css` + `{Name}.tsx`

## Escalation Conditions

- If a required Aether semantic token is missing for any primitive (e.g., `--ae-color-bg-input`, `--ae-color-border-focus`), raise a change proposal to Aether before hardcoding
- If more than 3 tokens are missing, flag before proceeding — may indicate a gap in Aether's Phase 2 theming scope
