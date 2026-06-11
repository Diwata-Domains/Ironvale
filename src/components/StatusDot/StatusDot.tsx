import type { HTMLAttributes } from 'react';

export type StatusDotColor = 'green' | 'yellow' | 'red' | 'grey';
export type StatusDotSize = 'sm' | 'md' | 'lg';

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  color?: StatusDotColor;
  size?: StatusDotSize;
  pulse?: boolean;
}

export function StatusDot({ color = 'grey', size = 'md', pulse = false, className, ...props }: StatusDotProps) {
  const classes = [
    'iv-dot',
    `iv-dot--${color}`,
    size !== 'md' ? `iv-dot--${size}` : '',
    pulse ? 'iv-dot--pulse' : '',
    className,
  ].filter(Boolean).join(' ');

  return <span {...props} className={classes} />;
}
