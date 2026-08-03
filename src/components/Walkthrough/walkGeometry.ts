/**
 * Walkthrough — pure step + geometry helpers.
 *
 * Everything here is DOM-free where it can be (the geometry math takes plain
 * rects and a viewport box, never `window`), so the tricky parts — cursor
 * tween targets, tooltip placement/flip/clamp, step navigation — are unit
 * testable without a browser. The one exception, `resolveTarget`, touches the
 * document but is trivially guarded.
 */

import type { ReactNode } from 'react';

/** Which side of the target the tooltip card prefers. */
export type WalkPlacement = 'top' | 'bottom' | 'left' | 'right';

/** One stop on the tour. */
export interface WalkStep {
  /**
   * The element to spotlight. Either a CSS selector resolved against the
   * document, or a function returning the live element (or null). A function
   * lets a caller target something a selector can't name.
   */
  target: string | (() => Element | null);
  /** Card heading. */
  title: ReactNode;
  /** Card body — a sentence or two on what this thing is / does. */
  body: ReactNode;
  /** Preferred side for the card; flips automatically when there's no room. */
  placement?: WalkPlacement;
  /** Per-step override of the animated cursor (defaults to the tour's `cursor`). */
  showCursor?: boolean;
}

/** A plain rectangle in viewport (fixed) coordinates. */
export interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Viewport {
  width: number;
  height: number;
}

/** A placed tooltip: viewport-fixed coords plus the side it actually landed on. */
export interface Placed {
  top: number;
  left: number;
  placement: WalkPlacement;
}

/** Gap between the target and the tooltip card along the placement axis. */
export const TOOLTIP_GAP = 14;
/** Keep the card at least this far from every viewport edge. */
export const VIEWPORT_MARGIN = 12;
/** How far the spotlight ring is inflated beyond the target's own box. */
export const SPOTLIGHT_PAD = 8;

/** Clamp a step index into `[0, length-1]`; an empty list clamps to 0. */
export function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  if (index < 0) return 0;
  if (index > length - 1) return length - 1;
  return index;
}

/** Next step, clamped at the end (never wraps). */
export function nextIndex(index: number, length: number): number {
  return clampIndex(index + 1, length);
}

/** Previous step, clamped at the start (never wraps). */
export function prevIndex(index: number, length: number): number {
  return clampIndex(index - 1, length);
}

/** True when `index` is the final step of a non-empty tour. */
export function isLastStep(index: number, length: number): boolean {
  return length > 0 && index >= length - 1;
}

/** Human progress label, 1-based: `progressLabel(1, 5)` → "2 of 5". */
export function progressLabel(index: number, length: number): string {
  return `${clampIndex(index, length) + 1} of ${length}`;
}

/**
 * Resolve a step's target to a live element (or null). A string is a CSS
 * selector; a function is called and its result normalised to `Element | null`.
 * Any throw (bad selector, function error) resolves to null so a broken step
 * degrades to "skip", never a crash.
 */
export function resolveTarget(
  target: WalkStep['target'],
  root: Document | { querySelector(sel: string): Element | null } = typeof document !== 'undefined'
    ? document
    : { querySelector: () => null },
): Element | null {
  try {
    if (typeof target === 'function') return target() ?? null;
    return root.querySelector(target);
  } catch {
    return null;
  }
}

/**
 * The point the animated cursor should tween to — the centre of the target.
 * The cursor "points at" the middle of whatever is being explained.
 */
export function cursorTarget(box: Box): Point {
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

/**
 * The spotlight ring box: the target inflated by `pad` on every side, then
 * clamped so the ring itself never spills past the viewport edges (a target
 * flush to an edge would otherwise draw a ring hanging off-screen).
 */
export function spotlightBox(
  box: Box,
  viewport: Viewport,
  pad = SPOTLIGHT_PAD,
): Box {
  const left = Math.max(0, box.left - pad);
  const top = Math.max(0, box.top - pad);
  const right = Math.min(viewport.width, box.left + box.width + pad);
  const bottom = Math.min(viewport.height, box.top + box.height + pad);
  return {
    left,
    top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

/**
 * Place the tooltip card against the target. Starts on the preferred side,
 * flips to the opposite side when that side lacks room and the other has it,
 * then clamps both axes inside the viewport margins so the card is never
 * clipped — the same discipline as ironvale's Tooltip, extended to four sides.
 */
export function placeTooltip(
  target: Box,
  tip: { width: number; height: number },
  placement: WalkPlacement,
  viewport: Viewport,
  gap = TOOLTIP_GAP,
  margin = VIEWPORT_MARGIN,
): Placed {
  const vw = viewport.width;
  const vh = viewport.height;
  const tRight = target.left + target.width;
  const tBottom = target.top + target.height;

  let resolved = placement;

  // Vertical placements need vertical room; horizontal need horizontal room.
  if (placement === 'top') {
    const need = tip.height + gap + margin;
    if (target.top < need && vh - tBottom >= need) resolved = 'bottom';
  } else if (placement === 'bottom') {
    const need = tip.height + gap + margin;
    if (vh - tBottom < need && target.top >= need) resolved = 'top';
  } else if (placement === 'left') {
    const need = tip.width + gap + margin;
    if (target.left < need && vw - tRight >= need) resolved = 'right';
  } else if (placement === 'right') {
    const need = tip.width + gap + margin;
    if (vw - tRight < need && target.left >= need) resolved = 'left';
  }

  let top: number;
  let left: number;
  switch (resolved) {
    case 'top':
      top = target.top - gap - tip.height;
      left = target.left + target.width / 2 - tip.width / 2;
      break;
    case 'bottom':
      top = tBottom + gap;
      left = target.left + target.width / 2 - tip.width / 2;
      break;
    case 'left':
      left = target.left - gap - tip.width;
      top = target.top + target.height / 2 - tip.height / 2;
      break;
    case 'right':
    default:
      left = tRight + gap;
      top = target.top + target.height / 2 - tip.height / 2;
      break;
  }

  top = Math.max(margin, Math.min(top, vh - tip.height - margin));
  left = Math.max(margin, Math.min(left, vw - tip.width - margin));

  return { top, left, placement: resolved };
}

/**
 * Cursor tween duration in ms. Reduced motion collapses to 0 (an instant jump,
 * no glide), matching the aether token guard that zeroes every duration.
 */
export function tweenDuration(reducedMotion: boolean, base: number): number {
  return reducedMotion ? 0 : base;
}

/**
 * Find the first step index at or after `from` (scanning in `dir`) whose target
 * currently resolves to an element. Returns null when none in that direction
 * do — used to skip missing targets gracefully instead of spotlighting nothing.
 */
export function settleStep(
  steps: WalkStep[],
  from: number,
  dir: 1 | -1,
  resolve: (t: WalkStep['target']) => Element | null = (t) => resolveTarget(t),
): number | null {
  for (let i = from; i >= 0 && i < steps.length; i += dir) {
    if (resolve(steps[i].target)) return i;
  }
  return null;
}
