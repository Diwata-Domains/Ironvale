// @vitest-environment jsdom
/**
 * Component contract for the Heatmap's two rendering modes:
 * - no onDayClick → decorative role="img" figure, zero buttons;
 * - onDayClick    → every real day is a <button> with a count+date aria-label,
 *                   clicks report the cell datum, padding days stay spans.
 */
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Heatmap } from './Heatmap.js';
import type { HeatmapCell } from './heatmapGrid.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const DATA = [
  { date: '2026-07-27', count: 4 },
  { date: '2026-07-28', count: 12 },
];

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe('Heatmap (non-interactive)', () => {
  it('renders a role="img" figure with a summary and no buttons', () => {
    act(() => {
      root.render(<Heatmap data={DATA} weeks={2} endDate="2026-07-28" unit="events" />);
    });
    const figure = host.querySelector('figure')!;
    expect(figure.getAttribute('role')).toBe('img');
    expect(figure.getAttribute('aria-label')).toBe('16 events in the last 2 weeks');
    expect(host.querySelectorAll('button').length).toBe(0);
  });
});

describe('Heatmap (onDayClick)', () => {
  it('renders real days as labelled buttons and keeps padding as spans', () => {
    act(() => {
      root.render(
        <Heatmap data={DATA} weeks={2} endDate="2026-07-28" unit="events" onDayClick={() => {}} />,
      );
    });
    // 2026-07-28 is a Tuesday → 7 + 3 real days; Wed..Sat pad the last column.
    const buttons = host.querySelectorAll('button.iv-heatmap__cell');
    expect(buttons.length).toBe(10);
    expect(host.querySelectorAll('.iv-heatmap__cell--pad').length).toBe(4);
    for (const b of buttons) expect((b as HTMLButtonElement).type).toBe('button');
    const tue = [...buttons].find((b) => b.getAttribute('aria-label')?.includes('2026-07-28'))!;
    expect(tue.getAttribute('aria-label')).toBe('12 events · 2026-07-28');
    // the figure is no longer a flat image; the grid group carries the summary
    expect(host.querySelector('figure')!.getAttribute('role')).toBeNull();
    const grid = host.querySelector('.iv-heatmap__grid')!;
    expect(grid.getAttribute('role')).toBe('group');
    expect(grid.getAttribute('aria-label')).toBe('16 events in the last 2 weeks');
    expect(grid.getAttribute('aria-hidden')).toBeNull();
  });

  it('reports the clicked day datum', () => {
    const onDayClick = vi.fn<[HeatmapCell], void>();
    act(() => {
      root.render(
        <Heatmap data={DATA} weeks={2} endDate="2026-07-28" unit="events" onDayClick={onDayClick} />,
      );
    });
    const tue = [...host.querySelectorAll('button.iv-heatmap__cell')].find((b) =>
      b.getAttribute('aria-label')?.includes('2026-07-28'),
    )!;
    act(() => {
      tue.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onDayClick).toHaveBeenCalledTimes(1);
    expect(onDayClick).toHaveBeenCalledWith({ date: '2026-07-28', count: 12, level: 4 });
  });
});
