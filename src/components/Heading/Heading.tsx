import type { ComponentPropsWithoutRef, ElementType } from 'react';

/**
 * The section-heading scale, matching the app hierarchy:
 * 1 = page title, 2 = section title, 3 = subsection, 4 = micro-label (the
 * uppercase eyebrow above a group). The level drives BOTH the size/weight and,
 * by default, the semantic element (`h1`–`h4`) — override the tag with `as`
 * when the document outline needs a different level than the visual one.
 */
export type HeadingLevel = 1 | 2 | 3 | 4;

export type HeadingProps<T extends ElementType = 'h2'> = {
  level?: HeadingLevel;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, 'as'>;

const DEFAULT_TAG: Record<HeadingLevel, ElementType> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
};

export function Heading<T extends ElementType = 'h2'>({
  level = 2,
  as,
  className,
  ...props
}: HeadingProps<T>) {
  const Component = (as ?? DEFAULT_TAG[level]) as ElementType;
  const classes = ['iv-heading', `iv-heading--${level}`, className].filter(Boolean).join(' ');

  return <Component {...props} className={classes} />;
}
