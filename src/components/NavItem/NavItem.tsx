import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  icon?: ReactNode;
  label: string;
}

export function NavItem({ active = false, icon, label, className, ...props }: NavItemProps) {
  const classes = [
    'iv-nav-item',
    active ? 'iv-nav-item--active' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <a {...props} className={classes}>
      {icon && <span className="iv-nav-item__icon">{icon}</span>}
      <span className="iv-nav-item__label">{label}</span>
    </a>
  );
}
