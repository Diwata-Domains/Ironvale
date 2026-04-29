import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type TextElement = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
export type TextVariant = 'body' | 'label' | 'heading' | 'caption';

export type TextProps<T extends ElementType = 'p'> = {
  as?: T;
  variant?: TextVariant;
} & Omit<ComponentPropsWithoutRef<T>, 'as'>;

export function Text<T extends ElementType = 'p'>({
  as,
  variant = 'body',
  className,
  ...props
}: TextProps<T>) {
  const Component = (as ?? 'p') as ElementType;
  const classes = ['iv-text', `iv-text--${variant}`, className].filter(Boolean).join(' ');

  return <Component {...props} className={classes} />;
}
