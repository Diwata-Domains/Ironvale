/**
 * Light/dark mode for the suite. Orthogonal to `data-theme` (which product):
 * `data-mode` on <html> selects the light or dark palette within a theme.
 * The suite default is dark. Choice persists in localStorage.
 */
export type ColorMode = 'light' | 'dark';

const KEY = 'diwata-mode';

export function getColorMode(): ColorMode {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  }
  return 'dark';
}

export function applyColorMode(mode: ColorMode): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-mode', mode);
  }
}

export function setColorMode(mode: ColorMode): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, mode);
  applyColorMode(mode);
}

/** Apply the persisted (or default) mode. Call once at app start, before render. */
export function initColorMode(): ColorMode {
  const mode = getColorMode();
  applyColorMode(mode);
  return mode;
}

export function toggleColorMode(): ColorMode {
  const next: ColorMode = getColorMode() === 'dark' ? 'light' : 'dark';
  setColorMode(next);
  return next;
}
