import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  buildMonthGrid,
  clampYMD,
  compareYMD,
  clampSupported,
  daysInMonth,
  displayDate,
  formatISO,
  formatReadable,
  fromDayNumber,
  isLeapYear,
  isOutside,
  parseISO,
  toDayNumber,
  todayYMD,
  weekEdge,
  weekdayNames,
  weekdayOf,
} from './dateMath.js';

const d = (iso: string) => parseISO(iso)!;

describe('parseISO / formatISO', () => {
  it('round-trips a calendar day by splitting the string', () => {
    expect(parseISO('2026-10-06')).toEqual({ y: 2026, m: 10, d: 6 });
    expect(formatISO({ y: 2026, m: 1, d: 5 })).toBe('2026-01-05');
  });
  it('rejects anything that is not a real day', () => {
    for (const bad of ['', '2026-02-30', '2026-13-01', '2026-1-5', '2026-10-06T00:00:00Z', 'nope', '2025-02-29']) {
      expect(parseISO(bad)).toBeNull();
    }
    expect(parseISO(undefined)).toBeNull();
    expect(parseISO('2024-02-29')).toEqual({ y: 2024, m: 2, d: 29 });
  });
});

describe('month lengths and leap years', () => {
  it('knows the Gregorian rules', () => {
    expect([2024, 2000, 2400].every(isLeapYear)).toBe(true);
    expect([2023, 1900, 2100].some(isLeapYear)).toBe(false);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect([4, 6, 9, 11].map((m) => daysInMonth(2026, m))).toEqual([30, 30, 30, 30]);
    expect(daysInMonth(2026, 12)).toBe(31);
  });
});

describe('day numbers', () => {
  it('are a faithful, gap-free mapping over centuries', () => {
    expect(toDayNumber(d('1970-01-01'))).toBe(0);
    let prev = toDayNumber(d('1899-12-31'));
    let cursor = d('1899-12-31');
    for (let i = 0; i < 366 * 250; i += 97) {
      const next = addDays(cursor, 97);
      expect(toDayNumber(next)).toBe(prev + 97);
      expect(fromDayNumber(toDayNumber(next))).toEqual(next);
      prev += 97;
      cursor = next;
    }
  });
  it('names the weekday from integers alone', () => {
    expect(weekdayOf(d('2026-10-06'))).toBe(2); // Tuesday
    expect(weekdayOf(d('2000-01-01'))).toBe(6); // Saturday
    expect(weekdayOf(d('1969-12-31'))).toBe(3); // Wednesday, before the epoch
  });
});

describe('moving', () => {
  it('crosses month and year edges by day', () => {
    expect(formatISO(addDays(d('2026-12-31'), 1))).toBe('2027-01-01');
    expect(formatISO(addDays(d('2027-01-01'), -1))).toBe('2026-12-31');
    expect(formatISO(addDays(d('2024-02-28'), 1))).toBe('2024-02-29');
    expect(formatISO(addDays(d('2025-02-28'), 1))).toBe('2025-03-01');
  });
  it('is unmoved by daylight-saving days (no timestamps involved)', () => {
    // US spring-forward and fall-back days, and the days around them.
    expect(formatISO(addDays(d('2026-03-07'), 1))).toBe('2026-03-08');
    expect(formatISO(addDays(d('2026-03-08'), 1))).toBe('2026-03-09');
    expect(formatISO(addDays(d('2026-11-01'), 1))).toBe('2026-11-02');
    expect(formatISO(addDays(d('2026-11-01'), 7))).toBe('2026-11-08');
  });
  it('pins the day when the target month is shorter', () => {
    expect(formatISO(addMonths(d('2026-01-31'), 1))).toBe('2026-02-28');
    expect(formatISO(addMonths(d('2024-01-31'), 1))).toBe('2024-02-29');
    expect(formatISO(addMonths(d('2026-12-15'), 1))).toBe('2027-01-15');
    expect(formatISO(addMonths(d('2026-01-15'), -1))).toBe('2025-12-15');
    expect(formatISO(addMonths(d('2024-02-29'), 12))).toBe('2025-02-28');
    expect(formatISO(addMonths(d('2026-03-10'), -14))).toBe('2025-01-10');
  });
  it('finds the edges of a week for either week start', () => {
    // 2026-10-06 is a Tuesday.
    expect(formatISO(weekEdge(d('2026-10-06'), 1, 'start'))).toBe('2026-10-05');
    expect(formatISO(weekEdge(d('2026-10-06'), 1, 'end'))).toBe('2026-10-11');
    expect(formatISO(weekEdge(d('2026-10-06'), 0, 'start'))).toBe('2026-10-04');
    expect(formatISO(weekEdge(d('2026-10-06'), 0, 'end'))).toBe('2026-10-10');
  });
});

