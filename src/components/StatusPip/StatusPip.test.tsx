// @vitest-environment jsdom
/**
 * StatusPip contract: one semantic class per status, and an accessible label
 * (defaulting to the status word) — an indicator lamp, not decoration.
 */
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { StatusPip } from './StatusPip.js';

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

describe('StatusPip', () => {
  it('renders each semantic status as its own class', () => {
    for (const status of ['ok', 'warn', 'red', 'unavailable'] as const) {
      act(() => root.render(<StatusPip status={status} />));
      const pip = host.querySelector('.iv-pip');
      expect(pip).not.toBeNull();
      expect(pip!.className).toContain(`iv-pip--${status}`);
    }
  });

  it('defaults the accessible label to the status word', () => {
    act(() => root.render(<StatusPip status="warn" />));
    const pip = host.querySelector('.iv-pip')!;
    expect(pip.getAttribute('role')).toBe('img');
    expect(pip.getAttribute('aria-label')).toBe('warn');
  });

  it('honors an explicit label', () => {
    act(() => root.render(<StatusPip status="red" label="law violated" />));
    expect(host.querySelector('.iv-pip')!.getAttribute('aria-label')).toBe('law violated');
  });
});
