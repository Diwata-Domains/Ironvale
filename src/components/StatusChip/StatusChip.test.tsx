// @vitest-environment jsdom
/**
 * Component contract for StatusChip: one chip per ruled ticket status, the
 * default label map, and label override for dense surfaces.
 */
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { STATUS_CHIP_LABEL, StatusChip, type StatusChipStatus } from './StatusChip.js';

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

const STATUSES: StatusChipStatus[] = [
  'triage',
  'todo',
  'open',
  'reopened',
  'confirm-proposed',
  'closed',
  'canceled',
];

describe('StatusChip', () => {
  it('renders the ruled label and a status-scoped class for every status', () => {
    for (const status of STATUSES) {
      act(() => root.render(<StatusChip status={status} />));
      const chip = host.querySelector('.iv-status-chip');
      expect(chip, status).not.toBeNull();
      expect(chip!.classList.contains(`iv-status-chip--${status}`), status).toBe(true);
      expect(chip!.textContent, status).toBe(STATUS_CHIP_LABEL[status]);
    }
  });

  it('accepts a label override and passes span attributes through', () => {
    act(() =>
      root.render(<StatusChip status="confirm-proposed" label="Proposed" title="awaiting confirm" />),
    );
    const chip = host.querySelector<HTMLSpanElement>('.iv-status-chip--confirm-proposed');
    expect(chip!.textContent).toBe('Proposed');
    expect(chip!.title).toBe('awaiting confirm');
  });
});
