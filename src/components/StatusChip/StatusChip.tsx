import type { HTMLAttributes } from 'react';

/**
 * The suite-wide ticket/work-item status vocabulary (CP-006 + the 2026-07-17
 * ticketing rulings): a pass only *proposes* closure (`confirm-proposed`), a
 * human confirms (`closed`), and reopening returns the SAME item (`reopened`).
 */
export type StatusChipStatus =
  | 'triage'
  | 'todo'
  | 'open'
  | 'reopened'
  | 'confirm-proposed'
  | 'closed'
  | 'canceled';

export const STATUS_CHIP_LABEL: Record<StatusChipStatus, string> = {
  triage: 'Triage',
  todo: 'Todo',
  open: 'Open',
  reopened: 'Reopened',
  'confirm-proposed': 'Confirm proposed',
  closed: 'Closed',
  canceled: 'Canceled',
};

export interface StatusChipProps extends HTMLAttributes<HTMLSpanElement> {
  status: StatusChipStatus;
  /** Override the default label (e.g. shortened copy in dense lists). */
  label?: string;
}

export function StatusChip({ status, label, className, ...props }: StatusChipProps) {
  const classes = ['iv-status-chip', `iv-status-chip--${status}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <span {...props} className={classes}>
      {label ?? STATUS_CHIP_LABEL[status]}
    </span>
  );
}
