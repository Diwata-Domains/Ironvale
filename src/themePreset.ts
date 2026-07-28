/**
 * Theme preset — a full palette override, orthogonal to `data-mode` (light/dark)
 * and `data-theme` (which product). Set `data-preset` on <html> to swap the
 * semantic color layer (bg / text / action / accent) to a curated mood. Default
 * (no attribute) falls through to the product theme's own palette; choice
 * persists in localStorage.
 *
 * The palette definitions live in @diwata/aether's tokens.css as
 * `:root[data-preset="<id>"]` blocks. This module is only the persistence +
 * attribute-application layer, mirroring colorMode.ts / fontPreset.ts exactly.
 */
/**
 * Only `default` (the brand baseline) is currently shipped. The six seed
 * palettes (nocturne / parchment / midnight / aurora / ember / high-contrast)
 * were pulled back for a real design pass — see the AppearancePanel note and
 * the pulled `:root[data-preset=…]` blocks in @diwata/aether tokens.css. The
 * type stays a union so the axis can be re-expanded without an API break.
 */
export type ThemePreset = 'default';

/** The curated preset set, in menu order. `default` is the no-override brand baseline. */
export const THEME_PRESETS: { value: ThemePreset; label: string }[] = [
  { value: 'default', label: 'Default' },
];

const VALUES = new Set<ThemePreset>(THEME_PRESETS.map((p) => p.value));
const KEY = 'diwata-preset';

function isPreset(value: string | null): value is ThemePreset {
  return value !== null && VALUES.has(value as ThemePreset);
}

export function getThemePreset(): ThemePreset {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(KEY);
    if (isPreset(stored)) return stored;
  }
  return 'default';
}

export function applyThemePreset(preset: ThemePreset): void {
  if (typeof document === 'undefined') return;
  if (preset === 'default') document.documentElement.removeAttribute('data-preset');
  else document.documentElement.setAttribute('data-preset', preset);
}

export function setThemePreset(preset: ThemePreset): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, preset);
  applyThemePreset(preset);
}

/** Apply the persisted (or default) preset. Call once at app start, before render. */
export function initThemePreset(): ThemePreset {
  const preset = getThemePreset();
  applyThemePreset(preset);
  return preset;
}
