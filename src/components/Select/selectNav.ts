/**
 * Pure keyboard-navigation helpers for {@link Select}. Kept free of React and
 * the DOM so the fiddly index / type-ahead logic can be unit-tested directly.
 */

export interface SelectNavOption {
  value: string;
  label: string;
}

/** Clamp an index into `[0, length)`. Returns -1 for an empty list. */
export function clampIndex(index: number, length: number): number {
  if (length <= 0) return -1;
  return Math.max(0, Math.min(index, length - 1));
}

/** Step the active index by `delta` (usually ±1), clamped — no wrap-around, so
 *  ArrowDown at the end and ArrowUp at the top stay put like a native select. */
export function stepIndex(current: number, delta: number, length: number): number {
  if (length <= 0) return -1;
  return clampIndex(current + delta, length);
}

/**
 * Resolve a type-ahead buffer to an option index.
 *
 * Matches option labels case-insensitively against `buffer` (prefix match).
 * A single-character buffer searches *after* `from` and wraps, so pressing the
 * same key repeatedly cycles through every option that starts with it. A
 * multi-character buffer searches *from* `from` (inclusive) so refining the
 * query keeps you on the current match when it still qualifies.
 *
 * Returns -1 when nothing matches (caller should leave the active option put).
 */
export function typeAheadIndex(
  options: readonly SelectNavOption[],
  buffer: string,
  from: number,
): number {
  const q = buffer.toLowerCase();
  const n = options.length;
  if (!q || n === 0) return -1;
  const origin = from < 0 ? 0 : from % n;
  // Single char → start after `origin` (cycle); multi-char → include `origin`.
  const startOffset = buffer.length > 1 ? 0 : 1;
  for (let step = startOffset; step < n + startOffset; step++) {
    const i = (origin + step) % n;
    if (options[i]!.label.toLowerCase().startsWith(q)) return i;
  }
  return -1;
}
