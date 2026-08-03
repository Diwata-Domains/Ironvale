import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';

import {
  clampIndex,
  cursorTarget,
  isLastStep,
  nextIndex,
  placeTooltip,
  prevIndex,
  progressLabel,
  resolveTarget,
  settleStep,
  spotlightBox,
  tweenDuration,
  type Box,
  type Placed,
  type Point,
  type WalkStep,
} from './walkGeometry.js';

export type { WalkStep, WalkPlacement } from './walkGeometry.js';

export interface WalkthroughProps {
  /** The ordered stops of the tour. */
  steps: WalkStep[];
  /** Whether the tour is running. When false nothing mounts. */
  open: boolean;
  /** Called on Done, Escape, or a click on the dim backdrop. */
  onClose: () => void;
  /** Fired with the (settled) index whenever the active step changes. */
  onStepChange?: (index: number) => void;
  /** Show the self-driving animated cursor. Default true. A step's own
   *  `showCursor` overrides this for that step. */
  cursor?: boolean;
  /** Step to open on (clamped). Default 0. */
  startIndex?: number;
  /** Video-like mode: auto-advance every `stepMs`, with a pause/replay control. */
  autoplay?: { stepMs: number };
}

/** How long the cursor glides between targets (ms), before reduced-motion. */
const CURSOR_TWEEN_MS = 620;
/** Ripple lifetime (ms) — the "click" pulse once the cursor arrives. */
const RIPPLE_MS = 520;

/** Read the effective reduced-motion preference: the OS media query OR the
 *  app's manual `data-motion="reduced"` override (aether's convention). */
function prefersReducedMotion(): boolean {
  if (typeof document !== 'undefined') {
    if (document.documentElement.getAttribute('data-motion') === 'reduced') return true;
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      /* older engines — fall through */
    }
  }
  return false;
}

function viewportBox() {
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  };
}

