import type { HTMLAttributes } from 'react';

export interface MonoStatProps extends HTMLAttributes<HTMLDivElement> {
  /** The number itself — rendered big, mono, tabular. */
  value: string | number;
  label: string;
  /** Quiet secondary line, e.g. "+3 this week". Omitted when absent. */
  delta?: string;
}

/**
 * MonoStat — one big mono numeral with its label. The instrument register's
 * unit of "reading a number at a glance": dense, calm, tabular-nums.
 */
export function MonoStat({ value, label, delta, className, ...props }: MonoStatProps) {
  const classes = ['iv-monostat', className].filter(Boolean).join(' ');
  return (
    <div {...props} className={classes}>
      <div className="iv-monostat-value">{value}</div>
      <div className="iv-monostat-label">{label}</div>
      {delta !== undefined && <div className="iv-monostat-delta">{delta}</div>}
    </div>
  );
}
