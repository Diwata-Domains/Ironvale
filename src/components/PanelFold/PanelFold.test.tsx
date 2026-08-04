// @vitest-environment jsdom
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PanelFold } from './PanelFold.js';

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

describe('PanelFold', () => {
  it('reflects collapsed via aria-expanded and side via a modifier class', () => {
    act(() =>
      root.render(<PanelFold side="right" collapsed onToggle={() => {}} label="Toggle" />),
    );
    const btn = host.querySelector('button.iv-panel-fold')!;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.className).toContain('iv-panel-fold--right');
    expect(btn.getAttribute('aria-label')).toBe('Toggle');
  });

  it('fires onToggle on click', () => {
    const onToggle = vi.fn();
    act(() =>
      root.render(<PanelFold side="left" collapsed={false} onToggle={onToggle} label="Toggle" />),
    );
    const btn = host.querySelector('button.iv-panel-fold') as HTMLButtonElement;
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    act(() => btn.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders a badge with the alert modifier when badge is set', () => {
    act(() =>
      root.render(
        <PanelFold side="left" collapsed onToggle={() => {}} label="Toggle" badge={3} />,
      ),
    );
    const btn = host.querySelector('button.iv-panel-fold')!;
    expect(btn.className).toContain('iv-panel-fold--alert');
    expect(btn.querySelector('.iv-panel-fold__badge')?.textContent).toBe('3');
    expect(btn.getAttribute('aria-label')).toContain('3');
  });

  it('points the chevron the right way per side + state', () => {
    const cases = [
      ['left', true, '›'],
      ['left', false, '‹'],
      ['right', true, '‹'],
      ['right', false, '›'],
    ] as const;
    for (const [side, collapsed, glyph] of cases) {
      act(() =>
        root.render(
          <PanelFold side={side} collapsed={collapsed} onToggle={() => {}} label="x" />,
        ),
      );
      expect(host.querySelector('.iv-panel-fold__chevron')?.textContent).toBe(glyph);
    }
  });

  it('treats badge={0} as absent (no badge, no alert modifier)', () => {
    act(() =>
      root.render(
        <PanelFold side="left" collapsed onToggle={() => {}} label="Toggle" badge={0} />,
      ),
    );
    const btn = host.querySelector('button.iv-panel-fold')!;
    expect(btn.className).not.toContain('iv-panel-fold--alert');
    expect(btn.querySelector('.iv-panel-fold__badge')).toBeNull();
  });
});