describe('bounds', () => {
  it('compares, clamps and tests the inclusive window', () => {
    expect(compareYMD(d('2026-10-06'), d('2026-10-07'))).toBeLessThan(0);
    expect(clampYMD(d('2026-10-01'), d('2026-10-05'), null)).toEqual(d('2026-10-05'));
    expect(clampYMD(d('2026-10-30'), null, d('2026-10-20'))).toEqual(d('2026-10-20'));
    expect(isOutside(d('2026-10-05'), d('2026-10-05'), d('2026-10-20'))).toBe(false);
    expect(isOutside(d('2026-10-20'), d('2026-10-05'), d('2026-10-20'))).toBe(false);
    expect(isOutside(d('2026-10-04'), d('2026-10-05'), null)).toBe(true);
    expect(isOutside(d('2026-10-21'), null, d('2026-10-20'))).toBe(true);
  });
});

describe('buildMonthGrid', () => {
  it('is always six full weeks, starting on the chosen weekday', () => {
    for (const start of [0, 1] as const) {
      for (let m = 1; m <= 12; m++) {
        const weeks = buildMonthGrid(2026, m, start);
        expect(weeks).toHaveLength(6);
        expect(weeks.every((w) => w.length === 7)).toBe(true);
        expect(weekdayOf(weeks[0]![0]!)).toBe(start);
        expect(weeks.flat().filter((c) => c.inMonth)).toHaveLength(daysInMonth(2026, m));
      }
    }
  });
  it('borrows the right days from the neighbours', () => {
    // October 2026 starts on a Thursday.
    const monday = buildMonthGrid(2026, 10, 1);
    expect(monday[0]!.map((c) => c.iso)).toEqual([
      '2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04',
    ]);
    const sunday = buildMonthGrid(2026, 10, 0);
    expect(sunday[0]![0]!.iso).toBe('2026-09-27');
    expect(monday[5]![6]!.iso).toBe('2026-11-08');
    // December rolls into January of the next year.
    expect(buildMonthGrid(2026, 12, 1)[5]![6]!.iso).toBe('2027-01-10');
    // February of a leap year shows the 29th in-month.
    expect(buildMonthGrid(2024, 2, 1).flat().find((c) => c.iso === '2024-02-29')!.inMonth).toBe(true);
  });
});

describe('the wall clock, in whatever zone the suite runs', () => {
  it('today is the local calendar day, not the UTC one', () => {
    const now = new Date();
    expect(todayYMD(now)).toEqual({ y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() });
    // 00:30 local on 6 Oct is 6 Oct, whatever UTC says at that instant.
    expect(todayYMD(new Date(2026, 9, 6, 0, 30))).toEqual({ y: 2026, m: 10, d: 6 });
    expect(todayYMD(new Date(2026, 9, 6, 23, 30))).toEqual({ y: 2026, m: 10, d: 6 });
  });
  it('display formatting never shifts the day', () => {
    for (const iso of ['2026-10-06', '2026-01-01', '2026-12-31', '2024-02-29', '2026-03-08', '2026-11-01']) {
      const label = formatReadable(d(iso), 'en-GB');
      expect(label).toContain(String(d(iso).d));
      expect(label).toContain(String(d(iso).y));
    }
    expect(formatReadable(d('2026-10-06'), 'en-GB')).toMatch(/^Tue,? 6 Oct 2026$/);
    expect(formatReadable(d('2026-01-01'), 'en-GB')).toMatch(/^Thu,? 1 Jan 2026$/);
  });
  it('weekday headers follow the week start', () => {
    expect(weekdayNames(1, 'en-GB').map((n) => n.short)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(weekdayNames(0, 'en-GB')[0]).toEqual({ short: 'Sun', long: 'Sunday' });
  });
});

describe('review 2026-10-06', () => {
  it('display dates are anchored at local noon, away from any midnight DST gap', () => {
    for (const day of [{ y: 2026, m: 10, d: 6 }, { y: 2018, m: 11, d: 4 }, { y: 2024, m: 2, d: 29 }]) {
      const at = displayDate(day);
      expect(at.getHours()).toBe(12);
      expect([at.getFullYear(), at.getMonth() + 1, at.getDate()]).toEqual([day.y, day.m, day.d]);
    }
  });

  it('keeps navigation inside the years YYYY-MM-DD can spell', () => {
    expect(formatISO(clampSupported(addMonths({ y: 9999, m: 6, d: 15 }, 12)))).toBe('9999-12-31');
    expect(formatISO(clampSupported(addMonths({ y: 1, m: 6, d: 15 }, -12)))).toBe('0001-01-01');
    expect(clampSupported({ y: 2026, m: 10, d: 6 })).toEqual({ y: 2026, m: 10, d: 6 });
  });
});
