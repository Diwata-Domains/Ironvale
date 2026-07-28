import {
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

export type TooltipPlacement = 'top' | 'bottom';

export interface TooltipProps {
  /** The tooltip's content. Kept short — a hint, not a paragraph. */
  label: ReactNode;
  /**
   * The single interactive trigger element (e.g. a Button or icon button).
   * It is cloned to receive `aria-describedby` plus focus/blur/keydown wiring,
   * so it must be a DOM-backed element that forwards those props.
   */
  children: ReactElement;
  /** Which side of the trigger the bubble sits on. Defaults to `top`. */
  placement?: TooltipPlacement;
  /** Override the generated id used to wire `aria-describedby`. */
  id?: string;
  /** Extra class names for the positioning wrapper. */
  className?: string;
}

/** Does this element currently match `:focus-visible`? Guarded because older
 *  engines throw on the pseudo-class inside `matches()`. When unsupported we
 *  fall back to showing on any focus, which is still keyboard-accessible. */
function isFocusVisible(el: HTMLElement): boolean {
  try {
    return el.matches(':focus-visible');
  } catch {
    return true;
  }
}

/**
 * A dependency-light tooltip / help hint. Opens on pointer hover and on
 * keyboard focus, dismisses on Escape or blur, and wires the bubble to the
 * trigger via `aria-describedby` so screen readers announce it. Motion uses
 * the shared aether duration tokens, so it honours `prefers-reduced-motion`
 * automatically.
 */
export function Tooltip({ label, children, placement = 'top', id, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const generatedId = useId();
  const tooltipId = id ?? generatedId;

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  const onFocus = useCallback(
    (event: ReactFocusEvent<HTMLElement>) => {
      if (isFocusVisible(event.currentTarget)) setOpen(true);
      (children.props as { onFocus?: (e: ReactFocusEvent<HTMLElement>) => void }).onFocus?.(event);
    },
    [children],
  );

  const onBlur = useCallback(
    (event: ReactFocusEvent<HTMLElement>) => {
      setOpen(false);
      (children.props as { onBlur?: (e: ReactFocusEvent<HTMLElement>) => void }).onBlur?.(event);
    },
    [children],
  );

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
      (children.props as { onKeyDown?: (e: ReactKeyboardEvent<HTMLElement>) => void }).onKeyDown?.(
        event,
      );
    },
    [children, open],
  );

  if (!isValidElement(children)) {
    throw new Error('Tooltip expects a single React element child to act as the trigger.');
  }

  const describedBy = [
    (children.props as { 'aria-describedby'?: string })['aria-describedby'],
    tooltipId,
  ]
    .filter(Boolean)
    .join(' ');

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    'aria-describedby': describedBy,
    onFocus,
    onBlur,
    onKeyDown,
  });

  const wrapperClasses = ['iv-tooltip', className].filter(Boolean).join(' ');

  return (
    <span className={wrapperClasses} onMouseEnter={show} onMouseLeave={hide}>
      {trigger}
      <span
        role="tooltip"
        id={tooltipId}
        className={`iv-tooltip__bubble iv-tooltip__bubble--${placement}`}
        data-open={open ? 'true' : undefined}
        aria-hidden={open ? undefined : 'true'}
      >
        {label}
      </span>
    </span>
  );
}
