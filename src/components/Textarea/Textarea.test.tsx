// @vitest-environment jsdom
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Textarea } from './Textarea.js';

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

describe('Textarea', () => {
  it('renders a textarea with the iv-textarea class and forwards props', () => {
    act(() => root.render(<Textarea rows={4} placeholder="Say more…" aria-label="Answer" />));
    const el = host.querySelector('textarea')!;
    expect(el.className).toContain('iv-textarea');
    expect(el.getAttribute('rows')).toBe('4');
    expect(el.getAttribute('placeholder')).toBe('Say more…');
    expect(el.getAttribute('aria-label')).toBe('Answer');
  });

  it('adds the error modifier when error is set, and merges a custom className', () => {
    act(() => root.render(<Textarea error className="mine" />));
    const el = host.querySelector('textarea')!;
    expect(el.className).toContain('iv-textarea--error');
    expect(el.className).toContain('mine');
  });
});
