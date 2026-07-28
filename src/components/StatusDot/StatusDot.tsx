import type { HTMLAttributes } from 'react';

export type StatusDotColor = 'green' | 'yellow' | 'red' | 'grey';
/** Semantic liveness states — the vocabulary surfaces should reach for. */
export type StatusDotState = 'live' | 'idle' | 'error' | 'neutral';
export type StatusDotSize = 'sm' | 'md' | 'lg';

const STATE_COLOR: Record<StatusDotState, StatusDotColor> = {
  live: 'green',
  idle: 'yellow',
  error: 'red',
  neutral: 'grey',
};

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic liveness — sets the color and, for `live`, a subtle green pulse. */
  state?: StatusDotState;
  /** Low-level color override; used when `state` is not given. */
  color?: StatusDotColor;
  size?: StatusDotSize;
  /** Force the pulse on/off. Defaults on for `state="live"`, off otherwise. */
  pulse?: boolean;
  /** Accessible label. When omitted the dot is decorative (`aria-hidden`). */
  label?: string;
}

export function StatusDot({
  state,
  color,
  size = 'md',
  pulse,
  label,
  className,
  ...props
}: StatusDotProps) {
  const resolvedColor = color ?? (state ? STATE_COLOR[state] : 'grey');
  const resolvedPulse = pulse ?? state === 'live';

  const classes = [
    'iv-dot',
    `iv-dot--${resolvedColor}`,
    size !== 'md' ? `iv-dot--${size}` : '',
    resolvedPulse ? 'iv-dot--pulse' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const a11y = label
    ? ({ role: 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': true } as const);

  return <span {...a11y} {...props} className={classes} />;
}
