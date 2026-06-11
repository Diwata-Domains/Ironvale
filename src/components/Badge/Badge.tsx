import type { HTMLAttributes } from 'react';

export type BadgeIntent = 'success' | 'warning' | 'error' | 'neutral' | 'info';
export type BadgeTier = 'sovereign' | 'adept' | 'guild';
export type BadgeVariant = BadgeIntent | BadgeTier;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'neutral', className, ...props }: BadgeProps) {
  const classes = ['iv-badge', `iv-badge--${variant}`, className].filter(Boolean).join(' ');
  return <span {...props} className={classes} />;
}