function boxOf(el: Element): Box {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

/**
 * Walkthrough — an in-app guided tour: a dimmed spotlight over each target, a
 * portalled tooltip card, and an optional self-driving cursor that glides from
 * step to step and pulses a click on arrival (the "watch how to use this page"
 * feel). Portals to `document.body` above the app's own rails; re-measures on
 * scroll/resize; scrolls each target into view; skips missing targets; and
 * honours reduced motion (no glide, no ripple).
 */
export function Walkthrough({
  steps,
  open,
  onClose,
  onStepChange,
  cursor = true,
  startIndex = 0,
  autoplay,
}: WalkthroughProps) {
  const [index, setIndex] = useState(() => clampIndex(startIndex, steps.length));
  const [target, setTarget] = useState<Box | null>(null);
  const [tip, setTip] = useState<Placed | null>(null);
  const [cursorAt, setCursorAt] = useState<Point | null>(null);
  const [ripple, setRipple] = useState(0); // bump to retrigger the pulse
  const [playing, setPlaying] = useState<boolean>(Boolean(autoplay));

  const cardRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef<1 | -1>(1);
  const rippleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = open ? prefersReducedMotion() : false;

  const step: WalkStep | undefined = steps[index];
  const showCursor = (step?.showCursor ?? cursor) === true;

  // ── reset to the start index whenever the tour (re)opens ──────────────────
  useEffect(() => {
    if (!open) return;
    setIndex(clampIndex(startIndex, steps.length));
    setCursorAt(null);
    setPlaying(Boolean(autoplay));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── settle onto a resolvable step (skip missing targets gracefully) ───────
  useEffect(() => {
    if (!open || steps.length === 0) return;
    const resolve = (t: WalkStep['target']) => resolveTarget(t);
    if (resolve(steps[index]?.target)) return; // already good
    const found =
      settleStep(steps, index, dirRef.current, resolve) ??
      settleStep(steps, index, dirRef.current === 1 ? -1 : 1, resolve);
    if (found == null) onClose(); // nothing on this page resolves — bail
    else if (found !== index) setIndex(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, steps]);

  // ── measure the active target + place the card + aim the cursor ───────────
  const measure = useCallback(() => {
    const el = step ? resolveTarget(step.target) : null;
    if (!el) {
      setTarget(null);
      return;
    }
    const vp = viewportBox();
    const b = boxOf(el);
    setTarget(spotlightBox(b, vp));
    // Card measured from its live size; falls back to a sane default pre-paint.
    const card = cardRef.current;
    const size = card
      ? { width: card.offsetWidth || 300, height: card.offsetHeight || 150 }
      : { width: 300, height: 150 };
    setTip(placeTooltip(spotlightBox(b, vp), size, step?.placement ?? 'bottom', vp));
    if (showCursor) setCursorAt(cursorTarget(b));
  }, [step, showCursor]);

  // On step change: scroll target into view, then measure (after the scroll
  // settles). Fire the ripple once the cursor has had time to arrive.
  useLayoutEffect(() => {
    if (!open || !step) return;
    const el = resolveTarget(step.target);
    if (el && 'scrollIntoView' in el) {
      (el as HTMLElement).scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: reduced ? 'auto' : 'smooth',
      });
    }
    // Measure now and again on the next frame (post-scroll).
    measure();
    const raf = requestAnimationFrame(measure);
    onStepChange?.(index);

    if (showCursor) {
      if (rippleTimer.current) clearTimeout(rippleTimer.current);
      const delay = tweenDuration(reduced, CURSOR_TWEEN_MS);
      rippleTimer.current = setTimeout(() => setRipple((n) => n + 1), delay + 20);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (rippleTimer.current) clearTimeout(rippleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, step?.target]);

  // Keep everything pinned as the page scrolls or resizes while open.
  useEffect(() => {
    if (!open) return;
    const onMove = () => measure();
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [open, measure]);

  // Move focus to the card so keyboard nav works immediately.
  useEffect(() => {
    if (open && tip) cardRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, Boolean(tip)]);

  const goNext = useCallback(() => {
    dirRef.current = 1;
    setIndex((i) => {
      if (isLastStep(i, steps.length)) {
        onClose();
        return i;
      }
      return nextIndex(i, steps.length);
    });
  }, [steps.length, onClose]);

  const goPrev = useCallback(() => {
    dirRef.current = -1;
    setIndex((i) => prevIndex(i, steps.length));
  }, [steps.length]);

  // ── autoplay ticker ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || !autoplay || !playing) return;
    if (isLastStep(index, steps.length)) return; // stop at the end, don't loop
    const id = setTimeout(goNext, autoplay.stepMs);
    return () => clearTimeout(id);
  }, [open, autoplay, playing, index, steps.length, goNext]);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    },
    [onClose, goNext, goPrev],
  );

  if (!open || typeof document === 'undefined' || steps.length === 0) return null;

  const vp = viewportBox();
  const last = isLastStep(index, steps.length);
  const tweenMs = tweenDuration(reduced, CURSOR_TWEEN_MS);

  const cardStyle: CSSProperties = tip
    ? { top: tip.top, left: tip.left, visibility: 'visible' }
    : { top: 0, left: 0, visibility: 'hidden' };

  const cursorStyle: CSSProperties = cursorAt
    ? {
        transform: `translate(${cursorAt.x}px, ${cursorAt.y}px)`,
        transitionDuration: `${tweenMs}ms`,
        opacity: 1,
      }
    : { opacity: 0 };

  return createPortal(
    <div className="iv-walk" role="dialog" aria-modal="true" aria-label="Guided tour">
      {/* Dimmed backdrop with a punched-out spotlight, drawn as one SVG mask so
          the cutout is a true hole (the target stays fully lit + interactive-looking). */}
      <svg
        className="iv-walk__scrim"
        width={vp.width}
        height={vp.height}
        onClick={onClose}
        aria-hidden="true"
      >
        <defs>
          <mask id="iv-walk-mask">
            <rect x="0" y="0" width={vp.width} height={vp.height} fill="white" />
            {target && (
              <rect
                className="iv-walk__hole"
                x={target.left}
                y={target.top}
                width={target.width}
                height={target.height}
                rx="10"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width={vp.width}
          height={vp.height}
          className="iv-walk__dim"
          mask="url(#iv-walk-mask)"
        />
        {target && (
          <rect
            className="iv-walk__ring"
            x={target.left}
            y={target.top}
            width={target.width}
            height={target.height}
            rx="10"
            fill="none"
          />
        )}
      </svg>

      {/* The self-driving cursor: a pointer that tweens to each target and
          pulses a "click" ripple on arrival. Suppressed under reduced motion's
          ripple, and hidden entirely when cursor is off for this step. */}
      {showCursor && (
        <div className="iv-walk__cursor" style={cursorStyle} aria-hidden="true">
          {!reduced && (
            <span key={ripple} className="iv-walk__ripple" style={{ animationDuration: `${RIPPLE_MS}ms` }} />
          )}
          <svg width="26" height="26" viewBox="0 0 26 26" className="iv-walk__pointer">
            <path
              d="M4 3l7.5 18 2.6-7.4 7.4-2.6L4 3z"
              fill="var(--ae-color-bg-inverse)"
              stroke="var(--ae-color-text-inverse)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* The tooltip card — portalled, viewport-clamped, keyboard-driven. */}
      <div
        ref={cardRef}
        className={`iv-walk__card iv-walk__card--${tip?.placement ?? 'bottom'}`}
        style={cardStyle}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        role="group"
        aria-label={typeof step?.title === 'string' ? step.title : 'Tour step'}
      >
        <div className="iv-walk__card-head">
          <span className="iv-walk__count">{progressLabel(index, steps.length)}</span>
          <button type="button" className="iv-walk__close" aria-label="End tour" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {step?.title && <div className="iv-walk__title">{step.title}</div>}
        {step?.body && <div className="iv-walk__body">{step.body}</div>}

        {/* Step dots — a glance at where you are in the tour. */}
        <div className="iv-walk__dots" aria-hidden="true">
          {steps.map((_, i) => (
            <span key={i} className={`iv-walk__dot${i === index ? ' iv-walk__dot--on' : ''}`} />
          ))}
        </div>

        <div className="iv-walk__actions">
          {autoplay && (
            <button
              type="button"
              className="iv-walk__btn iv-walk__btn--ghost"
              onClick={() => (last ? (setIndex(clampIndex(startIndex, steps.length)), setPlaying(true)) : setPlaying((p) => !p))}
              aria-label={last ? 'Replay tour' : playing ? 'Pause tour' : 'Play tour'}
            >
              {last ? '↺ Replay' : playing ? '❚❚ Pause' : '▶ Play'}
            </button>
          )}
          <span className="iv-walk__spacer" />
          <button
            type="button"
            className="iv-walk__btn iv-walk__btn--ghost"
            onClick={goPrev}
            disabled={index === 0}
          >
            Back
          </button>
          <button type="button" className="iv-walk__btn iv-walk__btn--primary" onClick={goNext}>
            {last ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
