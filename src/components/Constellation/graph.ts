// Constellation — pure layout & camera math.
//
// Everything in this module is a deterministic function of its arguments: no React, no DOM,
// no time, no randomness. It is the tested core of the reusable graph primitive — the rings,
// the hop BFS, the population-spaced radii, the domain sectors, the reach/time filters, and
// the camera transforms. The React component is a thin animation shell around these.

import { GRID_THRESHOLD } from './grid.js';

/** Rings are degrees of separation; 4+ collapses onto the outer ring by default. */
export const DEFAULT_MAX_HOP = 4;

/** Breathing room between the outermost ring and the edge of the sky. */
export const SKY_MARGIN = 30;

export interface Vec2 {
  x: number;
  y: number;
}

export interface Camera {
  /** zoom */
  k: number;
  /** world→screen translation */
  tx: number;
  ty: number;
}

/** The minimal node/edge shape the math needs — the public component widens these. */
export interface HopNode {
  id: string;
  /** Marks the default center (the ego). The first such node roots the BFS when no root is given. */
  focus?: boolean;
}
export interface HopEdge {
  source: string;
  target: string;
}

/** Shortest signed angular distance from `from` to `to`, in (-π, π]. */
export function angleDelta(from: number, to: number): number {
  let d = to - from;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

/**
 * Breadth-first hop distance from the root (the center). Unreachable nodes sit on the
 * outermost ring (`maxHop`). The center is `rootId` if given and present, else the first
 * focus node, else — nothing (empty map).
 */
export function hopDistances(
  nodes: HopNode[],
  edges: HopEdge[],
  rootId?: string | null,
  maxHop: number = DEFAULT_MAX_HOP,
): Map<string, number> {
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.source)!.push(e.target);
    adj.get(e.target)!.push(e.source);
  }
  const hops = new Map<string, number>();
  const root = (rootId && nodes.find((n) => n.id === rootId)) || nodes.find((n) => n.focus);
  if (!root) return hops;
  hops.set(root.id, 0);
  let frontier = [root.id];
  for (let d = 1; d <= maxHop && frontier.length; d++) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const nb of adj.get(id) ?? []) {
        if (!hops.has(nb)) {
          hops.set(nb, d);
          next.push(nb);
        }
      }
    }
    frontier = next;
  }
  for (const n of nodes) if (!hops.has(n.id)) hops.set(n.id, maxHop);
  return hops;
}

/**
 * Timelapse filter: the graph as of `atTime` (epoch ms). Nodes without a timestamp (`t`),
 * and any node flagged `keepAlways` (the ego), are always present; edges survive only when
 * both endpoints survive and the edge's own timestamp (if any) is in the past. `atTime`
 * null/undefined means "now" — the graph is returned untouched.
 */
export function filterByTime<
  N extends { id: string; t?: number; keepAlways?: boolean },
  E extends { source: string; target: string; t?: number },
>(graph: { nodes: N[]; edges: E[] }, atTime: number | null | undefined): { nodes: N[]; edges: E[] } {
  if (atTime === null || atTime === undefined) return graph;
  const nodes = graph.nodes.filter((n) => n.keepAlways || n.t === undefined || n.t <= atTime);
  const keep = new Set(nodes.map((n) => n.id));
  const edges = graph.edges.filter(
    (e) => keep.has(e.source) && keep.has(e.target) && (e.t === undefined || e.t <= atTime),
  );
  return { nodes, edges };
}

/**
 * Reach filter: keep nodes within `reach` hops of the center, plus every edge between kept
 * nodes. `reach >= maxHop` is "everything" and returns the graph untouched.
 */
export function filterByReach<
  N extends { id: string },
  E extends { source: string; target: string },
>(
  graph: { nodes: N[]; edges: E[] },
  hops: Map<string, number>,
  reach: number,
  maxHop: number = DEFAULT_MAX_HOP,
): { nodes: N[]; edges: E[] } {
  if (reach >= maxHop) return graph;
  const keep = new Set(graph.nodes.filter((n) => (hops.get(n.id) ?? maxHop) <= reach).map((n) => n.id));
  return {
    nodes: graph.nodes.filter((n) => keep.has(n.id)),
    edges: graph.edges.filter((e) => keep.has(e.source) && keep.has(e.target)),
  };
}

