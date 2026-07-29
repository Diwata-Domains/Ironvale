import { describe, expect, it } from 'vitest';

import { buildHeatmapGrid, levelFor, DEFAULT_THRESHOLDS } from './heatmapGrid.js';

describe('levelFor', () => {
  it('maps 0 to level 0 and ramps through the thresholds', () => {
    // DEFAULT_THRESHOLDS = [1, 3, 6, 10]
    expect(levelFor(0, DEFAULT_THRESHOLDS)).toBe(0);
    expect(levelFor(1, DEFAULT_THRESHOLDS)).toBe(1);
    expect(levelFor(2, DEFAULT_THRESHOLDS)).toBe(1);
    expect(levelFor(3, DEFAULT_THRESHOLDS)).toBe(2);
    expect(levelFor(6, DEFAULT_THRESHOLDS)).toBe(3);
    expect(levelFor(10, DEFAULT_THRESHOLDS)).toBe(4);
    expect(levelFor(999, DEFAULT_THRESHOLDS)).toBe(4);
  });

  it('handles custom thresholds and never returns a negative level', () => {
    expect(levelFor(5, [10, 20, 30, 40])).toBe(0);
    expect(levelFor(-3, DEFAULT_THRESHOLDS)).toBe(0);
  });
});

describe('buildHeatmapGrid', () => {
  it('produces the requested number of week columns of 7 days ending on endDate', () => {
    const grid = buildHeatmapGrid([], 4, '2026-07-28');
    expect(grid.weeks).toHaveLength(4);
    for (const week of grid.weeks) expect(week).toHaveLength(7);
    const all = grid.weeks.flat();
    // last real cell is the end date; later cells in the final week are padding
    const real = all.filter((c) => c !== null);
    expect(real[real.length - 1]!.date).toBe('2026-07-28');
  });

  it('weeks start on Sunday (GitHub layout) and pad the tail with nulls', () => {
    // 2026-07-28 is a Tuesday → the last column has Wed..Sat as null padding
    const grid = buildHeatmapGrid([], 2, '2026-07-28');
    const last = grid.weeks[1];
    expect(last[0]!.date).toBe('2026-07-26'); // Sunday
    expect(last[2]!.date).toBe('2026-07-28'); // Tuesday (end)
    expect(last[3]).toBeNull();
    expect(last[6]).toBeNull();
  });

  it('joins counts onto the right days and computes levels', () => {
    const grid = buildHeatmapGrid(
      [
        { date: '2026-07-27', count: 4 },
        { date: '2026-07-28', count: 12 },
        { date: '2030-01-01', count: 99 }, // outside the window — ignored
      ],
      2,
      '2026-07-28',
    );
    const cells = grid.weeks.flat().filter(Boolean);
    const mon = cells.find((c) => c!.date === '2026-07-27')!;
    const tue = cells.find((c) => c!.date === '2026-07-28')!;
    expect(mon.count).toBe(4);
    expect(mon.level).toBe(2); // 4 → between 3 and 6
    expect(tue.count).toBe(12);
    expect(tue.level).toBe(4);
    // an untouched day is present with count 0 / level 0
    const sun = cells.find((c) => c!.date === '2026-07-26')!;
    expect(sun.count).toBe(0);
    expect(sun.level).toBe(0);
  });

  it('aggregates duplicate entries for the same day', () => {
    const grid = buildHeatmapGrid(
      [
        { date: '2026-07-28', count: 2 },
        { date: '2026-07-28', count: 3 },
      ],
      1,
      '2026-07-28',
    );
    const tue = grid.weeks.flat().find((c) => c?.date === '2026-07-28')!;
    expect(tue.count).toBe(5);
  });

  it('emits month labels where a column starts a new month', () => {
    // 10 weeks back from 2026-07-28 crosses May → June → July
    const grid = buildHeatmapGrid([], 10, '2026-07-28');
    const labels = grid.monthLabels.map((m) => m.label);
    expect(labels).toContain('Jun');
    expect(labels).toContain('Jul');
    // indexes are within the column range
    for (const m of grid.monthLabels) {
      expect(m.weekIndex).toBeGreaterThanOrEqual(0);
      expect(m.weekIndex).toBeLessThan(10);
    }
  });

  it('total sums only the in-window counts', () => {
    const grid = buildHeatmapGrid(
      [
        { date: '2026-07-28', count: 2 },
        { date: '1999-01-01', count: 50 },
      ],
      1,
      '2026-07-28',
    );
    expect(grid.total).toBe(2);
  });
});
