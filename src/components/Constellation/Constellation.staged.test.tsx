// @vitest-environment jsdom
/**
 * Component contract for the ART-DIRECTED (staged) Constellation mode:
 * - defaults untouched: hop rings render, labels auto-pick, no overlay layer;
 * - `hopRings={false}` / `sectorRays={false}` silence the instrument chrome;
 * - `labelIds` is an exact whitelist — listed ids label, everything else
 *   (including the ego, when unlisted) goes quiet;
 * - `stagePositions` holds a star exactly at its centre-offset;
 * - `overlay` renders inside the sky and projects (0,0) onto the world centre.
 */
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Constellation } from './Constellation.js';
import type { ConstellationEdge, ConstellationNode } from './Constellation.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom (without pretendToBeVisual) ships neither ResizeObserver nor rAF.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as Record<string, unknown>).ResizeObserver = RO;
}
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  (globalThis as Record<string, unknown>).requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number;
  (globalThis as Record<string, unknown>).cancelAnimationFrame = (id: number) => clearTimeout(id);
}

const NODES: ConstellationNode[] = [
  { id: 'ego', label: 'You', group: 'network' },
  { id: 'a', label: 'Meridian Capital', group: 'network' },
  { id: 'b', label: 'Argus Dynamics', group: 'markets' },
  { id: 'c', label: 'SDVOSB Set-aside', group: 'govcon' },
];
const EDGES: ConstellationEdge[] = [
  { from: 'ego', to: 'a' },
  { from: 'ego', to: 'b' },
  { from: 'ego', to: 'c' },
];

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

const flush = () => act(async () => {});

describe('Constellation defaults (unstaged)', () => {
  it('renders hop rings and auto-labels — the live-graph behaviour survives', async () => {
    act(() => {
      root.render(
        <Constellation nodes={NODES} edges={EDGES} egoId="ego" timeControl={false} reducedMotion />,
      );
    });
    await flush();
    expect(host.textContent).toContain('hop'); // ring labels
    expect(host.textContent).toContain('You'); // the ego always labels by default
    expect(host.querySelector('.iv-constellation-overlay')).toBeNull();
  });
});

describe('Constellation staged (art-directed)', () => {
  const stage = {
    a: { x: -180, y: -60 },
    b: { x: 160, y: -90 },
    c: { x: -120, y: 80 },
  };

  function renderStaged() {
    act(() => {
      root.render(
        <Constellation
          nodes={NODES}
          edges={EDGES}
          egoId="ego"
          timeControl={false}
          reducedMotion
          stagePositions={stage}
          lockCamera
          initialZoom={1.2}
          labelIds={['a', 'c']}
          hopRings={false}
          sectorRays={false}
          overlay={(project) => {
            const p = project(0, 0);
            return <span data-testid="decor" data-x={Math.round(p.x)} data-y={Math.round(p.y)} />;
          }}
        />,
      );
    });
  }

  it('silences the instrument chrome (no hop rings, no sector rim labels)', async () => {
    renderStaged();
    await flush();
    expect(host.textContent).not.toContain('hop');
    expect(host.textContent).not.toContain('markets'); // sector rim label gone
  });

  it('labels are exactly the whitelist — the unlisted ego goes quiet too', async () => {
    renderStaged();
    await flush();
    expect(host.textContent).toContain('Meridian Capital'); // a
    expect(host.textContent).toContain('SDVOSB Set-aside'); // c
    expect(host.textContent).not.toContain('Argus Dynamics'); // b unlisted
    expect(host.textContent).not.toContain('You'); // ego unlisted
  });

  it('holds a staged star exactly at its centre-offset', async () => {
    renderStaged();
    await flush();
    // the sim writes each node's <g transform="translate(x,y)"> in world coords;
    // a staged node must sit at centre + offset no matter how long the sim ran
    // node groups carry a bare `translate(x,y)` (comma form); the world group's
    // compound transform (space form + scale) is filtered out here
    const groups = [...host.querySelectorAll('svg g[transform^="translate"]')].filter((g) =>
      /^translate\([-\d.]+,[-\d.]+\)$/.test(g.getAttribute('transform') ?? ''),
    );
    const labelledA = groups.find((g) => g.textContent?.includes('Meridian Capital'));
    expect(labelledA).toBeTruthy();
    const m = /translate\(([-\d.]+),([-\d.]+)\)/.exec(labelledA!.getAttribute('transform')!);
    expect(m).toBeTruthy();
    // world centre is world.w/2 — recover it from the ego's transform (the ego holds the centre)
    const egoG = groups.find((g) => g.querySelector('.iv-star--you'));
    const em = /translate\(([-\d.]+),([-\d.]+)\)/.exec(egoG!.getAttribute('transform')!);
    expect(Number(m![1]) - Number(em![1])).toBeCloseTo(stage.a.x, 0);
    expect(Number(m![2]) - Number(em![2])).toBeCloseTo(stage.a.y, 0);
  });

  it('a locked sky never dissolves into the galaxy LOD, even far below the crossfade zoom', async () => {
    act(() => {
      root.render(
        <Constellation
          nodes={NODES}
          edges={EDGES}
          egoId="ego"
          timeControl={false}
          reducedMotion
          stagePositions={stage}
          lockCamera
          initialZoom={0.4}
        />,
      );
    });
    await flush();
    expect(host.querySelector('svg')).toBeTruthy(); // the rich chart is up
    expect(host.querySelector('.iv-galaxy-labels')).toBeNull(); // no galaxy layer
  });

  it('renders the overlay through the camera: (0,0) projects onto the viewport centre', async () => {
    renderStaged();
    await flush();
    const decor = host.querySelector('[data-testid="decor"]') as HTMLElement;
    expect(decor).toBeTruthy();
    expect(decor.closest('.iv-constellation-overlay')).toBeTruthy();
    // lockCamera + initialZoom keep the world centre pinned to the viewport centre
    // (w defaults to 900, H to the 760 max in a size-less jsdom container)
    expect(Number(decor.dataset.x)).toBe(450);
    expect(Number(decor.dataset.y)).toBe(380);
  });
});
