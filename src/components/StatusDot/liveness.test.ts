import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LIVENESS_THRESHOLDS,
  freshness,
  livenessState,
} from './liveness.js';

const NOW = Date.parse('2026-07-28T12:00:00.000Z');
const ago = (ms: number) => new Date(NOW - ms).toISOString();

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe('livenessState', () => {
  it('maps recent activity to live', () => {
    expect(livenessState(ago(30 * 1000), NOW)).toBe('live');
    expect(livenessState(ago(4 * MIN), NOW)).toBe('live');
  });

  it('treats the live boundary inclusively', () => {
    expect(livenessState(ago(DEFAULT_LIVENESS_THRESHOLDS.live), NOW)).toBe('live');
  });

  it('maps mid-age activity to idle', () => {
    expect(livenessState(ago(30 * MIN), NOW)).toBe('idle');
    expect(livenessState(ago(6 * HOUR), NOW)).toBe('idle');
    expect(livenessState(ago(DEFAULT_LIVENESS_THRESHOLDS.idle), NOW)).toBe('idle');
  });

  it('maps stale activity to neutral', () => {
    expect(livenessState(ago(2 * DAY), NOW)).toBe('neutral');
  });

  it('maps missing / unparseable timestamps to neutral', () => {
    expect(livenessState(null, NOW)).toBe('neutral');
    expect(livenessState(undefined, NOW)).toBe('neutral');
    expect(livenessState('not-a-date', NOW)).toBe('neutral');
  });

  it('treats a future timestamp as live', () => {
    expect(livenessState(new Date(NOW + 10 * MIN).toISOString(), NOW)).toBe('live');
  });

  it('accepts epoch millis and Date inputs', () => {
    expect(livenessState(NOW - MIN, NOW)).toBe('live');
    expect(livenessState(new Date(NOW - 2 * DAY), NOW)).toBe('neutral');
  });

  it('honours custom thresholds', () => {
    const tight = { live: MIN, idle: 2 * MIN };
    expect(livenessState(ago(90 * 1000), NOW, tight)).toBe('idle');
    expect(livenessState(ago(3 * MIN), NOW, tight)).toBe('neutral');
  });
});

describe('freshness', () => {
  it('labels sub-minute as just now', () => {
    expect(freshness(ago(10 * 1000), NOW)).toBe('just now');
  });

  it('labels minutes and hours', () => {
    expect(freshness(ago(5 * MIN), NOW)).toBe('5m ago');
    expect(freshness(ago(3 * HOUR), NOW)).toBe('3h ago');
  });

  it('labels days under a week', () => {
    expect(freshness(ago(2 * DAY), NOW)).toBe('2d ago');
  });

  it('falls back to a date beyond a week', () => {
    expect(freshness(ago(10 * DAY), NOW)).toBe(new Date(NOW - 10 * DAY).toLocaleDateString());
  });

  it('labels missing timestamps as never', () => {
    expect(freshness(null, NOW)).toBe('never');
    expect(freshness('nonsense', NOW)).toBe('never');
  });
});
