import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from './Calendar.js';
import {
  formatISO,
  formatReadable,
  isOutside,
  parseBound,
  parseISO,
  todayYMD,
} from './dateMath.js';

export interface DatePickerProps {
  /** The chosen day as `YYYY-MM-DD`, or `""` for none. */
  value: string;
  /** Called with `YYYY-MM-DD`, or `""` when cleared. */
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Earliest selectable day, inclusive (`YYYY-MM-DD`). */
  min?: string;
  /** Latest selectable day, inclusive (`YYYY-MM-DD`). */
  max?: string;
  /** Offer "Clear" in the popover footer. Default true. */
  clearable?: boolean;
  /** 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: 0 | 1;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

/** Keep the popover at least this far from every viewport edge. */
const VIEWPORT_MARGIN = 8;
/** Gap between the trigger and the popover along the vertical axis. */
const TRIGGER_GAP = 4;

interface PopoverCoords {
  top: number;
  left: number;
  placement: 'below' | 'above';
}

/**
 * Viewport (fixed) coordinates for the popover: below the trigger by default,
 * above when there is more room there, clamped so it can never leave the
 * viewport — the same flip-and-clamp doctrine as {@link Select}. Unlike a
 * Select menu, the popover keeps its own width (a month grid does not stretch).
 */
export function computePopoverPosition(
  triggerRect: Pick<DOMRect, 'top' | 'bottom' | 'left'>,
  popover: { width: number; height: number },
  viewport: { width: number; height: number },
): PopoverCoords {
  const spaceBelow = viewport.height - triggerRect.bottom - TRIGGER_GAP - VIEWPORT_MARGIN;
  const spaceAbove = triggerRect.top - TRIGGER_GAP - VIEWPORT_MARGIN;
  const placement: 'below' | 'above' =
    popover.height <= spaceBelow || spaceBelow >= spaceAbove ? 'below' : 'above';
  const rawTop =
    placement === 'below'
      ? triggerRect.bottom + TRIGGER_GAP
      : triggerRect.top - TRIGGER_GAP - popover.height;
  const top = Math.max(
    VIEWPORT_MARGIN,
    Math.min(rawTop, viewport.height - popover.height - VIEWPORT_MARGIN),
  );
  const left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(triggerRect.left, viewport.width - popover.width - VIEWPORT_MARGIN),
  );
  return { top, left, placement };
}

