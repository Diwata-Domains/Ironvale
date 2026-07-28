/**
 * Reduced motion — a manual override that complements the
 * `prefers-reduced-motion` media query. `data-motion="reduced"` on <html>
 * zeroes every `--ae-duration-*` token (aether defines the override), so users
 * whose OS does not advertise the preference can still opt out. `system` is the
 * default (no attribute — the media query still applies). Persisted; same shape
 * as colorMode.ts.
 */
export type Motion = 'system' | 'reduced';

const KEY = 'diwata-motion';

export function getMotion(): Motion {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(KEY);
    if (stored === 'system' || stored === 'reduced') return stored;
  }
  return 'system';
}

export function applyMotion(motion: Motion): void {
  if (typeof document === 'undefined') return;
  if (motion === 'system') document.documentElement.removeAttribute('data-motion');
  else document.documentElement.setAttribute('data-motion', motion);
}

export function setMotion(motion: Motion): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, motion);
  applyMotion(motion);
}

/** Apply the persisted (or default) motion preference. Call once at app start. */
export function initMotion(): Motion {
  const motion = getMotion();
  applyMotion(motion);
  return motion;
}

export function toggleMotion(): Motion {
  const next: Motion = getMotion() === 'reduced' ? 'system' : 'reduced';
  setMotion(next);
  return next;
}
