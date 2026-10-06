// @vitest-environment jsdom
import { createRoot, type Root } from 'react-dom/client';
import { act, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Calendar } from './Calendar.js';
import { DatePicker, computePopoverPosition, type DatePickerProps } from './DatePicker.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  // A fixed "now": Tuesday 6 October 2026, mid-afternoon on the local clock.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 6, 15, 0, 0));
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.useRealTimers();
});

const seen: string[] = [];
function Harness(props: Partial<DatePickerProps> & { initial?: string }) {
  const { initial = '', ...rest } = props;
  const [value, setValue] = useState(initial);
  return (
    <DatePicker
      aria-label="Due date"
      {...rest}
      value={value}
      onChange={(v) => {
        seen.push(v);
        setValue(v);
      }}
    />
  );
}

function mount(props: Partial<DatePickerProps> & { initial?: string } = {}) {
  seen.length = 0;
  act(() => root.render(<Harness {...props} />));
}

const trigger = () => host.querySelector<HTMLButtonElement>('.iv-datepicker__trigger')!;
const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"]');
const cell = (iso: string) => document.body.querySelector<HTMLElement>(`[data-date="${iso}"]`)!;
const focusedISO = () => (document.activeElement as HTMLElement | null)?.getAttribute('data-date');
const title = () => document.body.querySelector('.iv-calendar__title')!.textContent;
const action = (name: string) =>
  Array.from(document.body.querySelectorAll<HTMLButtonElement>('.iv-datepicker__action')).find(
    (b) => b.textContent === name,
  );

function open() {
  act(() => trigger().click());
}
function key(k: string, init: KeyboardEventInit = {}) {
  const target = (document.activeElement as HTMLElement) ?? document.body;
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init }));
  });
}

