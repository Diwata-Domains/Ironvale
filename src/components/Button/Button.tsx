import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = ['iv-button', `iv-button--${variant}`, `iv-button--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return <button {...props} type={type} className={classes} />;
}
