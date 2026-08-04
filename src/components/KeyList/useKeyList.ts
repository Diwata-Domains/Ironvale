import { useEffect, useRef, useState } from 'react';

/**
 * Keyboard-first list navigation (the Linear-style j/k machinery):
 *
 * - `j` / `ArrowDown` and `k` / `ArrowUp` move the selection and FOCUS the row
 *   (real focus, so focus-visible styling and native Enter activation apply);
 * - `Enter` activates the selected row (unless a button/typing control has focus);
 * - `/` invokes `onFilterKey` (focus your filter input);
 * - keys are ignored while typing in inputs/textareas/selects and when a
 *   modifier is held, so the hook never fights the page's other shortcuts.
 *
 * Escape semantics stay with the consumer — they are page-specific (clear a
 * filter, go back…), not list machinery.
 */
export interface UseKeyListOptions {
  /** Number of rows currently rendered. Selection clamps into [0, count-1]. */
  count: number;
  /** Set false to detach the listener (e.g. while a modal owns the keyboard). */
  enabled?: boolean;
  /** Called on Enter with the selected index. */
  onActivate?: (index: number) => void;
  /** Called when the selection moves via keyboard or `select()` (prefetch hook). */
  onSelectionChange?: (index: number) => void;
  /** Called on `/` outside typing contexts. */
  onFilterKey?: () => void;
}

export interface KeyListApi {
  /** The selected index, clamped to the current count. */
  selected: number;
  /** Move selection programmatically (hover sync); does not steal focus. */
  select: (index: number) => void;
  /** Ref callback registering row `index`'s element for focus management. */
  registerRow: (index: number) => (el: HTMLElement | null) => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function useKeyList({
  count,
  enabled = true,
  onActivate,
  onSelectionChange,
  onFilterKey,
}: UseKeyListOptions): KeyListApi {
  const [selected, setSelected] = useState(0);
  const rows = useRef<(HTMLElement | null)[]>([]);
  const clamped = Math.min(selected, Math.max(0, count - 1));

  // Kept in a ref so the single window listener always sees fresh values
  // without re-subscribing every render.
  const state = useRef({ clamped, count, onActivate, onSelectionChange, onFilterKey });
  state.current = { clamped, count, onActivate, onSelectionChange, onFilterKey };

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      const { clamped: current, count: n, onActivate: activate, onSelectionChange: changed, onFilterKey: filter } = state.current;

      const move = (delta: number) => {
        if (n === 0) return;
        const next = Math.min(Math.max(0, current + delta), n - 1);
        const row = rows.current[next];
        row?.focus();
        row?.scrollIntoView?.({ block: 'nearest' });
        setSelected(next);
        if (next !== current) changed?.(next);
      };

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          e.preventDefault();
          move(1);
          break;
        case 'k':
        case 'ArrowUp':
          e.preventDefault();
          move(-1);
          break;
        case 'Enter':
          // Buttons keep their native Enter activation.
          if (e.target instanceof HTMLButtonElement) return;
          if (n === 0) return;
          e.preventDefault();
          activate?.(current);
          break;
        case '/':
          if (!filter) return;
          e.preventDefault();
          filter();
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);

  return {
    selected: clamped,
    select: (index: number) => {
      setSelected(index);
      state.current.onSelectionChange?.(index);
    },
    registerRow: (index: number) => (el: HTMLElement | null) => {
      rows.current[index] = el;
    },
  };
}
