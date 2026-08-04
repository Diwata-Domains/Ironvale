// @vitest-environment jsdom
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const ITEMS = [
  { key: 'mutya', label: 'Mutya' },
  { key: 'today', label: 'Today', badge: 2 },
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

describe('Tabs', () => {
  it('renders one button per item and marks the active one', () => {
    act(() => root.render(<Tabs items={ITEMS} activeKey="mutya" onChange={() => {}} />));
    const buttons = host.querySelectorAll('button.iv-tab');
    expect(buttons.length).toBe(2);
    expect(buttons[0].className).toContain('iv-tab--active');
    expect(buttons[1].className).not.toContain('iv-tab--active');
  });

  it('renders a badge and alert modifier when badge is set', () => {
    act(() => root.render(<Tabs items={ITEMS} activeKey="mutya" onChange={() => {}} />));
    const today = host.querySelectorAll('button.iv-tab')[1];
    expect(today.className).toContain('iv-tab--alert');
    expect(today.querySelector('.iv-tab__badge')?.textContent).toBe('2');
  });

  it('fires onChange with the key when a tab is clicked', () => {
    const onChange = vi.fn();
    act(() => root.render(<Tabs items={ITEMS} activeKey="mutya" onChange={onChange} />));
    const today = host.querySelectorAll('button.iv-tab')[1] as HTMLButtonElement;
    act(() => today.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(onChange).toHaveBeenCalledWith('today');
  });

  it('treats badge={0} as absent (no badge, no alert modifier)', () => {
    const items = [{ key: 'mutya', label: 'Mutya', badge: 0 }];
    act(() => root.render(<Tabs items={items} activeKey="mutya" onChange={() => {}} />));
    const btn = host.querySelectorAll('button.iv-tab')[0];
    expect(btn.className).not.toContain('iv-tab--alert');
    expect(btn.querySelector('.iv-tab__badge')).toBeNull();
  });
});