/**
 * Ring radii, spaced by population rather than evenly — a ring holding 18 nodes gets the
 * circumference 18 nodes need, not the room a ring of 4 gets. `radii[h]` is the pixel radius
 * of the ring `h` introductions from the center; `radii[0]` is always 0 (the center).
 *
 * Returns `maxHop + 1` entries. At/under GRID_THRESHOLD nodes the whole set is scaled to fill
 * the sky (`fit`); past it the natural population radii are kept and never compressed (the
 * camera zooms out to fit instead — distance becomes detail).
 */
export function computeRingRadii(
  hops: Map<string, number>,
  w: number,
  h: number,
  reach: number,
  maxHop: number = DEFAULT_MAX_HOP,
): number[] {
  const counts = new Map<number, number>();
  for (const hp of hops.values()) counts.set(hp, (counts.get(hp) ?? 0) + 1);

  const total = hops.size || 1;
  const atScale = total > GRID_THRESHOLD;
  const ARC_PER_NODE = atScale ? Math.max(10, (62 * GRID_THRESHOLD) / total) : 62;
  const MIN_GAP = 68;
  const radii = [0];
  for (let hp = 1; hp <= maxHop; hp++) {
    const needed = ((counts.get(hp) ?? 0) * ARC_PER_NODE) / (2 * Math.PI);
    radii[hp] = Math.max(radii[hp - 1] + MIN_GAP, needed);
  }
  const maxR = Math.min(w, h) / 2 - SKY_MARGIN;
  const outermost = Math.min(reach, maxHop);
  const fit = radii[outermost] > 0 ? maxR / radii[outermost] : 1;
  const k = atScale ? Math.max(1, fit) : fit;
  return radii.map((r) => r * k);
}

export interface Sector {
  start: number;
  end: number;
  mid: number;
}

/**
 * One wedge of sky per group, sized by how many nodes it holds. The center is excluded — it
 * sits at the middle and belongs to every group. Wedges start at 12 o'clock and run clockwise,
 * groups in stable sorted order, so the layout is deterministic.
 */
export function sectorsByGroup(
  nodes: Array<{ id: string; group: string }>,
  centerId: string | null,
): Map<string, Sector> {
  const counts = new Map<string, number>();
  for (const n of nodes) {
    if (n.id === centerId) continue;
    counts.set(n.group, (counts.get(n.group) ?? 0) + 1);
  }
  const names = [...counts.keys()].sort();
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  const out = new Map<string, Sector>();
  let cursor = -Math.PI / 2; // 12 o'clock
  for (const name of names) {
    const span = (2 * Math.PI * (counts.get(name) ?? 0)) / total;
    out.set(name, { start: cursor, end: cursor + span, mid: cursor + span / 2 });
    cursor += span;
  }
  return out;
}

/** The camera that shows the whole world square inside a w×h viewport, centered, never zoomed past 1×. */
export function fitCamera(world: { w: number; h: number }, w: number, h: number): Camera {
  const k = Math.min(w / world.w, h / world.h, 1);
  return { k, tx: (w - world.w * k) / 2, ty: (h - world.h * k) / 2 };
}

/**
 * Zoom around a screen point: the world point under (sx, sy) stays fixed as k changes. `factor`
 * is the multiplicative zoom (e.g. `Math.exp(-deltaY * 0.0016)` for a wheel). Clamped to
 * [fitK * 0.5, maxK].
 */
export function zoomAround(
  cam: Camera,
  sx: number,
  sy: number,
  factor: number,
  fitK: number,
  maxK: number,
): Camera {
  const k = Math.min(maxK, Math.max(fitK * 0.5, cam.k * factor));
  const wx = (sx - cam.tx) / cam.k;
  const wy = (sy - cam.ty) / cam.k;
  return { k, tx: sx - wx * k, ty: sy - wy * k };
}

/** Screen point → world point under the current camera. */
export function screenToWorld(cam: Camera, sx: number, sy: number): Vec2 {
  return { x: (sx - cam.tx) / cam.k, y: (sy - cam.ty) / cam.k };
}

/**
 * The 3D-mode seam. Positions are always simulated in 2D; a projection is applied at render
 * time only, so swapping in a full 3D renderer (the sovereign "numen" scene) later means
 * replacing this one function, not the sim. `tiltY` foreshortens the vertical axis around the
 * center — 1 is flat (2D), &lt;1 tilts the plane so the rings read as a receding disk. It is a
 * uniform linear scale about `cy`, so it composes with the camera and inverts exactly.
 */
export function tiltFactor(mode: '2d' | '3d'): number {
  return mode === '3d' ? 0.58 : 1;
}
