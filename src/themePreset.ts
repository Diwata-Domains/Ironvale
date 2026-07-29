/**
 * Theme preset — a full palette override layered over `data-theme` (which
 * product). Set `data-preset` on <html> to swap the semantic color layer
 * (bg / text / action / accent) to a curated mood. Default (no attribute)
 * falls through to the product theme's own palette; choice persists in
 * localStorage.
 *
 * KEY RULE — a preset CARRIES ITS NATIVE MODE (Obsidian-style). Every
 * non-default preset is designed against exactly one `data-mode`, and applying
 * it also applies that mode (through the persisted colorMode setter, so the
 * two axes never disagree after a reload). A light palette therefore never
 * renders under dark component chrome, and vice versa. Selecting `default`
 * releases the lock and leaves the mode wherever the user last put it.
 *
 * The palette definitions live in @diwata/aether's tokens.css as
 * `:root[data-preset="<id>"]` blocks (one block per preset — no light×dark
 * matrix, because the preset pins its mode). This module is the persistence +
 * attribute-application layer, mirroring colorMode.ts / fontPreset.ts.
 */
import { setColorMode, type ColorMode } from './colorMode.js';

export type ThemePreset =
  | 'default'
  | 'nocturne'
  | 'parchment'
  | 'midnight'
  | 'aurora'
  | 'ember'
  | 'high-contrast';

export interface ThemePresetOption {
  value: ThemePreset;
  label: string;
  /** The mode this palette is designed for; applying the preset also applies
   *  this mode. `null` only for `default`, which follows the mode toggle. */
  nativeMode: ColorMode | null;
}

/** The curated preset set, in menu order. `default` is the no-override brand baseline. */
export const THEME_PRESETS: ThemePresetOption[] = [
  { value: 'default', label: 'Default', nativeMode: null },
  { value: 'nocturne', label: 'Nocturne', nativeMode: 'dark' },
  { value: 'parchment', label: 'Parchment', nativeMode: 'light' },
  { value: 'midnight', label: 'Midnight', nativeMode: 'dark' },
  { value: 'aurora', label: 'Aurora', nativeMode: 'dark' },
  { value: 'ember', label: 'Ember', nativeMode: 'dark' },
  { value: 'high-contrast', label: 'Contrast', nativeMode: 'dark' },
];

const VALUES = new Set<ThemePreset>(THEME_PRESETS.map((p) => p.value));
const KEY = 'diwata-preset';

function isPreset(value: string | null): value is ThemePreset {
  return value !== null && VALUES.has(value as ThemePreset);
}

/** The mode a preset is designed for — `null` for `default` (follows the toggle). */
export function presetNativeMode(preset: ThemePreset): ColorMode | null {
  return THEME_PRESETS.find((p) => p.value === preset)?.nativeMode ?? null;
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
  if (preset === 'default') {
    // Release the palette override; the current mode is left untouched.
    document.documentElement.removeAttribute('data-preset');
    return;
  }
  document.documentElement.setAttribute('data-preset', preset);
  // The preset carries its native mode: persist + apply it so the component
  // chrome (data-mode) always matches the palette it was designed against.
  const native = presetNativeMode(preset);
  if (native) setColorMode(native);
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
