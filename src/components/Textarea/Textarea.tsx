import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

/** Multi-line text field — the `Input` sibling for free-form, multi-row entry (chat, notes). */
export function Textarea({ error = false, className, rows = 3, ...props }: TextareaProps) {
  const classes = ['iv-textarea', error ? 'iv-textarea--error' : null, className]
    .filter(Boolean)
    .join(' ');

  return <textarea {...props} rows={rows} className={classes} />;
}
