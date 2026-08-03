import { describe, expect, it } from 'vitest';

import {
  clampIndex,
  nextIndex,
  prevIndex,
  isLastStep,
  progressLabel,
  resolveTarget,
  cursorTarget,
  spotlightBox,
  placeTooltip,
  tweenDuration,
  settleStep,
  type WalkStep,
  type Box,
} from './walkGeometry.js';

const VIEWPORT = { width: 1000, height: 800 };

describe('index navigation', () => {
  it('clamps into range and never wraps', () => {
    expect(clampIndex(-2, 5)).toBe(0);
    expect(clampIndex(9, 5)).toBe(4);
    expect(clampIndex(3, 5)).toBe(3);
    expect(clampIndex(0, 0)).toBe(0);
  });

  it('next stops at the last step, prev stops at the first', () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(nextIndex(2, 3)).toBe(2);
    expect(prevIndex(2, 3)).toBe(1);
    expect(prevIndex(0, 3)).toBe(0);
  });

  it('knows the last step and labels progress 1-based', () => {
    expect(isLastStep(2, 3)).toBe(true);
    expect(isLastStep(1, 3)).toBe(false);
    expect(isLastStep(0, 0)).toBe(false);
    expect(progressLabel(0, 5)).toBe('1 of 5');
    expect(progressLabel(4, 5)).toBe('5 of 5');
    // out-of-range index is clamped before labelling
    expect(progressLabel(9, 5)).toBe('5 of 5');
  });
});

describe('resolveTarget', () => {
  it('calls a function target and normalises undefined/null', () => {
    const el = { tagName: 'DIV' } as unknown as Element;
    expect(resolveTarget(() => el)).toBe(el);
    expect(resolveTarget(() => null)).toBeNull();
    expect(resolveTarget(() => undefined as unknown as Element)).toBeNull();
  });

  it('resolves a string selector against a provided root', () => {
    const el = { tagName: 'BUTTON' } as unknown as Element;
    const root = { querySelector: (sel: string) => (sel === '#go' ? el : null) };
    expect(resolveTarget('#go', root)).toBe(el);
    expect(resolveTarget('#missing', root)).toBeNull();
  });

  it('swallows a throwing target and returns null', () => {
    expect(
      resolveTarget(() => {
        throw new Error('boom');
      }),
    ).toBeNull();
    const badRoot = {
      querySelector: () => {
        throw new Error('bad selector');
      },
    };
    expect(resolveTarget('::::', badRoot)).toBeNull();
  });
});

describe('cursorTarget', () => {
  it('returns the centre of the box', () => {
    expect(cursorTarget({ top: 100, left: 200, width: 40, height: 20 })).toEqual({
      x: 220,
      y: 110,
    });
  });
});

describe('spotlightBox', () => {
  it('inflates the target by the pad on every side', () => {
    const b = spotlightBox({ top: 100, left: 100, width: 50, height: 30 }, VIEWPORT, 8);
    expect(b).toEqual({ top: 92, left: 92, width: 66, height: 46 });
  });

  it('clamps the ring so it never spills past the viewport edges', () => {
    // Target flush to the top-left corner: pad must not push it negative.
    const b = spotlightBox({ top: 0, left: 0, width: 40, height: 40 }, VIEWPORT, 10);
    expect(b.top).toBe(0);
    expect(b.left).toBe(0);
    // Target flush to the bottom-right corner: clamp width/height.
    const c = spotlightBox({ top: 780, left: 980, width: 40, height: 40 }, VIEWPORT, 10);
    expect(c.left).toBe(970);
    expect(c.width).toBe(30); // 1000 - 970
    expect(c.top).toBe(770);
    expect(c.height).toBe(30);
  });
});

describe('placeTooltip', () => {
  const tip = { width: 260, height: 120 };

  it('places below when bottom is preferred and there is room', () => {
    const target: Box = { top: 100, left: 400, width: 100, height: 40 };
    const p = placeTooltip(target, tip, 'bottom', VIEWPORT);
    expect(p.placement).toBe('bottom');
    expect(p.top).toBe(140 + 14); // tBottom + gap
    // centred on the target, then unchanged (well inside margins)
    expect(p.left).toBe(400 + 50 - 130);
  });

  it('flips bottom→top when there is no room below', () => {
    const target: Box = { top: 700, left: 400, width: 100, height: 60 };
    const p = placeTooltip(target, tip, 'bottom', VIEWPORT);
    expect(p.placement).toBe('top');
    expect(p.top).toBe(700 - 14 - 120);
  });

  it('flips right→left when there is no room to the right', () => {
    const target: Box = { top: 300, left: 900, width: 80, height: 40 };
    const p = placeTooltip(target, tip, 'right', VIEWPORT);
    expect(p.placement).toBe('left');
    expect(p.left).toBe(900 - 14 - 260);
  });

  it('clamps a centred card back inside the horizontal margins', () => {
    const target: Box = { top: 200, left: 10, width: 30, height: 30 };
    const p = placeTooltip(target, tip, 'bottom', VIEWPORT);
    // naive centre would be negative; clamp to the margin
    expect(p.left).toBe(12);
  });

  it('clamps the far edge too', () => {
    const target: Box = { top: 200, left: 985, width: 30, height: 30 };
    const p = placeTooltip(target, tip, 'bottom', VIEWPORT);
    expect(p.left).toBe(1000 - 260 - 12);
  });
});

describe('tweenDuration', () => {
  it('is the base normally and zero under reduced motion', () => {
    expect(tweenDuration(false, 480)).toBe(480);
    expect(tweenDuration(true, 480)).toBe(0);
  });
});

describe('settleStep', () => {
  const steps: WalkStep[] = [
    { target: '#a', title: 'a', body: '' },
    { target: '#b', title: 'b', body: '' },
    { target: '#c', title: 'c', body: '' },
  ];
  // only #b resolves
  const resolve = (t: WalkStep['target']) => (t === '#b' ? ({} as Element) : null);

  it('scans forward to the first resolvable target', () => {
    expect(settleStep(steps, 0, 1, resolve)).toBe(1);
  });

  it('scans backward to the first resolvable target', () => {
    expect(settleStep(steps, 2, -1, resolve)).toBe(1);
  });

  it('returns null when nothing resolves in that direction', () => {
    expect(settleStep(steps, 2, 1, resolve)).toBeNull();
    const none = () => null;
    expect(settleStep(steps, 0, 1, none)).toBeNull();
  });
});
