import type { HTMLAttributes } from 'react';

export type StackDirection = 'vertical' | 'horizontal';
export type StackGap = 'sm' | 'md' | 'lg';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  wrap?: boolean;
  gap?: StackGap;
}

export function Stack({
  direction = 'vertical',
  wrap = false,
  gap = 'md',
  className,
  ...props
}: StackProps) {
  const classes = [
    'iv-stack',
    direction === 'horizontal' ? 'iv-stack--horizontal' : null,
    wrap ? 'iv-stack--wrap' : null,
    `iv-stack--gap-${gap}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return <div {...props} className={classes} />;
}
