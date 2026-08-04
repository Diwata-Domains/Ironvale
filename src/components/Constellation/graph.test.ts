import { describe, expect, it } from 'vitest';

import {
  angleDelta,
  computeRingRadii,
  DEFAULT_MAX_HOP,
  filterByReach,
  filterByTime,
  fitCamera,
  fitCameraZoomed,
  hopDistances,
  projectCenterOffset,
  screenToWorld,
  sectorsByGroup,
  tiltFactor,
  zoomAround,
} from './graph.js';

describe('angleDelta', () => {
  it('returns the shortest signed turn, wrapping across ±π', () => {
    expect(angleDelta(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
    expect(angleDelta(0, -Math.PI / 2)).toBeCloseTo(-Math.PI / 2);
    // 0 → 3π/2 is a -π/2 turn, not +3π/2
    expect(angleDelta(0, (3 * Math.PI) / 2)).toBeCloseTo(-Math.PI / 2);
    expect(Math.abs(angleDelta(0.1, 0.1))).toBeLessThan(1e-9);
  });
});

describe('hopDistances', () => {
  const nodes = [
    { id: 'me', focus: true },
    { id: 'a' },
    { id: 'b' },
    { id: 'c' },
    { id: 'island' },
  ];
  const edges = [
    { source: 'me', target: 'a' },
    { source: 'a', target: 'b' },
    { source: 'b', target: 'c' },
  ];

  it('measures BFS distance from the focus node', () => {
    const h = hopDistances(nodes, edges);
    expect(h.get('me')).toBe(0);
    expect(h.get('a')).toBe(1);
    expect(h.get('b')).toBe(2);
    expect(h.get('c')).toBe(3);
  });

  it('parks unreachable nodes on the outermost ring (maxHop)', () => {
    const h = hopDistances(nodes, edges);
    expect(h.get('island')).toBe(DEFAULT_MAX_HOP);
  });

  it('re-roots the BFS when an explicit rootId is given', () => {
    const h = hopDistances(nodes, edges, 'b');
    expect(h.get('b')).toBe(0);
    expect(h.get('a')).toBe(1);
    expect(h.get('me')).toBe(2);
    expect(h.get('c')).toBe(1);
  });

  it('clamps deep chains to a custom maxHop', () => {
    const h = hopDistances(nodes, edges, 'me', 2);
    expect(h.get('c')).toBe(2); // 3 hops away, clamped to 2
  });

  it('returns an empty map when there is no root', () => {
    expect(hopDistances([{ id: 'x' }], []).size).toBe(0);
  });
});

describe('filterByTime', () => {
  const graph = {
    nodes: [
      { id: 'ego', keepAlways: true, t: undefined },
      { id: 'old', t: 100 },
      { id: 'new', t: 300 },
    ],
    edges: [
      { source: 'ego', target: 'old', t: 150 },
      { source: 'ego', target: 'new', t: 350 },
    ],
  };

  it('returns the graph untouched when atTime is null', () => {
    expect(filterByTime(graph, null)).toBe(graph);
  });

  it('reveals only nodes/edges born by atTime, always keeping keepAlways nodes', () => {
    const r = filterByTime(graph, 200);
    expect(r.nodes.map((n) => n.id).sort()).toEqual(['ego', 'old']);
    // the edge to `new` is dropped because `new` is gone AND the edge is in the future
    expect(r.edges).toHaveLength(1);
    expect(r.edges[0].target).toBe('old');
  });

  it('drops a future-stamped edge even when both endpoints already exist', () => {
    const g = {
      nodes: [{ id: 'a', t: 10 }, { id: 'b', t: 10 }],
      edges: [{ source: 'a', target: 'b', t: 500 }],
    };
    expect(filterByTime(g, 100).edges).toHaveLength(0);
  });
});

describe('filterByReach', () => {
  const graph = {
    nodes: [{ id: 'me' }, { id: 'a' }, { id: 'b' }, { id: 'c' }],
    edges: [
      { source: 'me', target: 'a' },
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ],
  };
  const hops = new Map([
    ['me', 0],
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);

  it('keeps only nodes within reach and the edges between them', () => {
    const r = filterByReach(graph, hops, 2);
    expect(r.nodes.map((n) => n.id).sort()).toEqual(['a', 'b', 'me']);
    expect(r.edges).toHaveLength(2); // me-a, a-b ; b-c dropped
  });

  it('returns everything untouched when reach >= maxHop', () => {
    expect(filterByReach(graph, hops, DEFAULT_MAX_HOP)).toBe(graph);
  });
});

describe('computeRingRadii', () => {
  it('is monotonically increasing with radii[0] === 0', () => {
    const hops = new Map([
      ['me', 0],
      ['a', 1],
      ['b', 1],
      ['c', 2],
    ]);
    const radii = computeRingRadii(hops, 800, 600, DEFAULT_MAX_HOP);
    expect(radii[0]).toBe(0);
    for (let i = 1; i < radii.length; i++) expect(radii[i]).toBeGreaterThan(radii[i - 1]);
  });

  it('fills the sky: the outermost in-reach ring reaches the sky margin', () => {
    const hops = new Map([
      ['me', 0],
      ['a', 1],
      ['b', 2],
    ]);
    const w = 800;
    const h = 600;
    const reach = 2;
    const radii = computeRingRadii(hops, w, h, reach);
    const maxR = Math.min(w, h) / 2 - 30;
    expect(radii[2]).toBeCloseTo(maxR, 5);
  });

  it('returns maxHop + 1 entries', () => {
    const radii = computeRingRadii(new Map([['me', 0]]), 800, 600, DEFAULT_MAX_HOP);
    expect(radii).toHaveLength(DEFAULT_MAX_HOP + 1);
  });
});

describe('sectorsByGroup', () => {
  it('splits the circle into population-weighted wedges, excluding the center', () => {
    const nodes = [
      { id: 'me', group: 'ego' },
      { id: 'a', group: 'x' },
      { id: 'b', group: 'x' },
      { id: 'c', group: 'y' },
    ];
    const sectors = sectorsByGroup(nodes, 'me');
    expect([...sectors.keys()].sort()).toEqual(['x', 'y']);
    const x = sectors.get('x')!;
    const y = sectors.get('y')!;
    // x holds 2 of 3 → twice the span of y
    expect(x.end - x.start).toBeCloseTo(2 * (y.end - y.start));
    // wedges are contiguous
    expect(x.end).toBeCloseTo(y.start);
    // mid is the wedge midpoint
    expect(x.mid).toBeCloseTo((x.start + x.end) / 2);
  });
});

describe('camera', () => {
  it('fitCamera centers the world and never zooms past 1×', () => {
    const cam = fitCamera({ w: 400, h: 400 }, 800, 800);
    expect(cam.k).toBe(1); // world smaller than viewport → clamp to 1
    expect(cam.tx).toBe(200);
    expect(cam.ty).toBe(200);
  });

  it('fitCamera shrinks to fit a world larger than the viewport', () => {
    const cam = fitCamera({ w: 1600, h: 800 }, 800, 800);
    expect(cam.k).toBeCloseTo(0.5);
  });

  it('zoomAround keeps the world point under the cursor fixed', () => {
    const cam = { k: 1, tx: 0, ty: 0 };
    const sx = 300;
    const sy = 200;
    const before = screenToWorld(cam, sx, sy);
    const next = zoomAround(cam, sx, sy, 1.5, 0.5, 3);
    const after = screenToWorld(next, sx, sy);
    expect(next.k).toBeCloseTo(1.5);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });

  it('zoomAround clamps to [fitK * 0.5, maxK]', () => {
    const cam = { k: 1, tx: 0, ty: 0 };
    expect(zoomAround(cam, 0, 0, 100, 0.5, 3).k).toBe(3);
    expect(zoomAround(cam, 0, 0, 0.001, 0.5, 3).k).toBeCloseTo(0.25);
  });
});

describe('tiltFactor', () => {
  it('is flat in 2d and foreshortened in 3d', () => {
    expect(tiltFactor('2d')).toBe(1);
    expect(tiltFactor('3d')).toBeLessThan(1);
    expect(tiltFactor('3d')).toBeGreaterThan(0);
  });
});

describe('fitCameraZoomed (art-direction)', () => {
  it('zoom 1 is exactly the fitted camera', () => {
    expect(fitCameraZoomed({ w: 1600, h: 800 }, 800, 800, 1)).toEqual(fitCamera({ w: 1600, h: 800 }, 800, 800));
  });

  it('scales the fitted k and holds the world centre at the viewport centre', () => {
    const world = { w: 1600, h: 800 };
    const cam = fitCameraZoomed(world, 800, 600, 1.4);
    expect(cam.k).toBeCloseTo(fitCamera(world, 800, 600).k * 1.4);
    // the world centre projects to the viewport centre
    expect((world.w / 2) * cam.k + cam.tx).toBeCloseTo(400);
    expect((world.h / 2) * cam.k + cam.ty).toBeCloseTo(300);
  });
});

describe('projectCenterOffset (the stagePositions space)', () => {
  const world = { w: 1000, h: 800 };

  it('(0,0) lands on the projected world centre', () => {
    const cam = { k: 0.5, tx: 20, ty: 10 };
    const p = projectCenterOffset(cam, world, 1, 0, 0);
    expect(p.x).toBeCloseTo(500 * 0.5 + 20);
    expect(p.y).toBeCloseTo(400 * 0.5 + 10);
  });

  it('offsets scale with the camera and stay centre-relative', () => {
    const cam = { k: 2, tx: -100, ty: 40 };
    const p = projectCenterOffset(cam, world, 1, 30, -50);
    expect(p.x).toBeCloseTo((500 + 30) * 2 - 100);
    expect(p.y).toBeCloseTo((400 - 50) * 2 + 40);
  });

  it('folds the 3d tilt in about the centre, matching the render transform', () => {
    const tilt = tiltFactor('3d');
    const cam = { k: 1, tx: 0, ty: 0 };
    const p = projectCenterOffset(cam, world, tilt, 0, 100);
    expect(p.x).toBeCloseTo(500);
    expect(p.y).toBeCloseTo(400 + 100 * tilt); // foreshortened, not raw
  });
});
