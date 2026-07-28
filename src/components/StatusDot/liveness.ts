import type { StatusDotState } from './StatusDot.js';

/** Recency thresholds (ms) mapping a last-activity timestamp to a liveness state. */
export interface LivenessThresholds {
  /** Age at or under this → `live`. */
  live: number;
  /** Age at or under this → `idle`; anything older → `neutral` (stale). */
  idle: number;
}

/** Default cadence: active within 5 min → live, within 24 h → idle, older/none → neutral. */
export const DEFAULT_LIVENESS_THRESHOLDS: LivenessThresholds = {
  live: 5 * 60 * 1000,
  idle: 24 * 60 * 60 * 1000,
};

function toMillis(at: string | number | Date | null | undefined): number | null {
  if (at == null) return null;
  if (at instanceof Date) {
    const t = at.getTime();
    return Number.isNaN(t) ? null : t;
  }
  if (typeof at === 'number') return Number.isFinite(at) ? at : null;
  const t = new Date(at).getTime();
  return Number.isNaN(t) ? null : t;
}

/**
 * Map a last-activity timestamp to a liveness state by recency. This is the
 * one place "health / last_run → dot state" lives, so every surface reads
 * liveness the same way. `null`/missing/unparseable → `neutral`; a future
 * timestamp counts as `live`.
 */
export function livenessState(
  lastSeen: string | number | Date | null | undefined,
  now: number = Date.now(),
  thresholds: LivenessThresholds = DEFAULT_LIVENESS_THRESHOLDS,
): StatusDotState {
  const ms = toMillis(lastSeen);
  if (ms == null) return 'neutral';
  const age = now - ms;
  if (age <= thresholds.live) return 'live';
  if (age <= thresholds.idle) return 'idle';
  return 'neutral';
}

/**
 * Human-friendly "freshness" label for a timestamp — `just now`, `3m ago`,
 * `2h ago`, `4d ago`, or a locale date for anything older than a week.
 * `null`/unparseable → `never`.
 */
export function freshness(
  at: string | number | Date | null | undefined,
  now: number = Date.now(),
): string {
  const ms = toMillis(at);
  if (ms == null) return 'never';
  const diff = now - ms;
  if (diff < 60000) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}
