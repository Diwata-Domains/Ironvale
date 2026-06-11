import type { HTMLAttributes } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
}

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  const classes = ['iv-spinner', `iv-spinner--${size}`, className].filter(Boolean).join(' ');
  return <span {...props} className={classes} role="status" aria-label="Loading" />;
}
