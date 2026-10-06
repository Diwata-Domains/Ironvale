/**
 * Pure calendar arithmetic for {@link Calendar} / {@link DatePicker}.
 *
 * A date here is a CALENDAR DAY on the user's wall — three integers — never an
 * instant. Everything is computed on (year, month, day) so no timezone, DST
 * change, or UTC conversion can move a day. Nothing in this file parses a date
 * string with `new Date(...)` or formats one with `toISOString()`: both go
 * through UTC and shift the day for anyone west (or far east) of Greenwich.
 */

export interface YMD {
  y: number;
  /** 1–12 */
  m: number;
  /** 1–31 */
  d: number;
}

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number): number {
  if (m === 2) return isLeapYear(y) ? 29 : 28;
  return m === 4 || m === 6 || m === 9 || m === 11 ? 30 : 31;
}

/** Parse `YYYY-MM-DD` by splitting the string. Returns null for anything that is
 *  not a real calendar day (`2026-02-30`, `""`, `2026-1-5`). */
export function parseISO(value: string | null | undefined): YMD | null {
  if (!value) return null;
  const match = ISO_RE.exec(value);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;
  return { y, m, d };
}

export function formatISO({ y, m, d }: YMD): string {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Days since 1970-01-01 in the proleptic Gregorian calendar (Hinnant's
 *  `days_from_civil`) — integer math only. */
export function toDayNumber({ y, m, d }: YMD): number {
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

/** Inverse of {@link toDayNumber} (Hinnant's `civil_from_days`). */
export function fromDayNumber(n: number): YMD {
  const z = n + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return { y: yoe + era * 400 + (m <= 2 ? 1 : 0), m, d };
}

/** 0 = Sunday … 6 = Saturday. */
export function weekdayOf(date: YMD): number {
  // 1970-01-01 was a Thursday (4).
  return (((toDayNumber(date) + 4) % 7) + 7) % 7;
}

export function addDays(date: YMD, delta: number): YMD {
  return fromDayNumber(toDayNumber(date) + delta);
}

/** Move by whole months, keeping the day where the target month has it and
 *  pinning to that month's last day where it does not (31 Jan + 1 → 28/29 Feb). */
export function addMonths(date: YMD, delta: number): YMD {
  const index = date.y * 12 + (date.m - 1) + delta;
  const y = Math.floor(index / 12);
  const m = index - y * 12 + 1;
  return { y, m, d: Math.min(date.d, daysInMonth(y, m)) };
}

export function compareYMD(a: YMD, b: YMD): number {
  return toDayNumber(a) - toDayNumber(b);
}

/** Keep `date` inside the inclusive `[min, max]` window (either bound optional). */
export function clampYMD(date: YMD, min: YMD | null, max: YMD | null): YMD {
  if (min && compareYMD(date, min) < 0) return min;
  if (max && compareYMD(date, max) > 0) return max;
  return date;
}

export function isOutside(date: YMD, min: YMD | null, max: YMD | null): boolean {
  return (!!min && compareYMD(date, min) < 0) || (!!max && compareYMD(date, max) > 0);
}

export interface GridDay extends YMD {
  iso: string;
  /** False for the leading / trailing days borrowed from adjacent months. */
  inMonth: boolean;
}

/**
 * The six-week grid for a month: always 42 days so the popover never changes
 * height from month to month. `weekStartsOn` is 0 (Sunday) or 1 (Monday).
 */
export function buildMonthGrid(y: number, m: number, weekStartsOn: 0 | 1): GridDay[][] {
  const first: YMD = { y, m, d: 1 };
  const lead = (weekdayOf(first) - weekStartsOn + 7) % 7;
  const start = toDayNumber(first) - lead;
  const weeks: GridDay[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: GridDay[] = [];
    for (let i = 0; i < 7; i++) {
      const day = fromDayNumber(start + w * 7 + i);
      week.push({ ...day, iso: formatISO(day), inMonth: day.y === y && day.m === m });
    }
    weeks.push(week);
  }
  return weeks;
}

/** Start / end of the week containing `date`, for Home / End. */
export function weekEdge(date: YMD, weekStartsOn: 0 | 1, edge: 'start' | 'end'): YMD {
  const offset = (weekdayOf(date) - weekStartsOn + 7) % 7;
  return addDays(date, edge === 'start' ? -offset : 6 - offset);
}

/** Today on the user's own clock — local getters only, never UTC. */
export function todayYMD(now: Date = new Date()): YMD {
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

/** The supported span: years 0001–9999, the only ones `YYYY-MM-DD` can spell.
 *  Navigation is clamped to it, so a picker can never emit anything else. */
export const EARLIEST: YMD = { y: 1, m: 1, d: 1 };
export const LATEST: YMD = { y: 9999, m: 12, d: 31 };

/** Keep `date` inside years 0001–9999. */
export function clampSupported(date: YMD): YMD {
  if (date.y < EARLIEST.y) return EARLIEST;
  if (date.y > LATEST.y) return LATEST;
  return date;
}

const warned = new Set<string>();
/** One console warning per distinct message, outside production builds only. */
export function warnOnce(message: string): void {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  if (env?.NODE_ENV === 'production' || warned.has(message)) return;
  warned.add(message);
  console.warn(`[ironvale] ${message}`);
}

/** Read a `min` / `max` prop: a bound that is not a real `YYYY-MM-DD` day is ignored
 *  (and said so once), never half-applied. */
export function parseBound(value: string | null | undefined, name: 'min' | 'max'): YMD | null {
  const parsed = parseISO(value);
  if (value && !parsed) warnOnce(`DatePicker: ${name}="${value}" is not a YYYY-MM-DD day; ignored.`);
  return parsed;
}

/** A local Date at noon for DISPLAY formatting only (noon keeps a DST gap at
 *  midnight from ever nudging the rendered day). */
export function displayDate({ y, m, d }: YMD): Date {
  const date = new Date(2000, 0, 1, 12);
  date.setFullYear(y, m - 1, d);
  return date;
}

/** "Tue 6 Oct 2026" in the reader's locale. */
export function formatReadable(date: YMD, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(displayDate(date));
}

/** "Tuesday, 6 October 2026" — the full name a screen reader announces per day. */
export function formatLong(date: YMD, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(displayDate(date));
}

/** "October 2026" */
export function formatMonthTitle(y: number, m: number, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    displayDate({ y, m, d: 1 }),
  );
}

/** Seven short weekday names in display order ("Mon" … "Sun"). */
export function weekdayNames(weekStartsOn: 0 | 1, locale?: string): { short: string; long: string }[] {
  const short = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const long = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  // 2023-01-01 was a Sunday.
  const sunday: YMD = { y: 2023, m: 1, d: 1 };
  return Array.from({ length: 7 }, (_, i) => {
    const day = displayDate(addDays(sunday, i + weekStartsOn));
    return { short: short.format(day), long: long.format(day) };
  });
}
