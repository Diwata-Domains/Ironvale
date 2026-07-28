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

  it('exposes all seven presets', () => {
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

  it('round-trips through localStorage', () => {
    setThemePreset('aurora');
    expect(getThemePreset()).toBe('aurora');
    expect(localStorage.getItem('diwata-preset')).toBe('aurora');
  });

  it('ignores an unknown stored value', () => {
    localStorage.setItem('diwata-preset', 'not-a-preset');
    expect(getThemePreset()).toBe('default');
  });

  it('applyThemePreset sets data-preset on <html>', () => {
    applyThemePreset('midnight');
    expect(document.documentElement.getAttribute('data-preset')).toBe('midnight');
  });

  it('applyThemePreset removes the attribute for "default"', () => {
    applyThemePreset('ember');
    applyThemePreset('default');
    expect(document.documentElement.hasAttribute('data-preset')).toBe(false);
  });

  it('initThemePreset applies the persisted value and returns it', () => {
    localStorage.setItem('diwata-preset', 'nocturne');
    const active: ThemePreset = initThemePreset();
    expect(active).toBe('nocturne');
    expect(document.documentElement.getAttribute('data-preset')).toBe('nocturne');
  });
});
