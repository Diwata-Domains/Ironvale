// @vitest-environment jsdom
/**
 * MonoStat contract: a big mono value with its label; the delta line renders
 * only when given.
 */
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { MonoStat } from './MonoStat.js';

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

describe('MonoStat', () => {
  it('renders the value and its label', () => {
    act(() => root.render(<MonoStat value={1204} label="users" />));
    expect(host.querySelector('.iv-monostat-value')!.textContent).toBe('1204');
    expect(host.querySelector('.iv-monostat-label')!.textContent).toBe('users');
  });

  it('renders an optional quiet delta', () => {
    act(() => root.render(<MonoStat value="12" label="waitlist" delta="+3 this week" />));
    expect(host.querySelector('.iv-monostat-delta')!.textContent).toBe('+3 this week');
  });

  it('omits the delta element when not given', () => {
    act(() => root.render(<MonoStat value="12" label="waitlist" />));
    expect(host.querySelector('.iv-monostat-delta')).toBeNull();
  });
});
