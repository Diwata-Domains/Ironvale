import type { HTMLAttributes, ReactNode } from 'react';
import { StatusPip, type StatusPipStatus } from '../StatusPip/StatusPip.js';

export interface TileProps extends HTMLAttributes<HTMLElement> {
  title: string;
  /** Semantic status: colors the header pip and (for red) the tile edge. */
  status?: StatusPipStatus;
  /** ISO timestamp of the data — rendered quietly as a <time> element. */
  asOf?: string;
  /** Deep link into the owning surface. A plain anchor — tiles never act. */
  href?: string;
  linkLabel?: string;
  children: ReactNode;
}

function formatAsOf(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Tile — the instrument card: a watch-only board panel with a status edge,
 * a quiet asOf timestamp, and a deep-link affordance. It renders readings;
 * it never carries action buttons (the owning surface does the acting).
 */
export function Tile({
  title,
  status,
  asOf,
  href,
  linkLabel,
  className,
  children,
  ...props
}: TileProps) {
  const classes = ['iv-tile', status ? `iv-tile--${status}` : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <section {...props} className={classes}>
      <header className="iv-tile-header">
        {status && <StatusPip status={status} />}
        <h2 className="iv-tile-title">{title}</h2>
        <div className="iv-tile-meta">
          {asOf && (
            <time className="iv-tile-asof" dateTime={asOf}>
              {formatAsOf(asOf)}
            </time>
          )}
          {href && (
            <a className="iv-tile-link" href={href} target="_blank" rel="noreferrer">
              {linkLabel ?? 'open'} ↗
            </a>
          )}
        </div>
      </header>
      <div className="iv-tile-body">{children}</div>
    </section>
  );
}
