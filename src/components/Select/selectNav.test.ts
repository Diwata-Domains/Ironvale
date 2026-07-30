import { describe, expect, it } from 'vitest';
import { clampIndex, stepIndex, typeAheadIndex, type SelectNavOption } from './selectNav.js';

const OPTS: SelectNavOption[] = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Avocado' },
  { value: 'c', label: 'Banana' },
  { value: 'd', label: 'Cherry' },
];

describe('clampIndex', () => {
  it('keeps an in-range index', () => {
    expect(clampIndex(2, 4)).toBe(2);
  });
  it('clamps below 0 and above the last index', () => {
    expect(clampIndex(-3, 4)).toBe(0);
    expect(clampIndex(9, 4)).toBe(3);
  });
  it('returns -1 for an empty list', () => {
    expect(clampIndex(0, 0)).toBe(-1);
  });
});

describe('stepIndex', () => {
  it('moves down and up without wrapping', () => {
    expect(stepIndex(0, 1, 4)).toBe(1);
    expect(stepIndex(3, 1, 4)).toBe(3); // pinned at the end
    expect(stepIndex(0, -1, 4)).toBe(0); // pinned at the top
    expect(stepIndex(2, -1, 4)).toBe(1);
  });
  it('returns -1 for an empty list', () => {
    expect(stepIndex(0, 1, 0)).toBe(-1);
  });
});

describe('typeAheadIndex', () => {
  it('jumps to the first label matching a single key', () => {
    expect(typeAheadIndex(OPTS, 'b', 0)).toBe(2);
    expect(typeAheadIndex(OPTS, 'c', 0)).toBe(3);
  });

  it('cycles through same-prefix options on repeated single keys', () => {
    // Two options start with "A": pressing "a" again advances.
    expect(typeAheadIndex(OPTS, 'a', 0)).toBe(1); // from Apple → Avocado
    expect(typeAheadIndex(OPTS, 'a', 1)).toBe(0); // from Avocado → wraps to Apple
  });

  it('is case-insensitive', () => {
    expect(typeAheadIndex(OPTS, 'BAN', 0)).toBe(2);
  });

  it('a multi-char buffer stays on the current match when it still qualifies', () => {
    // Buffer "av" from Avocado (index 1) keeps index 1 rather than skipping.
    expect(typeAheadIndex(OPTS, 'av', 1)).toBe(1);
    // From Apple (index 0), "av" advances to Avocado.
    expect(typeAheadIndex(OPTS, 'av', 0)).toBe(1);
  });

  it('returns -1 when nothing matches or the query is empty', () => {
    expect(typeAheadIndex(OPTS, 'z', 0)).toBe(-1);
    expect(typeAheadIndex(OPTS, '', 0)).toBe(-1);
    expect(typeAheadIndex([], 'a', 0)).toBe(-1);
  });
});
