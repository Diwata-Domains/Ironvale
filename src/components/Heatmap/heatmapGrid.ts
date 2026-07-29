/**
 * Pure grid math for the GitHub-style activity Heatmap.
 *
 * Layout contract (GitHub's): columns are weeks (oldest → newest), rows are
 * days Sunday → Saturday. The window is `weeks` columns ending on `endDate`;
 * days after `endDate` in the final column are `null` padding so the column
 * count stays honest. All dates are ISO `yyyy-mm-dd` strings, computed in UTC
 * so a viewer's timezone never shifts a cell across a day boundary.
 */

export interface HeatmapDatum {
  /** ISO `yyyy-mm-dd`. */
  date: string;
  count: number;
}

export interface HeatmapCell {
  date: string;
  count: number;
  /** 0 (none) … 4 (highest) — drives the color ramp. */
  level: number;
}

export interface HeatmapMonthLabel {
  weekIndex: number;
  label: string;
}

export interface HeatmapGrid {
  /** `weeks[column][row]` — row 0 = Sunday. `null` = padding after endDate. */
  weeks: (HeatmapCell | null)[][];
  monthLabels: HeatmapMonthLabel[];
  /** Sum of the in-window counts (out-of-window data is ignored). */
  total: number;
}

/** count >= thresholds[i] → level i+1; below the first threshold → 0. */
export const DEFAULT_THRESHOLDS: readonly number[] = [1, 3, 6, 10];

export function levelFor(count: number, thresholds: readonly number[] = DEFAULT_THRESHOLDS): number {
  let level = 0;
  for (let i = 0; i < thresholds.length; i += 1) {
    if (count >= thresholds[i]) level = i + 1;
  }
  return level;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 86_400_000;

function toUtc(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

function toIso(utc: number): string {
  const d = new Date(utc);
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${d.getUTCFullYear()}-${mm}-${dd}`;
}

export function buildHeatmapGrid(
  data: readonly HeatmapDatum[],
  weeks: number,
  endDate: string,
  thresholds: readonly number[] = DEFAULT_THRESHOLDS,
): HeatmapGrid {
  const end = toUtc(endDate);
  const endDow = new Date(end).getUTCDay(); // 0 = Sunday
  // First cell: Sunday of the column `weeks - 1` columns before the end column.
  const start = end - endDow * DAY_MS - (weeks - 1) * 7 * DAY_MS;

  const counts = new Map<string, number>();
  for (const { date, count } of data) {
    const t = toUtc(date);
    if (t < start || t > end) continue; // out of window
    counts.set(date, (counts.get(date) ?? 0) + count);
  }

  const grid: (HeatmapCell | null)[][] = [];
  const monthLabels: HeatmapMonthLabel[] = [];
  let total = 0;
  let lastMonth = -1;

  for (let w = 0; w < weeks; w += 1) {
    const column: (HeatmapCell | null)[] = [];
    const columnStart = start + w * 7 * DAY_MS;
    const month = new Date(columnStart).getUTCMonth();
    if (month !== lastMonth) {
      // Label a column only when the month it starts in changes (GitHub's rule).
      if (lastMonth !== -1) monthLabels.push({ weekIndex: w, label: MONTHS[month] });
      lastMonth = month;
    }
    for (let d = 0; d < 7; d += 1) {
      const t = columnStart + d * DAY_MS;
      if (t > end) {
        column.push(null); // padding after the end date
        continue;
      }
      const date = toIso(t);
      const count = counts.get(date) ?? 0;
      total += count;
      column.push({ date, count, level: levelFor(count, thresholds) });
    }
    grid.push(column);
  }

  return { weeks: grid, monthLabels, total };
}
