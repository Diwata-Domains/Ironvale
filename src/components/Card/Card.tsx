import type { HTMLAttributes } from 'react';

export type CardVariant = 'base' | 'raised' | 'flush';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({ variant = 'base', className, ...props }: CardProps) {
  const classes = ['iv-card', `iv-card--${variant}`, className].filter(Boolean).join(' ');
  return <div {...props} className={classes} />;
}
