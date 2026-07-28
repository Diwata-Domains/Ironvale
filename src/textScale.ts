/**
 * Text scale — a global type-size multiplier, orthogonal to the font preset.
 * Set `data-text-scale` on <html> to grow or shrink every `--ae-font-size-*`
 * token (aether redefines the primitive sizes per scale). `md` is the default
 * (no attribute). Choice persists in localStorage. Same shape as colorMode.ts.
 */
export type TextScale = 'sm' | 'md' | 'lg' | 'xl';

/** Menu order. `md` is the no-override default. */
export const TEXT_SCALES: { value: TextScale; label: string }[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
  { value: 'xl', label: 'XL' },
];

const VALUES = new Set<TextScale>(TEXT_SCALES.map((s) => s.value));
const KEY = 'diwata-text-scale';

function isTextScale(value: string | null): value is TextScale {
  return value !== null && VALUES.has(value as TextScale);
}

export function getTextScale(): TextScale {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(KEY);
    if (isTextScale(stored)) return stored;
  }
  return 'md';
}

export function applyTextScale(scale: TextScale): void {
  if (typeof document === 'undefined') return;
  if (scale === 'md') document.documentElement.removeAttribute('data-text-scale');
  else document.documentElement.setAttribute('data-text-scale', scale);
}

export function setTextScale(scale: TextScale): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, scale);
  applyTextScale(scale);
}

/** Apply the persisted (or default) scale. Call once at app start, before render. */
export function initTextScale(): TextScale {
  const scale = getTextScale();
  applyTextScale(scale);
  return scale;
}
