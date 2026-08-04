import type { ReactNode } from 'react';

export interface TabItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  ariaLabel?: string;
}

/**
 * A controlled tab strip. Renders only the row of tabs — the consumer renders
 * the active body from `activeKey`. Ported from Diwa's `.dw-tab` underline
 * pattern; a present `badge` adds an alert affordance (the ◈ analogue).
 */
export function Tabs({ items, activeKey, onChange, ariaLabel }: TabsProps) {
  return (
    <div className="iv-tabs" role="tablist" aria-label={ariaLabel}>
      {items.map((t) => {
        const active = t.key === activeKey;
        const hasBadge =
          t.badge !== undefined && t.badge !== null && t.badge !== '' && t.badge !== 0;
        const classes = [
          'iv-tab',
          active && 'iv-tab--active',
          hasBadge && 'iv-tab--alert',
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={classes}
            onClick={() => onChange(t.key)}
          >
            {t.icon && <span className="iv-tab__icon">{t.icon}</span>}
            {t.label}
            {hasBadge && <span className="iv-tab__badge">{t.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
