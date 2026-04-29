import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error = false, className, type = 'text', ...props }: InputProps) {
  const classes = ['iv-input', error ? 'iv-input--error' : null, className].filter(Boolean).join(' ');

  return <input {...props} type={type} className={classes} />;
}
