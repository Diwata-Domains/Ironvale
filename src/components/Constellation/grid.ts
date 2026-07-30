// Spatial-grid pair enumeration for the constellation sim. The physics loop needs "every
// pair that could plausibly interact" — below GRID_THRESHOLD nodes that is literally every
// pair (so small skies behave exactly the same), beyond it a spatial hash with cell size =
// maxDist visits only neighborhood pairs: O(n·k) instead of O(n²).
//
// Contract: in grid mode every pair within maxDist is visited exactly once; some pairs
// between maxDist and the 3×3-cell diagonal may also be visited — callers gate on distance
// inside the callback (they already compute it for the force anyway).
//
// Data-agnostic and framework-free: this is the same routine the Diwa constellation shipped,
// lifted verbatim into the reusable primitive so any graph the suite draws pays the same cost.

/** Below this many nodes, enumeration is all-pairs and maxDist is ignored. */
export const GRID_THRESHOLD = 400;

/** Repulsion beyond this range is noise next to the ring/angle springs. */
export const REPULSION_CUTOFF = 140;

export function forNearbyPairs(
  xs: Float64Array,
  ys: Float64Array,
  count: number,
  maxDist: number,
  visit: (i: number, j: number) => void,
  threshold: number = GRID_THRESHOLD,
): void {
  if (count < 2) return;

  if (count <= threshold) {
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) visit(i, j);
    }
    return;
  }

  // Spatial hash: bucket by cell, then for each occupied cell pair its members with
  // members of itself and the 4 "forward" neighbor cells (E, SW, S, SE). Every unordered
  // cell pair is scanned from exactly one side, so no pair is ever emitted twice.
  const cell = Math.max(1, maxDist);
  const buckets = new Map<number, number[]>();
  // Offset into positive space so the packed key stays collision-free for negatives.
  let minX = Infinity;
  let minY = Infinity;
  for (let i = 0; i < count; i++) {
    if (xs[i] < minX) minX = xs[i];
    if (ys[i] < minY) minY = ys[i];
  }
  const KEY_SPAN = 1 << 16;
  const keyOf = (cx: number, cy: number) => cx * KEY_SPAN + cy;
  const cellOf = (i: number) => {
    const cx = Math.floor((xs[i] - minX) / cell);
    const cy = Math.floor((ys[i] - minY) / cell);
    return { cx, cy };
  };
  for (let i = 0; i < count; i++) {
    const { cx, cy } = cellOf(i);
    const key = keyOf(cx, cy);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(i);
    else buckets.set(key, [i]);
  }

  const FORWARD: ReadonlyArray<readonly [number, number]> = [
    [1, 0], // E
    [-1, 1], // SW
    [0, 1], // S
    [1, 1], // SE
  ];

  for (const [key, members] of buckets) {
    // within-cell pairs
    for (let a = 0; a < members.length; a++) {
      for (let b = a + 1; b < members.length; b++) visit(members[a], members[b]);
    }
    const cx = Math.floor(key / KEY_SPAN);
    const cy = key - cx * KEY_SPAN;
    for (const [dx, dy] of FORWARD) {
      const other = buckets.get(keyOf(cx + dx, cy + dy));
      if (!other) continue;
      for (const a of members) {
        for (const b of other) visit(a, b);
      }
    }
  }
}
