import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heatmap } from '../index.js';
import type { HeatmapDatum } from '../index.js';

// Deterministic demo data: a wave of activity with hot streaks, seeded (no Math.random).
function demoData(endDate: string, weeks: number): HeatmapDatum[] {
  const [y, m, d] = endDate.split('-').map(Number);
  const end = Date.UTC(y, m - 1, d);
  const out: HeatmapDatum[] = [];
  for (let i = 0; i < weeks * 7; i += 1) {
    const t = end - i * 86_400_000;
    const date = new Date(t).toISOString().slice(0, 10);
    // pseudo-pattern: weekday-weighted wave, hot every ~11 days, quiet Sundays
    const dow = new Date(t).getUTCDay();
    const wave = Math.round(4 + 4 * Math.sin(i / 4));
    const hot = i % 11 === 0 ? 8 : 0;
    const count = dow === 0 ? 0 : Math.max(0, wave + hot - 3);
    if (count > 0) out.push({ date, count });
  }
  return out;
}

const meta = {
  title: 'Primitives/Heatmap',
  component: Heatmap,
  parameters: {
    docs: {
      description: {
        component:
          'GitHub-style activity heatmap. Weeks as columns, days as rows; the 0–4 intensity ramp ' +
          'mixes the shared accent into the surface, so it follows the theme, the accent axis, ' +
          'and any domain tint. Pass endDate explicitly so rendering is deterministic.',
      },
    },
  },
} satisfies Meta<typeof Heatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HalfYear: Story = {
  args: {
    data: demoData('2026-07-28', 26),
    weeks: 26,
    endDate: '2026-07-28',
    unit: 'signals',
  },
};

export const Quarter: Story = {
  args: {
    data: demoData('2026-07-28', 13),
    weeks: 13,
    endDate: '2026-07-28',
    unit: 'entries',
    cellSize: 13,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    weeks: 26,
    endDate: '2026-07-28',
    unit: 'signals',
  },
};
