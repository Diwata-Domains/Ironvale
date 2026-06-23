import type { HTMLAttributes } from 'react';

export type ScrollAreaProps = HTMLAttributes<HTMLDivElement>;

/**
 * Overflow container with a themed, thin scrollbar. Use for scrollable panels (chat, overview lists)
 * inside the app shell.
 */
export function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  const classes = ['iv-scroll-area', className].filter(Boolean).join(' ');

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
}
