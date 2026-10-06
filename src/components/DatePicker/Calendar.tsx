import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  addDays,
  addMonths,
  buildMonthGrid,
  clampSupported,
  clampYMD,
  compareYMD,
  formatISO,
  formatLong,
  formatMonthTitle,
  isOutside,
  parseBound,
  parseISO,
  todayYMD,
  warnOnce,
  weekEdge,
  weekdayNames,
  type YMD,
} from './dateMath.js';

export interface CalendarProps {
  /** The chosen day as `YYYY-MM-DD`, or `""` for none. */
  value: string;
  /** Called with `YYYY-MM-DD` when the user picks a day. */
  onSelect: (value: string) => void;
  /** Earliest selectable day, inclusive (`YYYY-MM-DD`). */
  min?: string;
  /** Latest selectable day, inclusive (`YYYY-MM-DD`). */
  max?: string;
  /** 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: 0 | 1;
  /** Move keyboard focus onto the grid when it mounts (a popover wants this). */
  autoFocus?: boolean;
  /** Accessible name for the grid; defaults to the visible month title. */
  'aria-label'?: string;
  className?: string;
}

/**
 * One month as a grid of days — the presentational half of {@link DatePicker},
 * usable on its own as an inline calendar.
 *
 * Strings in, strings out: `value`, `min`, `max` and the `onSelect` argument are
 * all `YYYY-MM-DD` calendar days. No `Date` crosses the API and nothing is ever
 * converted through UTC, so the day you see is the day you get in any timezone.
 *
 * Keyboard (WAI-ARIA grid pattern, roving tabindex): arrows move by day / week,
 * Home / End to the start / end of the week, PageUp / PageDown by month (with
 * Shift, by year), Enter / Space selects. Days outside `min`–`max` are disabled
 * and focus never moves past them. Days of the adjacent months are shown muted
 * and are selectable — choosing one simply lands in that month.
 */
