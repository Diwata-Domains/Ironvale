// @vitest-environment jsdom
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { usePanelState } from './usePanelState.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
let last: [boolean, () => void];

function Probe({ persistKey, def }: { persistKey: string; def?: boolean }) {
  last = usePanelState(persistKey, def);
  return null;
}

beforeEach(() => {
  localStorage.clear();
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe('usePanelState', () => {
  it('defaults to false, or to defaultCollapsed when given', () => {
    act(() => root.render(<Probe key="k.a" persistKey="k.a" />));
    expect(last[0]).toBe(false);
    act(() => root.render(<Probe key="k.b" persistKey="k.b" def={true} />));
    expect(last[0]).toBe(true);
  });

  it('toggle flips state and persists "1"/"0"', () => {
    act(() => root.render(<Probe persistKey="k.c" />));
    act(() => last[1]());
    expect(last[0]).toBe(true);
    expect(localStorage.getItem('k.c')).toBe('1');
    act(() => last[1]());
    expect(last[0]).toBe(false);
    expect(localStorage.getItem('k.c')).toBe('0');
  });

  it('reads a persisted value on mount, overriding the default', () => {
    localStorage.setItem('k.d', '1');
    act(() => root.render(<Probe persistKey="k.d" def={false} />));
    expect(last[0]).toBe(true);
  });
});
