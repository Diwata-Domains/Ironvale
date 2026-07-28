/**
 * Accent — the highlight hue used for the `--ae-color-accent` family. Two ways
 * to set it:
 *
 *  - `setAccent(name)` / `data-accent` — a curated swatch from the aether ramps,
 *    persisted in localStorage (the user's chosen accent). `gold` is the brand
 *    default (no attribute).
 *  - `applyAccent(color, opts?)` — an imperative, un-persisted override that
 *    writes the accent CSS vars directly onto <html>. Diwa uses this to tint the
 *    accent to the active domain's color; call `clearAccent()` to drop back to
 *    the persisted swatch. `applyAccent` wins over the swatch attribute because
 *    an inline style beats a stylesheet rule.
 *
 * Mirrors colorMode.ts for the persisted-swatch portion.
 */
export type Accent =
  | 'gold'
  | 'crimson'
  | 'amber'
  | 'rose'
  | 'emerald'
  | 'azure'
  | 'violet'
  | 'slate';

export interface AccentSwatch {
  value: Accent;
  label: string;
  /** The ramp token the swatch previews with (its resting accent color). */
  token: string;
}

/** The curated swatch row, in menu order. `gold` is the brand default. */
export const ACCENTS: AccentSwatch[] = [
  { value: 'gold', label: 'Gold', token: 'var(--ae-color-gold-500)' },
  { value: 'crimson', label: 'Crimson', token: 'var(--ae-color-crimson-500)' },
  { value: 'amber', label: 'Amber', token: 'var(--ae-color-yellow-500)' },
  { value: 'rose', label: 'Rose', token: 'var(--ae-color-red-500)' },
  { value: 'emerald', label: 'Emerald', token: 'var(--ae-color-green-500)' },
  { value: 'azure', label: 'Azure', token: 'var(--ae-color-blue-500)' },
  { value: 'violet', label: 'Violet', token: 'var(--ae-color-purple-500)' },
  { value: 'slate', label: 'Slate', token: 'var(--ae-color-neutral-500)' },
];

const VALUES = new Set<Accent>(ACCENTS.map((a) => a.value));
const KEY = 'diwata-accent';

function isAccent(value: string | null): value is Accent {
  return value !== null && VALUES.has(value as Accent);
}

export function getAccent(): Accent {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(KEY);
    if (isAccent(stored)) return stored;
  }
  return 'gold';
}

/** Apply the named swatch via the `data-accent` attribute. `gold` clears it. */
export function applyAccentSwatch(accent: Accent): void {
  if (typeof document === 'undefined') return;
  if (accent === 'gold') document.documentElement.removeAttribute('data-accent');
  else document.documentElement.setAttribute('data-accent', accent);
}

export function setAccent(accent: Accent): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, accent);
  applyAccentSwatch(accent);
}

/** Apply the persisted (or default) accent swatch. Call once at app start. */
export function initAccent(): Accent {
  const accent = getAccent();
  applyAccentSwatch(accent);
  return accent;
}

export interface ApplyAccentOptions {
  /** Hover shade; defaults to the base color if omitted. */
  hover?: string;
  /** Text/foreground color that sits on the accent; unset if omitted. */
  text?: string;
}

/**
 * Imperatively tint the accent to an arbitrary color (any CSS color or
 * `var(--…)` token), bypassing the swatch set. Not persisted — intended for
 * dynamic, context-driven tinting (e.g. Diwa coloring the accent to the active
 * domain). Inline styles win over the `data-accent` stylesheet rule.
 */
export function applyAccent(color: string, opts: ApplyAccentOptions = {}): void {
  if (typeof document === 'undefined') return;
  const style = document.documentElement.style;
  style.setProperty('--ae-color-accent', color);
  style.setProperty('--ae-color-accent-hover', opts.hover ?? color);
  if (opts.text !== undefined) style.setProperty('--ae-color-accent-text', opts.text);
}

/** Drop an `applyAccent` override, falling back to the persisted swatch. */
export function clearAccent(): void {
  if (typeof document === 'undefined') return;
  const style = document.documentElement.style;
  style.removeProperty('--ae-color-accent');
  style.removeProperty('--ae-color-accent-hover');
  style.removeProperty('--ae-color-accent-text');
}
