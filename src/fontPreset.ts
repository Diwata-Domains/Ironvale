/**
 * Font preset — the curated, Notion-style reading-face choice. Orthogonal to
 * `data-mode` (light/dark) and `data-theme` (which product): `data-font` on
 * <html> swaps the reading/body face. Default is the brand voice (no attribute);
 * choice persists in localStorage.
 */
export type FontPreset = 'default' | 'serif' | 'mono';

const KEY = 'diwata-font';

export function getFontPreset(): FontPreset {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(KEY);
    if (stored === 'default' || stored === 'serif' || stored === 'mono') return stored;
  }
  return 'default';
}

export function applyFontPreset(preset: FontPreset): void {
  if (typeof document === 'undefined') return;
  if (preset === 'default') document.documentElement.removeAttribute('data-font');
  else document.documentElement.setAttribute('data-font', preset);
}

export function setFontPreset(preset: FontPreset): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, preset);
  applyFontPreset(preset);
}

/** Apply the persisted (or default) preset. Call once at app start, before render. */
export function initFontPreset(): FontPreset {
  const preset = getFontPreset();
  applyFontPreset(preset);
  return preset;
}
