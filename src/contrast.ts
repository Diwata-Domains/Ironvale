/**
 * Contrast — a mode-agnostic accessibility toggle. `data-contrast="high"` on
 * <html> strengthens borders, pushes secondary/muted text toward primary, and
 * widens the focus ring (aether defines the overrides). `normal` is the default
 * (no attribute). Persisted; same shape as colorMode.ts.
 */
export type Contrast = 'normal' | 'high';

const KEY = 'diwata-contrast';

export function getContrast(): Contrast {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(KEY);
    if (stored === 'normal' || stored === 'high') return stored;
  }
  return 'normal';
}

export function applyContrast(contrast: Contrast): void {
  if (typeof document === 'undefined') return;
  if (contrast === 'normal') document.documentElement.removeAttribute('data-contrast');
  else document.documentElement.setAttribute('data-contrast', contrast);
}

export function setContrast(contrast: Contrast): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, contrast);
  applyContrast(contrast);
}

/** Apply the persisted (or default) contrast. Call once at app start. */
export function initContrast(): Contrast {
  const contrast = getContrast();
  applyContrast(contrast);
  return contrast;
}

export function toggleContrast(): Contrast {
  const next: Contrast = getContrast() === 'high' ? 'normal' : 'high';
  setContrast(next);
  return next;
}
