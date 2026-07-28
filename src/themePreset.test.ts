import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  THEME_PRESETS,
  applyThemePreset,
  getThemePreset,
  initThemePreset,
  setThemePreset,
  type ThemePreset,
} from './themePreset.js';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-preset');
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-preset');
});

describe('themePreset', () => {
  it('defaults to "default" with no stored value', () => {
    expect(getThemePreset()).toBe('default');
  });

  it('exposes only the default preset (seed palettes pulled for redesign)', () => {
    expect(THEME_PRESETS.map((p) => p.value)).toEqual(['default']);
  });

  it('round-trips through localStorage', () => {
    setThemePreset('default');
    expect(getThemePreset()).toBe('default');
    expect(localStorage.getItem('diwata-preset')).toBe('default');
  });

  it('ignores an unknown stored value', () => {
    localStorage.setItem('diwata-preset', 'not-a-preset');
    expect(getThemePreset()).toBe('default');
  });

  it('applyThemePreset removes the attribute for "default"', () => {
    document.documentElement.setAttribute('data-preset', 'stale');
    applyThemePreset('default');
    expect(document.documentElement.hasAttribute('data-preset')).toBe(false);
  });

  it('initThemePreset applies the persisted value and returns it', () => {
    const active: ThemePreset = initThemePreset();
    expect(active).toBe('default');
    expect(document.documentElement.hasAttribute('data-preset')).toBe(false);
  });
});
