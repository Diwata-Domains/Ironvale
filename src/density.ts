/**
 * Density — how tightly components pack. `data-density="compact"` on <html>
 * shrinks the semantic component spacing tokens (aether defines the overrides);
 * `comfortable` is the default (no attribute). Persisted; same shape as
 * colorMode.ts.
 */
export type Density = 'comfortable' | 'compact';

const KEY = 'diwata-density';

export function getDensity(): Density {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(KEY);
    if (stored === 'comfortable' || stored === 'compact') return stored;
  }
  return 'comfortable';
}

export function applyDensity(density: Density): void {
  if (typeof document === 'undefined') return;
  if (density === 'comfortable') document.documentElement.removeAttribute('data-density');
  else document.documentElement.setAttribute('data-density', density);
}

export function setDensity(density: Density): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, density);
  applyDensity(density);
}

/** Apply the persisted (or default) density. Call once at app start. */
export function initDensity(): Density {
  const density = getDensity();
  applyDensity(density);
  return density;
}

export function toggleDensity(): Density {
  const next: Density = getDensity() === 'compact' ? 'comfortable' : 'compact';
  setDensity(next);
  return next;
}
