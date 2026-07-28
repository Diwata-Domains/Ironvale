import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { applyTextScale, getTextScale, initTextScale, setTextScale } from './textScale.js';
import {
  applyAccent,
  applyAccentSwatch,
  clearAccent,
  getAccent,
  initAccent,
  setAccent,
} from './accent.js';
import { getContrast, setContrast, toggleContrast } from './contrast.js';
import { getDensity, setDensity, toggleDensity } from './density.js';
import { getMotion, setMotion, toggleMotion } from './reducedMotion.js';

const root = () => document.documentElement;

beforeEach(() => {
  localStorage.clear();
  for (const attr of ['data-text-scale', 'data-accent', 'data-contrast', 'data-density', 'data-motion']) {
    root().removeAttribute(attr);
  }
  clearAccent();
});
afterEach(() => localStorage.clear());

describe('textScale', () => {
  it('defaults to md and round-trips', () => {
    expect(getTextScale()).toBe('md');
    setTextScale('xl');
    expect(getTextScale()).toBe('xl');
    expect(localStorage.getItem('diwata-text-scale')).toBe('xl');
  });
  it('applies via data-text-scale, md clears it', () => {
    applyTextScale('lg');
    expect(root().getAttribute('data-text-scale')).toBe('lg');
    applyTextScale('md');
    expect(root().hasAttribute('data-text-scale')).toBe(false);
  });
  it('init applies persisted value', () => {
    localStorage.setItem('diwata-text-scale', 'sm');
    expect(initTextScale()).toBe('sm');
    expect(root().getAttribute('data-text-scale')).toBe('sm');
  });
});

describe('accent', () => {
  it('defaults to gold and round-trips a swatch', () => {
    expect(getAccent()).toBe('gold');
    setAccent('azure');
    expect(getAccent()).toBe('azure');
    expect(root().getAttribute('data-accent')).toBe('azure');
  });
  it('gold clears the attribute', () => {
    applyAccentSwatch('violet');
    applyAccentSwatch('gold');
    expect(root().hasAttribute('data-accent')).toBe(false);
  });
  it('init applies persisted swatch', () => {
    localStorage.setItem('diwata-accent', 'emerald');
    expect(initAccent()).toBe('emerald');
    expect(root().getAttribute('data-accent')).toBe('emerald');
  });
  it('applyAccent writes inline vars and does not persist', () => {
    applyAccent('var(--ae-color-blue-400)', { hover: 'var(--ae-color-blue-500)', text: '#000' });
    expect(root().style.getPropertyValue('--ae-color-accent')).toBe('var(--ae-color-blue-400)');
    expect(root().style.getPropertyValue('--ae-color-accent-hover')).toBe('var(--ae-color-blue-500)');
    expect(root().style.getPropertyValue('--ae-color-accent-text')).toBe('#000');
    expect(getAccent()).toBe('gold'); // untouched
    clearAccent();
    expect(root().style.getPropertyValue('--ae-color-accent')).toBe('');
  });
});

describe('contrast', () => {
  it('defaults normal, toggles to high and back', () => {
    expect(getContrast()).toBe('normal');
    expect(toggleContrast()).toBe('high');
    expect(root().getAttribute('data-contrast')).toBe('high');
    expect(toggleContrast()).toBe('normal');
    expect(root().hasAttribute('data-contrast')).toBe(false);
  });
  it('set persists', () => {
    setContrast('high');
    expect(localStorage.getItem('diwata-contrast')).toBe('high');
  });
});

describe('density', () => {
  it('defaults comfortable, toggles to compact and back', () => {
    expect(getDensity()).toBe('comfortable');
    expect(toggleDensity()).toBe('compact');
    expect(root().getAttribute('data-density')).toBe('compact');
    expect(toggleDensity()).toBe('comfortable');
    expect(root().hasAttribute('data-density')).toBe(false);
  });
  it('set persists', () => {
    setDensity('compact');
    expect(localStorage.getItem('diwata-density')).toBe('compact');
  });
});

describe('reducedMotion', () => {
  it('defaults system, toggles to reduced and back', () => {
    expect(getMotion()).toBe('system');
    expect(toggleMotion()).toBe('reduced');
    expect(root().getAttribute('data-motion')).toBe('reduced');
    expect(toggleMotion()).toBe('system');
    expect(root().hasAttribute('data-motion')).toBe(false);
  });
  it('set persists', () => {
    setMotion('reduced');
    expect(localStorage.getItem('diwata-motion')).toBe('reduced');
  });
});