export function Calendar({
  value,
  onSelect,
  min,
  max,
  weekStartsOn = 1,
  autoFocus = false,
  'aria-label': ariaLabel,
  className,
}: CalendarProps) {
  const selected = parseISO(value);
  const minDay = parseBound(min, 'min');
  const maxDay = parseBound(max, 'max');
  const today = todayYMD();
  // `min` after `max` leaves nothing to choose: every day is disabled and focus
  // rests on the month title instead of being parked on a dead cell.
  const emptyRange = !!minDay && !!maxDay && compareYMD(minDay, maxDay) > 0;
  if (emptyRange) warnOnce(`DatePicker: min="${min}" is after max="${max}"; no day can be chosen.`);

  /** Inside the supported years, then inside `min`–`max`. */
  const bound = (day: YMD) =>
    emptyRange ? clampSupported(day) : clampYMD(clampSupported(day), minDay, maxDay);

  // The focused day drives both the roving tabindex and which month is shown.
  const [focused, setFocused] = useState<YMD>(() => bound(selected ?? today));
  const gridRef = useRef<HTMLTableElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  // A ONE-SHOT request to pull DOM focus onto the focused day: raised by a user
  // gesture inside the calendar (or `autoFocus` on mount) and spent by the very
  // next render. It never stays armed, so a later change of `value` from the
  // parent cannot steal focus from wherever the user has gone.
  const wantsFocus = useRef(autoFocus);

  // Follow an outside change of `value` (e.g. the footer's "Today").
  useEffect(() => {
    const next = parseISO(value);
    if (next) setFocused(bound(next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const focusedISO = formatISO(focused);
  // No dependency list on purpose: the request is spent on the render that
  // follows it, whether or not the focused day actually changed.
  useEffect(() => {
    if (!wantsFocus.current) return;
    wantsFocus.current = false;
    const target = emptyRange
      ? titleRef.current
      : gridRef.current?.querySelector<HTMLElement>(`[data-date="${focusedISO}"]`);
    target?.focus({ preventScroll: true });
  });

  const weeks = useMemo(
    () => buildMonthGrid(focused.y, focused.m, weekStartsOn),
    [focused.y, focused.m, weekStartsOn],
  );
  const names = useMemo(() => weekdayNames(weekStartsOn), [weekStartsOn]);
  const title = formatMonthTitle(focused.y, focused.m);

  const isDisabled = (day: YMD) =>
    emptyRange || isOutside(day, minDay, maxDay) || day.y < 1 || day.y > 9999;

  const move = (next: YMD) => {
    wantsFocus.current = true;
    setFocused(bound(next));
  };
  // The month buttons change the view without dragging focus off themselves.
  const page = (delta: number) => {
    setFocused((f) => bound(addMonths(f, delta)));
  };

  const choose = (day: YMD) => {
    if (isDisabled(day)) return;
    wantsFocus.current = true;
    setFocused(day);
    onSelect(formatISO(day));
  };

  function onKeyDown(e: KeyboardEvent) {
    let next: YMD | null = null;
    switch (e.key) {
      case 'ArrowLeft':
        next = addDays(focused, -1);
        break;
      case 'ArrowRight':
        next = addDays(focused, 1);
        break;
      case 'ArrowUp':
        next = addDays(focused, -7);
        break;
      case 'ArrowDown':
        next = addDays(focused, 7);
        break;
      case 'Home':
        next = weekEdge(focused, weekStartsOn, 'start');
        break;
      case 'End':
        next = weekEdge(focused, weekStartsOn, 'end');
        break;
      case 'PageUp':
        next = addMonths(focused, e.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = addMonths(focused, e.shiftKey ? 12 : 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(focused);
        return;
      default:
        return;
    }
    e.preventDefault();
    move(next);
  }

  const prevMonthEnd = addDays({ y: focused.y, m: focused.m, d: 1 }, -1);
  const nextMonthStart = addDays(addMonths({ y: focused.y, m: focused.m, d: 1 }, 1), 0);
  const prevDisabled = emptyRange || isOutside(prevMonthEnd, minDay, null) || prevMonthEnd.y < 1;
  const nextDisabled =
    emptyRange || isOutside(nextMonthStart, null, maxDay) || nextMonthStart.y > 9999;

  return (
    <div className={['iv-calendar', className].filter(Boolean).join(' ')}>
      <div className="iv-calendar__head">
        <button
          type="button"
          className="iv-calendar__nav"
          aria-label="Previous month"
          // aria-disabled, never `disabled`: a button that disables itself while it
          // holds focus drops focus to <body>, out of the popover's key handling.
          aria-disabled={prevDisabled || undefined}
          onClick={(e) => {
            // WebKit does not focus a button on click — it would blur the grid and
            // leave focus on <body>, outside the popover's key handling.
            e.currentTarget.focus({ preventScroll: true });
            if (!prevDisabled) page(-1);
          }}
        >
          <span className="iv-calendar__chevron iv-calendar__chevron--prev" aria-hidden="true" />
        </button>
        {/* A live region: paging announces the month that is now showing. */}
        <div
          ref={titleRef}
          className="iv-calendar__title"
          aria-live="polite"
          aria-atomic="true"
          tabIndex={-1}
        >
          {title}
        </div>
        <button
          type="button"
          className="iv-calendar__nav"
          aria-label="Next month"
          aria-disabled={nextDisabled || undefined}
          onClick={(e) => {
            e.currentTarget.focus({ preventScroll: true });
            if (!nextDisabled) page(1);
          }}
        >
          <span className="iv-calendar__chevron iv-calendar__chevron--next" aria-hidden="true" />
        </button>
      </div>
      <table
        ref={gridRef}
        className="iv-calendar__grid"
        role="grid"
        aria-label={ariaLabel ?? title}
        onKeyDown={onKeyDown}
      >
        <thead>
          <tr>
            {names.map((n) => (
              <th key={n.long} scope="col" abbr={n.long} className="iv-calendar__weekday">
                {n.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]!.iso}>
              {week.map((day) => {
                const disabled = isDisabled(day);
                const isSelected = !!selected && day.iso === value;
                const isToday = day.y === today.y && day.m === today.m && day.d === today.d;
                const isFocused = day.iso === focusedISO;
                const classes = [
                  'iv-calendar__day',
                  !day.inMonth && 'iv-calendar__day--outside',
                  isToday && 'iv-calendar__day--today',
                  isSelected && 'iv-calendar__day--selected',
                  disabled && 'iv-calendar__day--disabled',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <td
                    key={day.iso}
                    role="gridcell"
                    data-date={day.iso}
                    className={classes}
                    tabIndex={isFocused && !emptyRange ? 0 : -1}
                    aria-selected={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    aria-disabled={disabled || undefined}
                    aria-label={formatLong(day)}
                    onClick={() => choose(day)}
                  >
                    {day.d}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
