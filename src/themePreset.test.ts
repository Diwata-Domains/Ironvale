import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  THEME_PRESETS,
  applyThemePreset,
  getThemePreset,
  initThemePreset,
  presetNativeMode,
  setThemePreset,
  type ThemePreset,
} from './themePreset.js';

function reset() {
  localStorage.clear();
  document.documentElement.removeAttribute('data-preset');
  document.documentElement.removeAttribute('data-mode');
}

beforeEach(reset);
afterEach(reset);

describe('themePreset', () => {
  it('defaults to "default" with no stored value', () => {
    expect(getThemePreset()).toBe('default');
  });

  it('exposes the 7 curated presets in menu order', () => {
    expect(THEME_PRESETS.map((p) => p.value)).toEqual([
      'default',
      'nocturne',
      'parchment',
      'midnight',
      'aurora',
      'ember',
      'high-contrast',
    ]);
  });

  it('every non-default preset carries a native mode; default follows the toggle', () => {
    for (const p of THEME_PRESETS) {
      if (p.value === 'default') expect(p.nativeMode).toBeNull();
      else expect(['light', 'dark']).toContain(p.nativeMode);
    }
    expect(presetNativeMode('parchment')).toBe('light');
    expect(presetNativeMode('nocturne')).toBe('dark');
    expect(presetNativeMode('default')).toBeNull();
  });

  it('round-trips through localStorage', () => {
    setThemePreset('midnight');
    expect(getThemePreset()).toBe('midnight');
    expect(localStorage.getItem('diwata-preset')).toBe('midnight');
  });

  it('ignores an unknown stored value', () => {
    localStorage.setItem('diwata-preset', 'not-a-preset');
    expect(getThemePreset()).toBe('default');
  });

  it('applyThemePreset sets data-preset for a non-default preset', () => {
    applyThemePreset('aurora');
    expect(document.documentElement.getAttribute('data-preset')).toBe('aurora');
  });

  it('applyThemePreset removes the attribute for "default"', () => {
    document.documentElement.setAttribute('data-preset', 'stale');
    applyThemePreset('default');
    expect(document.documentElement.hasAttribute('data-preset')).toBe(false);
  });

  // — the native-mode pairing (the KEY RULE) —

  it('applying a light-native preset (parchment) also applies data-mode=light', () => {
    document.documentElement.setAttribute('data-mode', 'dark');
    applyThemePreset('parchment');
    expect(document.documentElement.getAttribute('data-mode')).toBe('light');
  });

  it('applying a dark-native preset (nocturne) also applies data-mode=dark', () => {
    document.documentElement.setAttribute('data-mode', 'light');
    applyThemePreset('nocturne');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
  });

  it('the native mode is persisted through the colorMode setter', () => {
    applyThemePreset('parchment');
    expect(localStorage.getItem('diwata-mode')).toBe('light');
    applyThemePreset('ember');
    expect(localStorage.getItem('diwata-mode')).toBe('dark');
  });

  it('applying "default" leaves the mode untouched', () => {
    document.documentElement.setAttribute('data-mode', 'light');
    localStorage.setItem('diwata-mode', 'light');
    applyThemePreset('default');
    expect(document.documentElement.getAttribute('data-mode')).toBe('light');
    expect(localStorage.getItem('diwata-mode')).toBe('light');
  });

  it('initThemePreset applies the persisted preset AND its native mode', () => {
    localStorage.setItem('diwata-preset', 'high-contrast');
    const active: ThemePreset = initThemePreset();
    expect(active).toBe('high-contrast');
    expect(document.documentElement.getAttribute('data-preset')).toBe('high-contrast');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
  });
});
