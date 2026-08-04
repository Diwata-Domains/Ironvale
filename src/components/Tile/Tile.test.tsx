// @vitest-environment jsdom
/**
 * Tile contract — the instrument card:
 * - title + status pip + children; red sets the loud edge class;
 * - deep link is a plain anchor (watch-only: never a button);
 * - asOf renders as a machine-readable <time>;
 * - no status → no pip.
 */
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Tile } from './Tile.js';

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

describe('Tile', () => {
  it('renders title, status pip, and children; red is the loud edge', () => {
    act(() =>
      root.render(
        <Tile title="Deploys" status="red">
          <p>law violated</p>
        </Tile>,
      ),
    );
    const tile = host.querySelector('.iv-tile')!;
    expect(tile.className).toContain('iv-tile--red');
    expect(host.querySelector('.iv-tile-title')!.textContent).toBe('Deploys');
    expect(tile.textContent).toContain('law violated');
    expect(host.querySelector('.iv-pip--red')).not.toBeNull();
  });

  it('deep-links via a plain anchor — watch-only, no buttons', () => {
    act(() =>
      root.render(
        <Tile title="Log" href="https://example.com/log" linkLabel="open log">
          <p>ok</p>
        </Tile>,
      ),
    );
    const link = host.querySelector('a.iv-tile-link')!;
    expect(link.getAttribute('href')).toBe('https://example.com/log');
    expect(link.textContent).toContain('open log');
    expect(host.querySelector('button')).toBeNull();
  });

  it('shows asOf as a machine-readable time element', () => {
    act(() =>
      root.render(
        <Tile title="Health" asOf="2026-08-03T10:00:00+00:00">
          <p>ok</p>
        </Tile>,
      ),
    );
    const time = host.querySelector('time.iv-tile-asof')!;
    expect(time.getAttribute('datetime')).toBe('2026-08-03T10:00:00+00:00');
  });

  it('renders no pip when status is omitted', () => {
    act(() =>
      root.render(
        <Tile title="Docs">
          <p>counts</p>
        </Tile>,
      ),
    );
    expect(host.querySelector('.iv-pip')).toBeNull();
  });
});
