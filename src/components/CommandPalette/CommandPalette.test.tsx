// @vitest-environment jsdom
/**
 * Contract for the generic CommandPalette: ranking (ids/keywords beat titles),
 * keyboard selection (arrows + Enter), and dismissal (Escape) — all through the
 * single focus-trapped input.
 */
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CommandPalette, rankPaletteItem, type PaletteItem } from './CommandPalette.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const ITEMS: PaletteItem[] = [
  { id: 'ASSAY-1', title: 'Login page renders blank', keywords: ['VERIFY-0001-001', 'TASK-0042'] },
  { id: 'ASSAY-2', title: 'Checkout button moved', keywords: ['VERIFY-0002-001'] },
  { id: 'ASSAY-3', title: 'Footer typo fixed', hint: 'closed' },
];

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function pressKey(el: HTMLElement, key: string) {
  act(() => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  });
}

function paletteInput(): HTMLInputElement {
  return document.body.querySelector<HTMLInputElement>('.iv-cmdk-input')!;
}

describe('rankPaletteItem', () => {
  it('ranks exact id/keyword hits over substrings over title matches', () => {
    const item = ITEMS[0];
    expect(rankPaletteItem(item, 'assay-1')).toBe(0);
    expect(rankPaletteItem(item, 'VERIFY-0001-001')).toBe(0);
    expect(rankPaletteItem(item, 'verify-0001')).toBe(1);
    expect(rankPaletteItem(item, 'login')).toBe(2);
    expect(rankPaletteItem(item, 'blank')).toBe(3);
    expect(rankPaletteItem(item, 'zebra')).toBe(-1);
    expect(rankPaletteItem(item, '')).toBe(0);
  });
});

describe('CommandPalette', () => {
  it('mounts nothing when closed and lists items when open', () => {
    act(() =>
      root.render(
        <CommandPalette open={false} onClose={() => {}} items={ITEMS} onSelect={() => {}} />,
      ),
    );
    expect(document.body.querySelector('.iv-cmdk')).toBeNull();

    act(() =>
      root.render(<CommandPalette open onClose={() => {}} items={ITEMS} onSelect={() => {}} />),
    );
    expect(document.body.querySelector('.iv-cmdk')).not.toBeNull();
    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(3);
  });

  it('filters by keyword and selects with Enter', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    act(() =>
      root.render(<CommandPalette open onClose={onClose} items={ITEMS} onSelect={onSelect} />),
    );
    const input = paletteInput();

    setInputValue(input, 'VERIFY-0002');
    const options = document.body.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Checkout button moved');

    pressKey(input, 'Enter');
    expect(onSelect).toHaveBeenCalledWith(ITEMS[1]);
    expect(onClose).toHaveBeenCalled();
  });

  it('moves the active row with arrows and closes on Escape', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    act(() =>
      root.render(<CommandPalette open onClose={onClose} items={ITEMS} onSelect={onSelect} />),
    );
    const input = paletteInput();

    pressKey(input, 'ArrowDown');
    const active = document.body.querySelector('[data-active="true"]');
    expect(active!.textContent).toContain('Checkout button moved');

    pressKey(input, 'Enter');
    expect(onSelect).toHaveBeenCalledWith(ITEMS[1]);

    pressKey(input, 'Escape');
    expect(onClose).toHaveBeenCalledTimes(2); // once from select, once from Escape
  });

  it('shows the empty label when nothing matches', () => {
    act(() =>
      root.render(
        <CommandPalette
          open
          onClose={() => {}}
          items={ITEMS}
          onSelect={() => {}}
          emptyLabel="No matching tickets"
        />,
      ),
    );
    setInputValue(paletteInput(), 'zzzz');
    expect(document.body.querySelector('.iv-cmdk-empty')!.textContent).toBe('No matching tickets');
  });
});
