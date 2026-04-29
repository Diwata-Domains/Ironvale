import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type SurfaceElement = 'div' | 'section' | 'article' | 'aside';
export type SurfaceVariant = 'base' | 'raised' | 'overlay';

export type SurfaceProps<T extends ElementType = 'div'> = {
  as?: T;
  variant?: SurfaceVariant;
} & Omit<ComponentPropsWithoutRef<T>, 'as'>;

export function Surface<T extends ElementType = 'div'>({
  as,
  variant = 'base',
  className,
  ...props
}: SurfaceProps<T>) {
  const Component = (as ?? 'div') as ElementType;
  const classes = ['iv-surface', `iv-surface--${variant}`, className].filter(Boolean).join(' ');

  return <Component {...props} className={classes} />;
}
