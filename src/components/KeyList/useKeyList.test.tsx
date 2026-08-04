// @vitest-environment jsdom
/**
 * Contract for useKeyList: j/k + arrows move selection AND focus, Enter
 * activates, '/' reaches the filter callback, and typing contexts are ignored.
 */
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useKeyList } from './useKeyList.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

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

function pressWindowKey(key: string, target?: HTMLElement) {
  act(() => {
    (target ?? window).dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
  });
}

function Demo({
  onActivate,
  onFilterKey,
}: {
  onActivate?: (i: number) => void;
  onFilterKey?: () => void;
}) {
  const items = ['alpha', 'beta', 'gamma'];
  const list = useKeyList({ count: items.length, onActivate, onFilterKey });
  return (
    <div>
      <input aria-label="filter" />
      {items.map((label, i) => (
        <a
          key={label}
          href={`#${label}`}
          ref={list.registerRow(i)}
          data-selected={i === list.selected}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

describe('useKeyList', () => {
  it('moves selection and focus with j/k and arrows, clamped to the list', () => {
    act(() => root.render(<Demo />));
    const rows = host.querySelectorAll<HTMLAnchorElement>('a');

    pressWindowKey('j');
    expect(rows[1].dataset.selected).toBe('true');
    expect(document.activeElement).toBe(rows[1]);

    pressWindowKey('ArrowDown');
    pressWindowKey('ArrowDown'); // clamped at the end
    expect(rows[2].dataset.selected).toBe('true');

    pressWindowKey('k');
    pressWindowKey('ArrowUp');
    pressWindowKey('ArrowUp'); // clamped at the start
    expect(rows[0].dataset.selected).toBe('true');
    expect(document.activeElement).toBe(rows[0]);
  });

  it('activates the selected row on Enter and reaches the filter on "/"', () => {
    const onActivate = vi.fn();
    const onFilterKey = vi.fn();
    act(() => root.render(<Demo onActivate={onActivate} onFilterKey={onFilterKey} />));

    pressWindowKey('j');
    pressWindowKey('Enter');
    expect(onActivate).toHaveBeenCalledWith(1);

    pressWindowKey('/');
    expect(onFilterKey).toHaveBeenCalled();
  });

  it('ignores keys while typing in an input', () => {
    const onActivate = vi.fn();
    act(() => root.render(<Demo onActivate={onActivate} />));
    const input = host.querySelector('input')!;
    input.focus();

    pressWindowKey('j', input);
    pressWindowKey('Enter', input);
    expect(onActivate).not.toHaveBeenCalled();
    expect(host.querySelector('a[data-selected="true"]')!.textContent).toBe('alpha');
  });
});