describe('DatePicker — the field', () => {
  it('shows the placeholder, then the chosen day in readable form', () => {
    mount();
    expect(trigger().textContent).toBe('Pick a date…');
    expect(trigger().getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    // The accessible name carries the label AND the state — a bare label would hide
    // the chosen date from a screen reader (review 2026-10-06).
    expect(trigger().getAttribute('aria-label')).toBe('Due date: Pick a date…');
    act(() => root.unmount());
    root = createRoot(host);
    mount({ initial: '2026-10-06' });
    expect(trigger().getAttribute('aria-label')).toMatch(/^Due date: .*6.*2026/);
    expect(trigger().textContent).toMatch(/6/);
    expect(trigger().textContent).toMatch(/2026/);
    expect(trigger().textContent).toMatch(/Tue/);
  });

  it('a value that is not a real day reads as none, never as a wrong day', () => {
    mount({ initial: '2026-02-30' });
    expect(trigger().textContent).toBe('Pick a date…');
  });

  it('disabled does not open', () => {
    mount({ disabled: true });
    open();
    expect(dialog()).toBeNull();
  });
});

describe('DatePicker — opening and choosing', () => {
  it('opens a labelled dialog with a grid, focus on the chosen day', () => {
    mount({ initial: '2026-10-14' });
    open();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(dialog()!.getAttribute('aria-label')).toBe('Due date — choose a date');
    expect(trigger().getAttribute('aria-controls')).toBe(dialog()!.id);
    const grid = dialog()!.querySelector('[role="grid"]')!;
    expect(grid.getAttribute('aria-label')).toBe('October 2026');
    expect(grid.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    expect(focusedISO()).toBe('2026-10-14');
    expect(cell('2026-10-14').getAttribute('aria-selected')).toBe('true');
    expect(cell('2026-10-14').tabIndex).toBe(0);
    // Roving tabindex: exactly one cell is in the tab order.
    expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
  });

  it('with no value, focus opens on today, which is marked', () => {
    mount();
    open();
    expect(focusedISO()).toBe('2026-10-06');
    expect(cell('2026-10-06').getAttribute('aria-current')).toBe('date');
    expect(cell('2026-10-07').getAttribute('aria-current')).toBeNull();
    expect(cell('2026-10-06').getAttribute('aria-selected')).toBe('false');
  });

  it('clicking a day hands back the same YYYY-MM-DD string, closes, and returns focus', () => {
    mount();
    open();
    act(() => cell('2026-10-21').click());
    expect(seen).toEqual(['2026-10-21']);
    expect(dialog()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('string in, string out: no day ever shifts, at either end of a month or year', () => {
    // Start on the day before and step onto each target, so choosing it is a change.
    for (const [before, iso] of [
      ['2026-09-30', '2026-10-01'],
      ['2026-10-30', '2026-10-31'],
      ['2025-12-31', '2026-01-01'],
      ['2026-12-30', '2026-12-31'],
      ['2024-02-28', '2024-02-29'],
      ['2026-03-07', '2026-03-08'],
    ] as const) {
      act(() => root.unmount());
      root = createRoot(host);
      mount({ initial: before });
      open();
      expect(focusedISO()).toBe(before);
      key('ArrowRight');
      expect(focusedISO()).toBe(iso);
      key('Enter');
      expect(seen).toEqual([iso]);
    }
  });

  it('a day of the adjacent month is muted but choosable', () => {
    mount({ initial: '2026-10-14' });
    open();
    expect(cell('2026-09-30').className).toContain('iv-calendar__day--outside');
    expect(cell('2026-10-01').className).not.toContain('iv-calendar__day--outside');
    act(() => cell('2026-11-03').click());
    expect(seen).toEqual(['2026-11-03']);
  });

  it('Today and Clear', () => {
    mount({ initial: '2026-03-01' });
    open();
    act(() => action('Today')!.click());
    expect(seen).toEqual(['2026-10-06']);
    expect(document.activeElement).toBe(trigger());
    open();
    act(() => action('Clear')!.click());
    expect(seen).toEqual(['2026-10-06', '']);
    expect(trigger().textContent).toBe('Pick a date…');
    open();
    expect(action('Clear')!.disabled).toBe(true); // nothing to clear
  });

  it('clearable={false} offers no Clear', () => {
    mount({ initial: '2026-10-06', clearable: false });
    open();
    expect(action('Clear')).toBeUndefined();
    expect(action('Today')).toBeDefined();
  });
});

describe('DatePicker — keyboard', () => {
  it('ArrowDown on the field opens it', () => {
    mount({ initial: '2026-10-14' });
    act(() => trigger().focus());
    key('ArrowDown');
    expect(dialog()).not.toBeNull();
    expect(focusedISO()).toBe('2026-10-14');
  });

  it('arrows move by day and by week', () => {
    mount({ initial: '2026-10-14' });
    open();
    key('ArrowRight');
    expect(focusedISO()).toBe('2026-10-15');
    key('ArrowLeft');
    key('ArrowLeft');
    expect(focusedISO()).toBe('2026-10-13');
    key('ArrowDown');
    expect(focusedISO()).toBe('2026-10-20');
    key('ArrowUp');
    key('ArrowUp');
    expect(focusedISO()).toBe('2026-10-06');
  });

  it('Home and End go to the edges of the week', () => {
    mount({ initial: '2026-10-14' }); // a Wednesday
    open();
    key('Home');
    expect(focusedISO()).toBe('2026-10-12');
    key('End');
    expect(focusedISO()).toBe('2026-10-18');
  });

  it('PageUp / PageDown move by month, with Shift by year, and announce the month', () => {
    mount({ initial: '2026-10-14' });
    open();
    const live = document.body.querySelector('.iv-calendar__title')!;
    expect(live.getAttribute('aria-live')).toBe('polite');
    key('PageDown');
    expect(focusedISO()).toBe('2026-11-14');
    expect(title()).toBe('November 2026');
    key('PageUp');
    key('PageUp');
    expect(focusedISO()).toBe('2026-09-14');
    key('PageDown', { shiftKey: true });
    expect(focusedISO()).toBe('2027-09-14');
    key('PageUp', { shiftKey: true });
    key('PageUp', { shiftKey: true });
    expect(focusedISO()).toBe('2025-09-14');
    expect(title()).toBe('September 2025');
  });

  it('walks across the year boundary and through 29 February', () => {
    mount({ initial: '2026-12-31' });
    open();
    key('ArrowRight');
    expect(focusedISO()).toBe('2027-01-01');
    expect(title()).toBe('January 2027');
    key('ArrowLeft');
    expect(focusedISO()).toBe('2026-12-31');
    act(() => root.unmount());
    root = createRoot(host);
    mount({ initial: '2024-02-28' });
    open();
    key('ArrowRight');
    expect(focusedISO()).toBe('2024-02-29');
    key('ArrowRight');
    expect(focusedISO()).toBe('2024-03-01');
    // 31 January + one month pins to the last day of February.
    act(() => root.unmount());
    root = createRoot(host);
    mount({ initial: '2026-01-31' });
    open();
    key('PageDown');
    expect(focusedISO()).toBe('2026-02-28');
  });

  it('Enter and Space choose the focused day', () => {
    mount({ initial: '2026-10-14' });
    open();
    key('ArrowRight');
    key('Enter');
    expect(seen).toEqual(['2026-10-15']);
    open();
    key('ArrowDown');
    key(' ');
    expect(seen).toEqual(['2026-10-15', '2026-10-22']);
  });

  it('Escape closes without choosing and returns focus to the field', () => {
    mount({ initial: '2026-10-14' });
    open();
    key('ArrowRight');
    key('Escape');
    expect(dialog()).toBeNull();
    expect(seen).toEqual([]);
    expect(document.activeElement).toBe(trigger());
  });

  it('Tab stays inside the popover', () => {
    mount({ initial: '2026-10-14' });
    open();
    const stops = Array.from(
      dialog()!.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]'),
    );
    const first = stops[0]!;
    const last = stops[stops.length - 1]!;
    act(() => last.focus());
    key('Tab');
    expect(document.activeElement).toBe(first);
    key('Tab', { shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});

describe('DatePicker — min / max', () => {
  it('days outside the window are disabled and cannot be chosen', () => {
    mount({ initial: '2026-10-14', min: '2026-10-10', max: '2026-10-20' });
    open();
    expect(cell('2026-10-09').getAttribute('aria-disabled')).toBe('true');
    expect(cell('2026-10-10').getAttribute('aria-disabled')).toBeNull();
    expect(cell('2026-10-20').getAttribute('aria-disabled')).toBeNull();
    expect(cell('2026-10-21').getAttribute('aria-disabled')).toBe('true');
    act(() => cell('2026-10-09').click());
    expect(seen).toEqual([]);
    expect(dialog()).not.toBeNull();
  });

  it('the keyboard never moves past the bounds, and the month buttons stop there', () => {
    mount({ initial: '2026-10-19', min: '2026-10-10', max: '2026-10-20' });
    open();
    key('ArrowRight');
    key('ArrowRight');
    key('ArrowRight');
    expect(focusedISO()).toBe('2026-10-20');
    key('PageUp');
    expect(focusedISO()).toBe('2026-10-10');
    const [prev, next] = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.iv-calendar__nav'));
    // aria-disabled, never `disabled`: a button that disables itself while focused
    // drops focus to <body> in a real browser (review 2026-10-06).
    expect(prev!.disabled).toBe(false);
    expect(prev!.getAttribute('aria-disabled')).toBe('true');
    expect(next!.getAttribute('aria-disabled')).toBe('true');
    act(() => prev!.click());
    expect(title()).toMatch(/October 2026/); // activation is ignored
  });

  it('paging to the edge of the range keeps focus on the button that got there', () => {
    mount({ initial: '2026-10-14', min: '2026-09-20' });
    open();
    const prev = document.body.querySelector<HTMLButtonElement>('.iv-calendar__nav')!;
    act(() => prev.focus());
    act(() => prev.click());
    expect(title()).toMatch(/September 2026/);
    expect(prev.getAttribute('aria-disabled')).toBe('true');
    expect(document.activeElement).toBe(prev);
    expect(dialog()!.contains(document.activeElement)).toBe(true);
  });

  it('min after max: nothing is choosable, focus rests on the title, and it says so once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount({ initial: '2026-10-14', min: '2026-10-20', max: '2026-10-10' });
    open();
    expect(document.body.querySelectorAll('[role="gridcell"]:not([aria-disabled="true"])')).toHaveLength(0);
    expect(document.activeElement?.className).toBe('iv-calendar__title');
    act(() => cell('2026-10-14').click());
    key('Enter');
    expect(seen).toEqual([]);
    expect(warn.mock.calls.some(([m]) => /is after max/.test(String(m)))).toBe(true);
    warn.mockRestore();
  });

  it('a bound that is not a real day is ignored, and says so', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount({ initial: '2026-10-14', max: '2026-10-32' });
    open();
    expect(document.body.querySelectorAll('[aria-disabled="true"][role="gridcell"]')).toHaveLength(0);
    expect(warn.mock.calls.some(([m]) => /max="2026-10-32"/.test(String(m)))).toBe(true);
    warn.mockRestore();
  });

  it('Today is unavailable when today is outside the window', () => {
    mount({ min: '2026-11-01' });
    open();
    expect(action('Today')!.disabled).toBe(true);
    // Focus opens on the nearest allowed day instead of a disabled today.
    expect(focusedISO()).toBe('2026-11-01');
  });
});

describe('DatePicker — review 2026-10-06', () => {
  it('the unmeasured popover stays focusable: never visibility:hidden, never off-screen', () => {
    // jsdom ignores visibility, so the focus bug this guards was invisible to the
    // suite: a real browser refuses to focus inside a hidden box.
    mount({ initial: '2026-10-14' });
    open();
    const style = dialog()!.style;
    expect(style.visibility).not.toBe('hidden');
    expect(style.display).not.toBe('none');
    expect(focusedISO()).toBe('2026-10-14');
  });

  it('choosing the day already chosen closes without reporting a change', () => {
    mount({ initial: '2026-10-14' });
    open();
    key('Enter');
    expect(seen).toEqual([]);
    expect(dialog()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('never emits a year the format cannot spell', () => {
    mount({ initial: '9999-06-15' });
    open();
    key('PageDown', { shiftKey: true });
    expect(focusedISO()).toBe('9999-12-31');
    key('ArrowRight');
    expect(focusedISO()).toBe('9999-12-31');
    key('Enter');
    expect(seen).toEqual(['9999-12-31']);
    act(() => root.unmount());
    root = createRoot(host);
    mount({ initial: '0001-06-15' });
    open();
    key('PageUp', { shiftKey: true });
    expect(focusedISO()).toBe('0001-01-01');
    key('ArrowLeft');
    key('Enter');
    expect(seen).toEqual(['0001-01-01']);
    for (const v of seen) expect(v).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('becoming disabled while open closes it, and nothing can be chosen', () => {
    function Wrap({ off }: { off: boolean }) {
      return <DatePicker aria-label="Due" value="2026-10-14" disabled={off} onChange={(v) => seen.push(v)} />;
    }
    seen.length = 0;
    act(() => root.render(<Wrap off={false} />));
    open();
    expect(dialog()).not.toBeNull();
    act(() => root.render(<Wrap off />));
    expect(dialog()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(seen).toEqual([]);
  });

  it('Today is read at the click, not when the popover was drawn', () => {
    vi.setSystemTime(new Date(2026, 9, 6, 23, 59, 0));
    mount();
    open();
    vi.setSystemTime(new Date(2026, 9, 7, 0, 1, 0));
    act(() => action('Today')!.click());
    expect(seen).toEqual(['2026-10-07']);
  });

  it('closes when its field scrolls out of view', () => {
    mount({ initial: '2026-10-14' });
    open();
    const rect = vi
      .spyOn(trigger(), 'getBoundingClientRect')
      .mockReturnValue({ top: -900, bottom: -864, left: 40, right: 240, width: 200, height: 36, x: 40, y: -900, toJSON: () => ({}) });
    act(() => window.dispatchEvent(new Event('scroll')));
    expect(dialog()).toBeNull();
    rect.mockRestore();
  });

  it('Escape closes only the picker: it never reaches a parent dialog or the page', () => {
    const heard = vi.fn();
    document.addEventListener('keydown', heard);
    mount({ initial: '2026-10-14' });
    open();
    key('Escape');
    expect(dialog()).toBeNull();
    expect(heard.mock.calls.filter(([e]) => (e as KeyboardEvent).key === 'Escape')).toHaveLength(0);
    // Same when focus is back on the field while it is open.
    open();
    act(() => trigger().focus());
    key('Escape');
    expect(dialog()).toBeNull();
    expect(heard.mock.calls.filter(([e]) => (e as KeyboardEvent).key === 'Escape')).toHaveLength(0);
    document.removeEventListener('keydown', heard);
  });

  it('Enter and Space in the grid are consumed (no page scroll, no form submit)', () => {
    for (const k of ['Enter', ' ']) {
      act(() => root.unmount());
      root = createRoot(host);
      mount({ initial: '2026-10-14' });
      open();
      key('ArrowRight');
      const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true });
      act(() => {
        document.activeElement!.dispatchEvent(e);
      });
      expect(e.defaultPrevented).toBe(true);
    }
  });

  it('removes every window and document listener when it closes or unmounts', () => {
    const added: string[] = [];
    const removed: string[] = [];
    const spies = [window, document].flatMap((t) => [
      vi.spyOn(t, 'addEventListener').mockImplementation(function (this: EventTarget, type: string) {
        added.push(type);
      } as never),
      vi.spyOn(t, 'removeEventListener').mockImplementation(function (this: EventTarget, type: string) {
        removed.push(type);
      } as never),
    ]);
    mount({ initial: '2026-10-14' });
    open();
    const mine = (list: string[]) => list.filter((t) => ['scroll', 'resize', 'mousedown'].includes(t)).sort();
    expect(mine(added)).toEqual(['mousedown', 'resize', 'scroll']);
    act(() => root.unmount());
    root = createRoot(host);
    expect(mine(removed)).toEqual(['mousedown', 'resize', 'scroll']);
    spies.forEach((s) => s.mockRestore());
  });
});

describe('DatePicker — pointer', () => {
  it('the month buttons page the view without choosing or stealing focus', () => {
    mount({ initial: '2026-10-14' });
    open();
    const [prev, next] = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.iv-calendar__nav'));
    expect(prev!.getAttribute('aria-label')).toBe('Previous month');
    act(() => next!.focus());
    act(() => next!.click());
    expect(title()).toBe('November 2026');
    expect(document.activeElement).toBe(next);
    act(() => prev!.click());
    act(() => prev!.click());
    expect(title()).toBe('September 2026');
    expect(seen).toEqual([]);
  });

  it('a press outside closes without choosing; a press inside does not', () => {
    mount({ initial: '2026-10-14' });
    open();
    act(() => {
      dialog()!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(dialog()).not.toBeNull();
    act(() => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(dialog()).toBeNull();
    expect(seen).toEqual([]);
  });

  it('the popover is portalled to <body>, outside the field', () => {
    mount();
    open();
    expect(host.contains(dialog())).toBe(false);
    expect(dialog()!.parentElement).toBe(document.body);
  });
});

describe('weekStartsOn', () => {
  it('Monday by default, Sunday on request', () => {
    mount({ initial: '2026-10-14' });
    open();
    const heads = () =>
      Array.from(document.body.querySelectorAll('.iv-calendar__weekday')).map((th) => th.getAttribute('abbr'));
    expect(heads()[0]).toBe('Monday');
    expect(document.body.querySelector('tbody tr td')!.getAttribute('data-date')).toBe('2026-09-28');
    act(() => root.unmount());
    root = createRoot(host);
    mount({ initial: '2026-10-14', weekStartsOn: 0 });
    open();
    expect(heads()[0]).toBe('Sunday');
    expect(document.body.querySelector('tbody tr td')!.getAttribute('data-date')).toBe('2026-09-27');
    key('Home');
    expect(focusedISO()).toBe('2026-10-11');
  });
});

describe('Calendar — on its own', () => {
  it('is an inline grid that reports the chosen day and does not grab focus', () => {
    const picked: string[] = [];
    const before = document.activeElement;
    act(() =>
      root.render(<Calendar value="2026-10-14" onSelect={(v) => picked.push(v)} aria-label="Pick a day" />),
    );
    expect(document.activeElement).toBe(before);
    const grid = host.querySelector('[role="grid"]')!;
    expect(grid.getAttribute('aria-label')).toBe('Pick a day');
    const day = host.querySelector<HTMLElement>('[data-date="2026-10-20"]')!;
    expect(day.getAttribute('aria-label')).toMatch(/Tuesday/);
    act(() => day.click());
    expect(picked).toEqual(['2026-10-20']);
  });
});

describe('Calendar — focus is a one-shot (review 2026-10-06)', () => {
  it('a later change of value never pulls focus back from where the user went', () => {
    function Inline({ value }: { value: string }) {
      return (
        <>
          <Calendar value={value} onSelect={() => {}} />
          <input aria-label="elsewhere" />
        </>
      );
    }
    act(() => root.render(<Inline value="2026-10-14" />));
    act(() => host.querySelector<HTMLElement>('[data-date="2026-10-20"]')!.click());
    const other = host.querySelector<HTMLInputElement>('input')!;
    act(() => other.focus());
    act(() => root.render(<Inline value="2026-10-25" />));
    expect(document.activeElement).toBe(other);
  });
});

describe('computePopoverPosition', () => {
  const viewport = { width: 1000, height: 800 };
  const popover = { width: 280, height: 340 };
  it('opens below when there is room', () => {
    expect(computePopoverPosition({ top: 100, bottom: 136, left: 40 }, popover, viewport)).toEqual({
      top: 140, left: 40, placement: 'below',
    });
  });
  it('flips above near the bottom edge', () => {
    const at = computePopoverPosition({ top: 700, bottom: 736, left: 40 }, popover, viewport);
    expect(at.placement).toBe('above');
    expect(at.top).toBe(700 - 4 - 340);
  });
  it('never leaves the viewport on either axis', () => {
    const right = computePopoverPosition({ top: 100, bottom: 136, left: 950 }, popover, viewport);
    expect(right.left).toBe(1000 - 280 - 8);
    const cramped = computePopoverPosition({ top: 150, bottom: 186, left: -50 }, popover, { width: 1000, height: 300 });
    expect(cramped.left).toBe(8);
    expect(cramped.top).toBeGreaterThanOrEqual(8);
  });
});
