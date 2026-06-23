import type { KeyboardEvent, ReactNode } from 'react';
import { Card } from '../Card/Card.js';
import { Badge } from '../Badge/Badge.js';
import type { BadgeVariant } from '../Badge/Badge.js';
import { StatusDot } from '../StatusDot/StatusDot.js';
import type { StatusDotColor } from '../StatusDot/StatusDot.js';
import { Text } from '../Text/Text.js';

export interface ItemCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** Leading status dot colour. */
  status?: StatusDotColor;
  /** Optional trailing badge. */
  badge?: { label: string; variant?: BadgeVariant };
  /** Small caption line (source, time, etc.). */
  meta?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Compact overview card for a single item — a Grain packet or a Sanctum to-do. Composes Card,
 * StatusDot, Badge, and Text into the row pattern the Sovereign "Today" surface repeats.
 */
export function ItemCard({ title, description, status, badge, meta, onClick, className }: ItemCardProps) {
  const classes = ['iv-item-card', onClick ? 'iv-item-card--clickable' : '', className]
    .filter(Boolean)
    .join(' ');

  const interactive = onClick
    ? {
        onClick,
        role: 'button' as const,
        tabIndex: 0,
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
          }
        },
      }
    : {};

  return (
    <Card variant="raised" className={classes} {...interactive}>
      <div className="iv-item-card__head">
        {status && <StatusDot color={status} />}
        <Text variant="label" className="iv-item-card__title">{title}</Text>
        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
      </div>
      {description && (
        <Text variant="body" className="iv-item-card__desc">{description}</Text>
      )}
      {meta && <Text variant="caption" className="iv-item-card__meta">{meta}</Text>}
    </Card>
  );
}
