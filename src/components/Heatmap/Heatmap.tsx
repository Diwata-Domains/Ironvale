import { useMemo } from 'react';

import {
  buildHeatmapGrid,
  DEFAULT_THRESHOLDS,
  type HeatmapCell,
  type HeatmapDatum,
} from './heatmapGrid.js';

export interface HeatmapProps {
  /** Daily counts (ISO `yyyy-mm-dd`). Duplicate days aggregate. */
  data: readonly HeatmapDatum[];
  /** Number of week columns. Defaults to 26 (half a year); GitHub uses 53. */
  weeks?: number;
  /** ISO `yyyy-mm-dd` the grid ends on. REQUIRED so rendering is deterministic
   *  (pass "today" from the caller). */
  endDate: string;
  /** Level thresholds: count >= thresholds[i] → level i+1. */
  thresholds?: readonly number[];
  /** What one unit means, for cell titles + the summary — e.g. "signals". */
  unit?: string;
  /** Accessible summary label. Defaults to "<total> <unit> in the last <weeks> weeks". */
  label?: string;
  /** Cell square size in px (gap scales with it). Default 11. */
  cellSize?: number;
  /** Show the Less→More legend. Default true. */
  legend?: boolean;
  /** When provided, day cells render as real, keyboard-reachable `<button>`s
   *  and clicking (or Enter/Space on) a day reports its datum. When absent the
   *  grid stays fully non-interactive (decorative spans under one summary). */
  onDayClick?: (datum: HeatmapCell) => void;
  className?: string;
}

const DAY_ROWS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

/**
 * GitHub-style activity heatmap. Columns are weeks (oldest → newest), rows are
 * days (Sun → Sat); each cell's intensity ramps 0–4 through the shared accent
 * token, so it follows the active theme, accent swatch, and any domain tint.
 * Cells carry native titles + aria-labels; the grid announces one summary.
 */
export function Heatmap({
  data,
  weeks = 26,
  endDate,
  thresholds = DEFAULT_THRESHOLDS,
  unit = 'items',
  label,
  cellSize = 11,
  legend = true,
  onDayClick,
  className,
}: HeatmapProps) {
  const grid = useMemo(
    () => buildHeatmapGrid(data, weeks, endDate, thresholds),
    [data, weeks, endDate, thresholds],
  );

  const summary = label ?? `${grid.total} ${unit} in the last ${weeks} weeks`;
  const interactive = Boolean(onDayClick);
  const classes = ['iv-heatmap', interactive && 'iv-heatmap--interactive', className]
    .filter(Boolean)
    .join(' ');
  const sizeStyle = { '--iv-heatmap-cell': `${cellSize}px` } as React.CSSProperties;

  return (
    // Non-interactive: one flat image with a summary. Interactive: the cells are
    // real buttons, so the figure must NOT be role="img" (that would hide them
    // from the accessibility tree) — the grid group carries the summary instead.
    <figure
      className={classes}
      style={sizeStyle}
      role={interactive ? undefined : 'img'}
      aria-label={interactive ? undefined : summary}
    >
      <div className="iv-heatmap__months" aria-hidden>
        {grid.monthLabels.map((m) => (
          <span
            key={`${m.weekIndex}-${m.label}`}
            className="iv-heatmap__month"
            style={{ gridColumnStart: m.weekIndex + 1 }}
          >
            {m.label}
          </span>
        ))}
      </div>
      <div className="iv-heatmap__body">
        <div className="iv-heatmap__days" aria-hidden>
          {DAY_ROWS.map((d, i) => (
            <span key={i} className="iv-heatmap__day">
              {d}
            </span>
          ))}
        </div>
        <div
          className="iv-heatmap__grid"
          aria-hidden={interactive ? undefined : true}
          role={interactive ? 'group' : undefined}
          aria-label={interactive ? summary : undefined}
        >
          {grid.weeks.map((week, w) => (
            <div key={w} className="iv-heatmap__week">
              {week.map((cell, d) => {
                if (!cell) {
                  return <span key={d} className="iv-heatmap__cell iv-heatmap__cell--pad" />;
                }
                const cellLabel = `${cell.count} ${unit} · ${cell.date}`;
                return interactive ? (
                  <button
                    key={d}
                    type="button"
                    className="iv-heatmap__cell"
                    data-level={cell.level}
                    title={cellLabel}
                    aria-label={cellLabel}
                    onClick={() => onDayClick?.(cell)}
                  />
                ) : (
                  <span
                    key={d}
                    className="iv-heatmap__cell"
                    data-level={cell.level}
                    title={cellLabel}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {legend && (
        <figcaption className="iv-heatmap__legend" aria-hidden>
          <span className="iv-heatmap__legend-text">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className="iv-heatmap__cell" data-level={level} />
          ))}
          <span className="iv-heatmap__legend-text">More</span>
        </figcaption>
      )}
    </figure>
  );
}