/**
 * A themed date field that replaces `<input type="date">` — whose picker is
 * drawn by the OS / webview and cannot follow the theme.
 *
 * Strings in, strings out: `value`, `min`, `max` and the `onChange` argument are
 * `YYYY-MM-DD` calendar days (or `""` for none). No `Date` crosses the API and
 * nothing is converted through UTC, so the chosen day never shifts by timezone.
 *
 * The popover is a `role="dialog"` holding a {@link Calendar}; it is portalled to
 * `document.body` and positioned with `position: fixed`, so an ancestor with
 * `overflow` or `backdrop-filter` can never clip or offset it.
 *
 * Keyboard: Enter / Space / ArrowDown on the field opens it with focus on the
 * chosen day (else today). In the grid: arrows by day / week, Home / End by
 * week, PageUp / PageDown by month (Shift: year), Enter / Space to choose.
 * Escape — or a click outside — closes and returns focus to the field.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date…',
  disabled = false,
  min,
  max,
  clearable = true,
  weekStartsOn = 1,
  className,
  id,
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<PopoverCoords | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();

  const selected = parseISO(value);
  const minDay = parseBound(min, 'min');
  const maxDay = parseBound(max, 'max');
  const todayDisabled = isOutside(todayYMD(), minDay, maxDay);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const popover = popoverRef.current;
    if (!trigger || !popover) return;
    const rect = trigger.getBoundingClientRect();
    // The field has scrolled out of view: a popover clamped to the viewport edge
    // would float detached from it. Close instead.
    if (
      rect.bottom < 0 ||
      rect.top > window.innerHeight ||
      rect.right < 0 ||
      rect.left > window.innerWidth
    ) {
      close(false);
      return;
    }
    setCoords(
      computePopoverPosition(
        rect,
        { width: popover.offsetWidth, height: popover.offsetHeight },
        { width: window.innerWidth, height: window.innerHeight },
      ),
    );
  }, [close]);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, reposition]);

  // A field that becomes disabled while open closes: a disabled picker never
  // shows a live calendar and can never emit a change.
  useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (popoverRef.current?.contains(t)) return;
      // The pointer went elsewhere on purpose — do not drag focus back.
      close(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, close]);

  const commit = (next: string) => {
    if (disabled) return;
    // Choosing the day that is already chosen is not a change — just close.
    if (next !== (selected ? value : '')) onChange(next);
    close(true);
  };

  function onTriggerKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    if (open) {
      // Focus normally sits inside the popover; if it is back on the field,
      // Escape still closes (and does not reach a parent dialog).
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onPopoverKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
      return;
    }
    if (e.key !== 'Tab') return;
    // The popover lives at the end of <body>: keep Tab cycling inside it, or
    // focus would fall off the document.
    const stops = Array.from(
      popoverRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([aria-disabled="true"]), [tabindex="0"]',
      ) ?? [],
    );
    if (stops.length === 0) return;
    const first = stops[0]!;
    const last = stops[stops.length - 1]!;
    const current = document.activeElement;
    if (e.shiftKey && current === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && current === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const readable = selected ? formatReadable(selected) : placeholder;

  const classes = [
    'iv-datepicker',
    open && 'iv-datepicker--open',
    disabled && 'iv-datepicker--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const popoverStyle: CSSProperties = coords
    ? { position: 'fixed', top: coords.top, left: coords.left }
    : // Unmeasured for one frame: kept in the layout and FOCUSABLE (the stylesheet
      // holds it at opacity 0 until `data-open`) — `visibility: hidden` here made
      // the calendar's focus-on-open a silent no-op in every real browser.
      { position: 'fixed', top: 0, left: 0, pointerEvents: 'none' };

  return (
    <div ref={rootRef} className={classes}>
      <button
        ref={triggerRef}
        type="button"
        className="iv-datepicker__trigger"
        id={id}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        // A label alone would HIDE the chosen date from the accessible name (it
        // replaces the button's text), so the name carries both.
        aria-label={ariaLabel ? `${ariaLabel}: ${readable}` : undefined}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
      >
        <span
          className={`iv-datepicker__value${selected ? '' : ' iv-datepicker__value--placeholder'}`}
        >
          {readable}
        </span>
        <span className="iv-datepicker__icon" aria-hidden="true" />
      </button>
      {open &&
        !disabled &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className={`iv-datepicker__popover${coords ? ` iv-datepicker__popover--${coords.placement}` : ''}`}
            role="dialog"
            id={dialogId}
            aria-label={ariaLabel ? `${ariaLabel} — choose a date` : 'Choose a date'}
            data-open={coords ? 'true' : undefined}
            // Focusable (not tabbable): a press on the popover's own padding or on a
            // control WebKit will not focus lands here instead of on <body>, so
            // Escape and Tab keep working.
            tabIndex={-1}
            style={popoverStyle}
            onKeyDown={onPopoverKeyDown}
          >
            <Calendar
              value={selected ? value : ''}
              onSelect={commit}
              min={min}
              max={max}
              weekStartsOn={weekStartsOn}
              autoFocus
            />
            <div className="iv-datepicker__foot">
              <button
                type="button"
                className="iv-datepicker__action"
                disabled={todayDisabled}
                // "Today" is read at the click, not at render: a popover left open
                // across midnight must not hand back yesterday.
                onClick={() => {
                  const now = todayYMD();
                  if (!isOutside(now, minDay, maxDay)) commit(formatISO(now));
                }}
              >
                Today
              </button>
              {clearable && (
                <button
                  type="button"
                  className="iv-datepicker__action"
                  disabled={!selected}
                  onClick={() => commit('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
