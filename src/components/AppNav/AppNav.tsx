import type { ReactNode } from 'react';
import { NavItem } from '../NavItem/NavItem.js';

export interface AppNavItem {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface AppNavProps {
  items: AppNavItem[];
  className?: string;
}

/**
 * Responsive navigation built from `NavItem`s. Renders a vertical rail on desktop and a horizontal
 * tab bar on mobile, designed to sit in the `nav` slot of `AppShell`.
 */
export function AppNav({ items, className }: AppNavProps) {
  const classes = ['iv-app-nav', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {items.map((item, index) => (
        <NavItem
          key={item.href ?? `${item.label}-${index}`}
          label={item.label}
          icon={item.icon}
          active={item.active}
          href={item.href}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
}
