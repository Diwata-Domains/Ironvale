import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

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
  /** Which side of the trigger the bubble prefers. Defaults to `top`; the
   *  bubble flips to the opposite side automatically when there is no room. */
  placement?: TooltipPlacement;
  /** Override the generated id used to wire `aria-describedby`. */
  id?: string;
  /** Extra class names for the positioning wrapper. */
  className?: string;
}

/** Keep the bubble at least this far from every viewport edge. */
const VIEWPORT_MARGIN = 8;
/** Gap between the trigger and the bubble along the placement axis. */
const TRIGGER_GAP = 8;

interface Coords {
  top: number;
  left: number;
  placement: TooltipPlacement;
}

/** Resolve the bubble's viewport (fixed) coordinates from the trigger rect and
 *  the measured bubble box. Flips across the trigger when the preferred side
 *  lacks room, then clamps both axes so the bubble can never leave the
 *  viewport — this is what stops the founder-reported edge clipping. */
function computePosition(
  triggerRect: DOMRect,
  bubbleWidth: number,
  bubbleHeight: number,
  placement: TooltipPlacement,
): Coords {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const needed = bubbleHeight + TRIGGER_GAP + VIEWPORT_MARGIN;
  const spaceAbove = triggerRect.top;
  const spaceBelow = vh - triggerRect.bottom;

  // Flip to the opposite side only when the preferred one is short and the
  // other genuinely has room; otherwise keep the preference and clamp.
  let resolved = placement;
  if (placement === 'top' && spaceAbove < needed && spaceBelow >= needed) {
    resolved = 'bottom';
  } else if (placement === 'bottom' && spaceBelow < needed && spaceAbove >= needed) {
    resolved = 'top';
  }

  let top =
    resolved === 'top'
      ? triggerRect.top - TRIGGER_GAP - bubbleHeight
      : triggerRect.bottom + TRIGGER_GAP;
  top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - bubbleHeight - VIEWPORT_MARGIN));

  // Centre on the trigger, then clamp horizontally inside the margins.
  let left = triggerRect.left + triggerRect.width / 2 - bubbleWidth / 2;
  left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - bubbleWidth - VIEWPORT_MARGIN));

  return { top, left, placement: resolved };
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
 *
 * The bubble renders in a portal on `document.body` and is positioned with
 * `position: fixed` from the live trigger rect, flipping and clamping against
 * the viewport so it is never clipped by an overflow ancestor or an edge.
 */
export function Tooltip({ label, children, placement = 'top', id, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const generatedId = useId();
  const tooltipId = id ?? generatedId;

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  // Measure the trigger and the (already-mounted) bubble, then place it.
  const reposition = useCallback(() => {
    const trigger = wrapperRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) return;
    const triggerRect = trigger.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();
    setCoords(computePosition(triggerRect, bubbleRect.width, bubbleRect.height, placement));
  }, [placement]);

  // While open, position once and keep the bubble pinned as the page scrolls
  // or resizes. The bubble stays invisible (opacity 0) until `coords` lands,
  // so there is no flash at the pre-measured origin.
  useEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, reposition]);

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

  // Before measurement, keep the bubble off-screen so its natural width can be
  // read without ever painting at the wrong spot (opacity gates visibility).
  const bubbleStyle: CSSProperties = coords
    ? { top: coords.top, left: coords.left }
    : { top: 0, left: 0 };
  const resolvedPlacement = coords?.placement ?? placement;

  return (
    <span ref={wrapperRef} className={wrapperClasses} onMouseEnter={show} onMouseLeave={hide}>
      {trigger}
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            ref={bubbleRef}
            role="tooltip"
            id={tooltipId}
            className={`iv-tooltip__bubble iv-tooltip__bubble--${resolvedPlacement}`}
            data-open={coords ? 'true' : undefined}
            style={bubbleStyle}
          >
            {label}
          </span>,
          document.body,
        )}
    </span>
  );
}
