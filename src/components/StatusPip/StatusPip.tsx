import type { HTMLAttributes } from 'react';

/**
 * Semantic instrument status — deliberately distinct from the accent scale.
 * `ok` / `warn` / `red` map to the feedback tokens; `unavailable` is muted
 * ("no data" is a state, not an alarm).
 */
export type StatusPipStatus = 'ok' | 'warn' | 'red' | 'unavailable';

export interface StatusPipProps extends HTMLAttributes<HTMLSpanElement> {
  status: StatusPipStatus;
  /** Accessible label. Defaults to the status word. */
  label?: string;
}

export function StatusPip({ status, label, className, ...props }: StatusPipProps) {
  const classes = ['iv-pip', `iv-pip--${status}`, className].filter(Boolean).join(' ');
  return <span role="img" aria-label={label ?? status} {...props} className={classes} />;
}
