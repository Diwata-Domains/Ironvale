import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  angleDelta,
  computeRingRadii,
  DEFAULT_MAX_HOP,
  filterByReach,
  filterByTime,
  fitCamera,
  hopDistances,
  screenToWorld,
  sectorsByGroup,
  SKY_MARGIN,
  tiltFactor,
  zoomAround,
  type Camera,
} from './graph.js';
import { forNearbyPairs, GRID_THRESHOLD, REPULSION_CUTOFF } from './grid.js';
import type { GalaxyVisual } from './GalaxyLayer.js';

// The galaxy renderer is heavy (three.js) and only needed once a sky outgrows the viewport —
// it loads on demand and small graphs never pay for it.
const GalaxyLayer = lazy(() => import('./GalaxyLayer.js'));

// ── Public data model (generic — no product types) ──────────────────────────────────────────

export interface ConstellationNode {
  id: string;
  label: string;
  /** Grouping key — gathers nodes into a wedge of sky and picks a tint (via getGroupColor). */
  group?: string;
  /** Explicit core colour override. Wins over group/ego defaults, on both the star and its halo. */
  color?: string;
  /** Halo/glow colour when there is no override (e.g. a per-world hue). Defaults to theme.starHalo. */
  glow?: string;
  /** Base star radius in px. Falls back to a degree-derived size. The focus node defaults to 26. */
  weight?: number;
  /** 0..1 — drives opacity and glow size. Defaults to 1 for the ego, 0.5 otherwise. */
  brightness?: number;
  /** A hand-pin as an offset from the sky centre. Seeds the sim so arrangements survive reloads. */
  pinnedPos?: { x: number; y: number } | null;
  /** Epoch ms this node entered the graph — powers timelapse. Undefined = always present. */
  t?: number;
  /** One small line under the label in the hover card (e.g. an entity type). */
  meta?: string;
}

export interface ConstellationEdge {
  from: string;
  to: string;
  label?: string;
  /** Trust grammar: 'confirmed' (solid), 'inferred' (dashed), 'pending' (dotted). Free-form. */
  kind?: string;
  /** Epoch ms this relation entered the graph — powers timelapse. */
  t?: number;
}

export interface ConstellationTheme {
  /** Ring circles, constellation lines, lit sector. */
  ring?: string;
  /** Default star core. */
  star?: string;
  /** Default star halo when the node carries no glow. */
  starHalo?: string;
  /** The ego's core. */
  focusCore?: string;
  /** The ego's halo. */
  focusHalo?: string;
  /** Node label text. */
  label?: string;
  /** Sector hairline + rim label default. */
  sector?: string;
  /** Muted UI text (hover-card rows, ring labels). */
  muted?: string;
}

export interface ConstellationViewStats {
  /** Nodes drawn after reach + time filtering. */
  visible: number;
  /** Nodes hidden by the reach filter (present at this time, beyond reach). */
  hidden: number;
  /** Nodes present at the current time (pre-reach). */
  total: number;
  /** Edges drawn. */
  relations: number;
}

export interface ConstellationProps {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  /** The node that holds the centre. Defaults to the ego, then the first node. */
  focusId?: string | null;
  /** The "you" node — carries the ego core/halo styling wherever it sits. */
  egoId?: string | null;
  /** How far the sky reaches from the centre, in hops. Defaults to `maxHop` (everything). */
  reach?: number;
  /** Rings beyond this collapse onto the outer ring. Default 4. */
  maxHop?: number;
  /** 2d (flat) or 3d (a tilted disk — the seam for a full 3D renderer). Default 2d. */
  mode?: '2d' | '3d';
  /** Timelapse cursor (epoch ms). null = now. When omitted, the built-in control owns it. */
  atTime?: number | null;
  /** Called when the built-in time control moves. Makes the cursor a controlled value. */
  onTimeChange?: (t: number | null) => void;
  /** Override the auto-derived time extent (min/max epoch ms). */
  timeExtent?: { min: number; max: number } | null;
  /** Render the built-in play/scrub overlay (auto-hides with fewer than 2 timestamps). Default true. */
  timeControl?: boolean;
  /** Theming hook — the star's core colour. */
  getNodeColor?: (node: ConstellationNode) => string | undefined;
  /** Theming hook — the star's label. Defaults to `node.label`. */
  getNodeLabel?: (node: ConstellationNode) => string;
  /** Theming hook — a group's tint (sector rim, galaxy point, hover meta). */
  getGroupColor?: (group: string) => string | undefined;
  theme?: ConstellationTheme;
  /** Hold the sim still (no cooling animation past the first settle). */
  reducedMotion?: boolean;
  className?: string;
  /** A star was clicked. `anchorEl` is the star's DOM group, for popover positioning. */
  onNodeClick?: (node: ConstellationNode, anchorEl?: Element) => void;
  /** A star was dragged to rest — persist the pin (offset from centre). */
  onNodePin?: (id: string, pos: { x: number; y: number }) => void;
  /** The empty background was clicked (not dragged). */
  onBackgroundClick?: () => void;
  /** The recenter affordance ("back to you") was pressed. */
  onResetFocus?: () => void;
  /** Fired whenever the visible counts change — drives an external subtitle. */
  onViewStats?: (stats: ConstellationViewStats) => void;
  /** Overlay rendered inside the sky (empty-state, extra controls) — a slot the wrapper fills. */
  children?: React.ReactNode;
}

// ── Constants (ported from the Diwa constellation, tuned for a 62px-arc world) ──────────────

const MAX_H = 760;
const MIN_H = 260;
const MAX_LABELS = 12;
const ALPHA_DECAY = 0.985;
const ALPHA_MIN = 0.02;
const RING_PULL = 0.12;
const RADIAL_LEAK = 0.15;
const SPRING_REST = 90;
const ANGLE_PULL = 0.05;
const SECTOR_PULL = 0.012;
const GALAXY_K = 0.45;
const RICH_K = 0.75;
const MAX_K = 3;

const DEFAULT_THEME: Required<ConstellationTheme> = {
  ring: '#c9a96e', // --ae-brand-gold
  star: '#e8e2d9', // --ae-brand-parchment
  starHalo: '#7a7268', // --ae-brand-ash
  focusCore: '#e0564a', // --ae-color-crimson-400
  focusHalo: '#f48a7f', // --ae-color-crimson-300
  label: '#e8e2d9',
  sector: '#7a7268',
  muted: '#7a7268',
};

interface Pos {
  x: number;
  y: number;
}

interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  node: ConstellationNode;
  self: boolean;
  pin: Pos | null;
}

function baseRadius(node: ConstellationNode, degree: number, isFocus: boolean): number {
  if (typeof node.weight === 'number') return node.weight;
  if (isFocus) return 26;
  return 9 + Math.min(13, Math.sqrt(degree) * 5);
}

export function Constellation(props: ConstellationProps) {
  const {
    nodes: rawNodes,
    edges: rawEdges,
    focusId: focusIdProp = null,
    egoId = null,
    maxHop = DEFAULT_MAX_HOP,
    mode = '2d',
    timeExtent: timeExtentProp,
    timeControl = true,
    getNodeColor,
    getNodeLabel,
    getGroupColor,
    reducedMotion = false,
    className,
    onNodeClick,
    onNodePin,
    onBackgroundClick,
    onResetFocus,
    onViewStats,
    children,
  } = props;
  const reach = props.reach ?? maxHop;
  const theme = { ...DEFAULT_THEME, ...props.theme };
  const labelOf = useCallback((n: ConstellationNode) => getNodeLabel?.(n) ?? n.label, [getNodeLabel]);
  const groupColorOf = useCallback((g: string) => getGroupColor?.(g), [getGroupColor]);

  // The whole graph as passed, normalised into the math shape.
  const graph = useMemo(() => ({ nodes: rawNodes, edges: rawEdges }), [rawNodes, rawEdges]);

  // ── Timelapse ─────────────────────────────────────────────────────────────────────────────
  const [asOfInternal, setAsOfInternal] = useState<number | null>(null);
  const controlledTime = props.atTime !== undefined;
  const asOf = controlledTime ? props.atTime ?? null : asOfInternal;
  const setAsOf = useCallback(
    (t: number | null) => {
      if (!controlledTime) setAsOfInternal(t);
      props.onTimeChange?.(t);
    },
    [controlledTime, props],
  );
  const asOfRef = useRef(asOf);
  asOfRef.current = asOf;
  const [playing, setPlaying] = useState(false);
  const timeSpan = useMemo(() => {
    if (timeExtentProp) return timeExtentProp;
    const stamps = graph.nodes.map((n) => n.t).filter((t): t is number => typeof t === 'number');
    if (stamps.length < 2) return null;
    return { min: Math.min(...stamps), max: Date.now() };
  }, [graph, timeExtentProp]);

  const timed = useMemo(() => {
    const flagged = {
      nodes: graph.nodes.map((n) => ({ ...n, keepAlways: n.id === egoId })),
      edges: graph.edges.map((e) => ({ ...e, source: e.from, target: e.to, t: e.t })),
    };
    const r = filterByTime(flagged, asOf);
    return r;
  }, [graph, asOf, egoId]);

  // Play: sweep dawn → now in ~6s, then hand control back.
  useEffect(() => {
    if (!playing || !timeSpan) return;
    const start = asOfRef.current ?? timeSpan.min;
    const step = (timeSpan.max - timeSpan.min) / 60;
    const timer = setInterval(() => {
      const next = (asOfRef.current ?? start) + step;
      if (next >= timeSpan.max) {
        setPlaying(false);
        setAsOf(null); // snap back to "now"
      } else {
        setAsOf(next);
      }
    }, 100);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, timeSpan]);

  // ── Hops, reach scope, centre ───────────────────────────────────────────────────────────────
  const centerId = useMemo(() => {
    if (focusIdProp && timed.nodes.some((n) => n.id === focusIdProp)) return focusIdProp;
    if (egoId && timed.nodes.some((n) => n.id === egoId)) return egoId;
    return timed.nodes[0]?.id ?? null;
  }, [timed, focusIdProp, egoId]);

  const fullHops = useMemo(
    () => hopDistances(timed.nodes.map((n) => ({ id: n.id, focus: n.id === centerId })), timed.edges, centerId, maxHop),
    [timed, centerId, maxHop],
  );
  const scoped = useMemo(() => filterByReach(timed, fullHops, reach, maxHop), [timed, fullHops, reach, maxHop]);
  const hops = useMemo(
    () => hopDistances(scoped.nodes.map((n) => ({ id: n.id, focus: n.id === centerId })), scoped.edges, centerId, maxHop),
    [scoped, centerId, maxHop],
  );

  useEffect(() => {
    onViewStats?.({
      visible: scoped.nodes.length,
      hidden: timed.nodes.length - scoped.nodes.length,
      total: timed.nodes.length,
      relations: scoped.edges.length,
    });
  }, [scoped, timed, onViewStats]);

  const degree = useMemo(() => {
    const d = new Map<string, number>();
    for (const e of scoped.edges) {
      d.set(e.source, (d.get(e.source) ?? 0) + 1);
      d.set(e.target, (d.get(e.target) ?? 0) + 1);
    }
    return d;
  }, [scoped]);

  const neighbours = useMemo(() => {
    const adj = new Map<string, string[]>();
    for (const e of scoped.edges) {
      if (!adj.has(e.source)) adj.set(e.source, []);
      if (!adj.has(e.target)) adj.set(e.target, []);
      adj.get(e.source)!.push(e.target);
      adj.get(e.target)!.push(e.source);
    }
    return adj;
  }, [scoped]);

  const sectors = useMemo(
    () => sectorsByGroup(scoped.nodes.map((n) => ({ id: n.id, group: n.group ?? 'other' })), centerId),
    [scoped, centerId],
  );

  const centered = useMemo(() => scoped.nodes.find((n) => n.id === centerId) ?? null, [scoped, centerId]);

  // ── Sizing ──────────────────────────────────────────────────────────────────────────────────
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [w, setW] = useState(900);
  const [H, setH] = useState(MAX_H);
  const [tick, setTick] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const hoverScanRef = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (cw) setW(Math.max(320, Math.floor(cw)));
      setH(Math.max(MIN_H, Math.min(MAX_H, Math.floor(ch || MAX_H))));
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    fit();
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, []);

  // ── Ring radii + world ────────────────────────────────────────────────────────────────────
  const ringRadii = useMemo(() => computeRingRadii(hops, w, H, reach, maxHop), [hops, w, H, reach, maxHop]);
  const ringRadiiRef = useRef(ringRadii);
  ringRadiiRef.current = ringRadii;
  const ringR = useCallback((hop: number) => ringRadiiRef.current[Math.min(hop, maxHop)] ?? 0, [maxHop]);

  const outerHop = useMemo(() => {
    let m = 1;
    for (const hp of hops.values()) if (hp > m) m = hp;
    return Math.min(m, maxHop);
  }, [hops, maxHop]);

  const world = useMemo(() => {
    const outer = ringRadii[outerHop] ?? 0;
    const side = outer * 2 + SKY_MARGIN * 2;
    return { w: Math.max(w, side), h: Math.max(H, side) };
  }, [ringRadii, outerHop, w, H]);
  const worldRef = useRef(world);
  worldRef.current = world;
  const prevWorldRef = useRef(0);

  // ── Camera ────────────────────────────────────────────────────────────────────────────────
  const [cam, setCam] = useState<Camera>({ k: 1, tx: 0, ty: 0 });
  const camRef = useRef(cam);
  camRef.current = cam;
  const fitKRef = useRef(1);
  useEffect(() => {
    const c = fitCamera(world, w, H);
    fitKRef.current = c.k;
    setCam(c);
  }, [world.w, world.h, w, H]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const rect = el.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      setCam((c) => zoomAround(c, sx, sy, Math.exp(-ev.deltaY * 0.0016), fitKRef.current, MAX_K));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── 3D-mode tilt (render-time projection about the world centre) ────────────────────────────
  const tiltY = tiltFactor(mode);
  const tiltYRef = useRef(tiltY);
  tiltYRef.current = tiltY;

  const richOpacity = Math.max(0, Math.min(1, (cam.k - GALAXY_K) / (RICH_K - GALAXY_K)));
  const galaxyOpacity = 1 - richOpacity;

  const rScale = useMemo(() => {
    const total = scoped.nodes.length;
    return total <= GRID_THRESHOLD ? 1 : Math.max(0.25, Math.sqrt(GRID_THRESHOLD / total));
  }, [scoped]);

  // Colour resolution shared by rich + galaxy layers.
  const resolveOverride = useCallback(
    (n: ConstellationNode) => getNodeColor?.(n) ?? n.color,
    [getNodeColor],
  );
  const galaxyVisuals = useMemo(() => {
    const m = new Map<string, GalaxyVisual>();
    for (const n of scoped.nodes) {
      const isEgo = n.id === egoId;
      const override = resolveOverride(n);
      m.set(n.id, {
        size: baseRadius(n, degree.get(n.id) ?? 0, n.id === centerId) * rScale,
        bright: isEgo ? 1 : n.brightness ?? 0.5,
        color: override ?? (isEgo ? theme.focusHalo : n.group ? groupColorOf(n.group) ?? theme.star : theme.star),
      });
    }
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoped, degree, rScale, egoId, centerId, resolveOverride, groupColorOf, theme.focusHalo, theme.star]);
  const galaxyEverRef = useRef(false);
  if (galaxyOpacity > 0.02) galaxyEverRef.current = true;

  // ── Sim refs ─────────────────────────────────────────────────────────────────────────────
  const hopsRef = useRef(hops);
  const centerIdRef = useRef<string | null>(null);
  const neighboursRef = useRef(neighbours);
  const sectorsRef = useRef(sectors);
  const degreeRef = useRef(degree);
  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<{ source: string; target: string; kind?: string; label?: string }[]>([]);
  const dragRef = useRef<{ id: string; sx: number; sy: number; moved: boolean; anchor?: Element } | null>(null);
  const pinsRef = useRef(new Map<string, Pos>());
  const panRef = useRef<{
    pointerId: number;
    sx: number;
    sy: number;
    lx: number;
    ly: number;
    tx0: number;
    ty0: number;
    k: number;
    moved: boolean;
    galaxy: boolean;
  } | null>(null);
  const pinchRef = useRef<{
    id1: number;
    id2: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    k0: number;
    d0: number;
    wx: number;
    wy: number;
  } | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const alphaRef = useRef(1);
  const runningRef = useRef(false);
  const stepRef = useRef<() => void>(() => {});
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  const onNodePinRef = useRef(onNodePin);
  onNodePinRef.current = onNodePin;
  const onNodeClickRef = useRef(onNodeClick);
  onNodeClickRef.current = onNodeClick;
  const onBackgroundClickRef = useRef(onBackgroundClick);
  onBackgroundClickRef.current = onBackgroundClick;

  const reheat = useCallback((a = 1) => {
    alphaRef.current = Math.max(alphaRef.current, a);
    if (!runningRef.current) {
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(() => stepRef.current());
    }
  }, []);

  // (re)build the simulation when data/size changes; carry positions across small changes.
  useEffect(() => {
    const cx = world.w / 2;
    const cy = world.h / 2;
    hopsRef.current = hops;
    centerIdRef.current = centerId;
    neighboursRef.current = neighbours;
    sectorsRef.current = sectors;
    degreeRef.current = degree;
    const lastW = prevWorldRef.current;
    const worldJumped = lastW > 0 && (world.w / lastW > 1.3 || world.w / lastW < 0.77);
    prevWorldRef.current = world.w;
    const prev = worldJumped ? new Map<string, SimNode>() : new Map(nodesRef.current.map((n) => [n.id, n]));
    const seedAngle = new Map<string, number>();
    const byHop = [...scoped.nodes].sort((a, b) => (hops.get(a.id) ?? maxHop) - (hops.get(b.id) ?? maxHop));
    const fanCount = new Map<string, number>();
    byHop.forEach((node, i) => {
      if (node.id === centerId) {
        seedAngle.set(node.id, 0);
        return;
      }
      const hop = hops.get(node.id) ?? maxHop;
      const parent = (neighbours.get(node.id) ?? []).find(
        (nb) => (hops.get(nb) ?? maxHop) === hop - 1 && seedAngle.has(nb),
      );
      if (parent !== undefined && hop > 1) {
        const fan = fanCount.get(parent) ?? 0;
        fanCount.set(parent, fan + 1);
        const offset = Math.ceil((fan + 1) / 2) * 0.22 * (fan % 2 === 0 ? 1 : -1);
        seedAngle.set(node.id, seedAngle.get(parent)! + offset);
        return;
      }
      const sector = sectors.get(node.group ?? 'other');
      seedAngle.set(
        node.id,
        sector
          ? sector.start + ((i % 7) + 1) * ((sector.end - sector.start) / 8)
          : (i / Math.max(1, scoped.nodes.length)) * Math.PI * 2,
      );
    });
    nodesRef.current = scoped.nodes.map((node, i) => {
      const p = prev.get(node.id);
      const angle = seedAngle.get(node.id) ?? (i / Math.max(1, scoped.nodes.length)) * Math.PI * 2;
      const seedR = ringR(hops.get(node.id) ?? maxHop);
      const seedX = cx + Math.cos(angle) * seedR;
      const seedY = cy + Math.sin(angle) * seedR;
      const pin = node.id === centerId ? null : pinsRef.current.get(node.id) ?? node.pinnedPos ?? null;
      return {
        id: node.id,
        x: node.id === centerId ? cx : pin ? cx + pin.x : p?.x ?? seedX,
        y: node.id === centerId ? cy : pin ? cy + pin.y : p?.y ?? seedY,
        vx: 0,
        vy: 0,
        r: baseRadius(node, degree.get(node.id) ?? 0, node.id === centerId) * rScale,
        node,
        self: node.id === egoId,
        pin,
      };
    });
    edgesRef.current = scoped.edges.map((e) => ({ source: e.source, target: e.target, kind: e.kind, label: e.label }));
    reheat(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoped, w, H, world, degree, hops, neighbours, sectors, ringR, reheat, centerId, rScale, egoId, maxHop]);

  // physics loop
  useEffect(() => {
    function step() {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const byId = new Map(nodes.map((n) => [n.id, n]));
      const index = new Map(nodes.map((n, i) => [n.id, i]));
      const count = nodes.length;
      const xs = new Float64Array(count);
      const ys = new Float64Array(count);
      for (let i = 0; i < count; i++) {
        xs[i] = nodes[i].x;
        ys[i] = nodes[i].y;
      }
      const fxA = new Float64Array(count);
      const fyA = new Float64Array(count);
      const gridMode = count > GRID_THRESHOLD;
      const cutoff2 = REPULSION_CUTOFF * REPULSION_CUTOFF;
      forNearbyPairs(xs, ys, count, REPULSION_CUTOFF, (i, j) => {
        const dx = xs[i] - xs[j];
        const dy = ys[i] - ys[j];
        const d2 = dx * dx + dy * dy + 0.01;
        if (gridMode && d2 > cutoff2) return;
        const d = Math.sqrt(d2);
        const rep = 7200 / d2;
        const ux = dx / d;
        const uy = dy / d;
        fxA[i] += ux * rep;
        fyA[i] += uy * rep;
        fxA[j] -= ux * rep;
        fyA[j] -= uy * rep;
      });
      for (const e of edges) {
        const ia = index.get(e.source);
        const ib = index.get(e.target);
        if (ia === undefined || ib === undefined) continue;
        const dx = xs[ib] - xs[ia];
        const dy = ys[ib] - ys[ia];
        const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const f = (d - SPRING_REST) * 0.014;
        const ux = dx / d;
        const uy = dy / d;
        fxA[ia] += ux * f;
        fyA[ia] += uy * f;
        fxA[ib] -= ux * f;
        fyA[ib] -= uy * f;
      }
      const cx = worldRef.current.w / 2;
      const cy = worldRef.current.h / 2;
      for (let ni = 0; ni < count; ni++) {
        const n = nodes[ni];
        if (n.id === centerIdRef.current) {
          n.x = cx;
          n.y = cy;
          n.vx = 0;
          n.vy = 0;
          continue;
        }
        if (dragRef.current?.id === n.id) {
          n.vx = 0;
          n.vy = 0;
          continue;
        }
        if (n.pin) {
          n.x = cx + n.pin.x;
          n.y = cy + n.pin.y;
          n.vx = 0;
          n.vy = 0;
          continue;
        }
        const alpha = alphaRef.current;
        const targetR = ringR(hopsRef.current.get(n.id) ?? maxHop);
        const ddx = n.x - cx;
        const ddy = n.y - cy;
        const dist = Math.hypot(ddx, ddy) || 0.01;
        const ux = ddx / dist;
        const uy = ddy / dist;
        const gx = fxA[ni];
        const gy = fyA[ni];
        const fRadial = gx * ux + gy * uy;
        let fTangent = gx * -uy + gy * ux;
        const thetaN = Math.atan2(ddy, ddx);
        const adjacent = neighboursRef.current.get(n.id) ?? [];
        if (adjacent.length) {
          let sx = 0;
          let sy = 0;
          for (const id of adjacent) {
            const other = byId.get(id);
            if (!other || other.id === centerIdRef.current) continue;
            const a = Math.atan2(other.y - cy, other.x - cx);
            sx += Math.cos(a);
            sy += Math.sin(a);
          }
          if (sx !== 0 || sy !== 0) {
            const want = Math.atan2(sy, sx);
            const weight = 1 / (degreeRef.current.get(n.id) ?? 1);
            fTangent += angleDelta(thetaN, want) * dist * ANGLE_PULL * weight;
          }
        }
        const sector = sectorsRef.current.get(n.node.group ?? 'other');
        if (sector) fTangent += angleDelta(thetaN, sector.mid) * dist * SECTOR_PULL;
        const ringForce = (targetR - dist) * RING_PULL;
        const radial = ringForce + fRadial * RADIAL_LEAK;
        const ax = (ux * radial + -uy * fTangent) * alpha;
        const ay = (uy * radial + ux * fTangent) * alpha;
        n.vx = (n.vx + ax) * 0.8;
        n.vy = (n.vy + ay) * 0.8;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(n.r + 8, Math.min(worldRef.current.w - n.r - 8, n.x));
        n.y = Math.max(n.r + 24, Math.min(worldRef.current.h - n.r - 16, n.y));
        const dcx = n.x - cx;
        const dcy = n.y - cy;
        const dc = Math.hypot(dcx, dcy);
        const minD = 26 + n.r + 16;
        if (dc < minD) {
          if (dc < 0.001) {
            n.x = cx + minD;
            n.y = cy;
          } else {
            n.x = cx + (dcx / dc) * minD;
            n.y = cy + (dcy / dc) * minD;
          }
        }
      }
      let maxNodeR = 0;
      for (const n of nodes) if (n.r > maxNodeR) maxNodeR = n.r;
      for (let i = 0; i < count; i++) {
        xs[i] = nodes[i].x;
        ys[i] = nodes[i].y;
      }
      forNearbyPairs(xs, ys, count, 2 * maxNodeR + 6, (i, j) => {
        const a = nodes[i];
        const b = nodes[j];
        if (a.id === centerIdRef.current || b.id === centerIdRef.current) return;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        const minimum = a.r + b.r + 6;
        if (d >= minimum || d < 0.01) return;
        const push = (minimum - d) / 2;
        const ux = dx / d;
        const uy = dy / d;
        if (dragRef.current?.id !== a.id && !a.pin) {
          a.x -= ux * push;
          a.y -= uy * push;
        }
        if (dragRef.current?.id !== b.id && !b.pin) {
          b.x += ux * push;
          b.y += uy * push;
        }
      });

      setTick((t) => (t + 1) % 1_000_000);

      if (dragRef.current) alphaRef.current = Math.max(alphaRef.current, 0.35);
      else if (reducedRef.current) alphaRef.current = 0;
      else alphaRef.current *= ALPHA_DECAY;

      if (alphaRef.current < ALPHA_MIN) {
        runningRef.current = false;
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    }
    stepRef.current = step;
    reheat(1);
    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [w, H, ringR, reheat, maxHop]);

  // Screen ↔ world with the tilt folded in (3d foreshortens Y about the world centre).
  const screenToWorldTilted = useCallback(
    (sx: number, sy: number) => {
      const c = camRef.current;
      const p = screenToWorld(c, sx, sy);
      const cy = worldRef.current.h / 2;
      const ty = tiltYRef.current;
      return { x: p.x, y: cy + (p.y - cy) / ty };
    },
    [],
  );

  // drag / click handling
  useEffect(() => {
    function onMove(ev: PointerEvent) {
      const pinch = pinchRef.current;
      if (pinch) {
        if (ev.pointerId === pinch.id1) {
          pinch.x1 = ev.clientX;
          pinch.y1 = ev.clientY;
        } else if (ev.pointerId === pinch.id2) {
          pinch.x2 = ev.clientX;
          pinch.y2 = ev.clientY;
        } else return;
        const wrap = wrapRef.current;
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const midX = (pinch.x1 + pinch.x2) / 2 - rect.left;
        const midY = (pinch.y1 + pinch.y2) / 2 - rect.top;
        const d = Math.hypot(pinch.x2 - pinch.x1, pinch.y2 - pinch.y1);
        const k = Math.min(MAX_K, Math.max(fitKRef.current * 0.5, pinch.k0 * (d / (pinch.d0 || 1))));
        setCam({ k, tx: midX - pinch.wx * k, ty: midY - pinch.wy * k });
        return;
      }
      const pan = panRef.current;
      if (pan) {
        if (ev.pointerId !== pan.pointerId) return;
        pan.lx = ev.clientX;
        pan.ly = ev.clientY;
        if (Math.hypot(ev.clientX - pan.sx, ev.clientY - pan.sy) > 3) pan.moved = true;
        setCam((c) => ({ k: c.k, tx: pan.tx0 + (ev.clientX - pan.sx), ty: pan.ty0 + (ev.clientY - pan.sy) }));
        return;
      }
      const d = dragRef.current;
      const wrap = wrapRef.current;
      if (!d || !wrap) return;
      if (Math.hypot(ev.clientX - d.sx, ev.clientY - d.sy) > 3) d.moved = true;
      const rect = wrap.getBoundingClientRect();
      const n = nodesRef.current.find((nn) => nn.id === d.id);
      if (n && n.id !== centerIdRef.current) {
        const p = screenToWorldTilted(ev.clientX - rect.left, ev.clientY - rect.top);
        n.x = p.x;
        n.y = p.y;
        n.vx = 0;
        n.vy = 0;
        reheat(0.35);
      }
    }
    function onUp(ev: PointerEvent) {
      const pinch = pinchRef.current;
      if (pinch) {
        if (ev.pointerId === pinch.id1 || ev.pointerId === pinch.id2) pinchRef.current = null;
        return;
      }
      const pan = panRef.current;
      if (pan) {
        if (ev.pointerId !== pan.pointerId) return;
        if (!pan.moved) {
          if (pan.galaxy) {
            const wrap = wrapRef.current;
            if (wrap) {
              const rect = wrap.getBoundingClientRect();
              const p = screenToWorldTilted(ev.clientX - rect.left, ev.clientY - rect.top);
              let best: SimNode | undefined;
              let bestD = 14 / camRef.current.k;
              for (const n of nodesRef.current) {
                const d = Math.hypot(n.x - p.x, n.y - p.y);
                if (d < bestD) {
                  bestD = d;
                  best = n;
                }
              }
              if (best) onNodeClickRef.current?.(best.node);
              else onBackgroundClickRef.current?.();
            }
          } else {
            onBackgroundClickRef.current?.();
          }
        }
        panRef.current = null;
        return;
      }
      const d = dragRef.current;
      if (d) {
        const n = nodesRef.current.find((nn) => nn.id === d.id);
        if (n && !d.moved) {
          onNodeClickRef.current?.(n.node, d.anchor);
        } else if (n && n.id !== centerIdRef.current) {
          const pin = { x: n.x - worldRef.current.w / 2, y: n.y - worldRef.current.h / 2 };
          n.pin = pin;
          pinsRef.current.set(n.id, pin);
          onNodePinRef.current?.(n.id, pin);
        }
      }
      dragRef.current = null;
    }
    function onCancel() {
      panRef.current = null;
      pinchRef.current = null;
      dragRef.current = null;
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
    };
  }, [reheat, screenToWorldTilted]);

  // ── Derived render state ────────────────────────────────────────────────────────────────────
  const nodes = nodesRef.current;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const cx = world.w / 2;
  const cy = world.h / 2;
  const cullPad = 140;
  const visX1 = (0 - cam.tx) / cam.k - cullPad;
  const visY1 = (0 - cam.ty) / cam.k - cullPad;
  const visX2 = (w - cam.tx) / cam.k + cullPad;
  const visY2 = (H - cam.ty) / cam.k + cullPad;
  const cullOn = nodes.length > GRID_THRESHOLD;
  const drawNodes = cullOn
    ? nodes.filter((n) => n.x >= visX1 && n.x <= visX2 && n.y >= visY1 && n.y <= visY2)
    : nodes;

  const galaxyHubs =
    galaxyOpacity > 0.3
      ? (() => {
          const picked = new Map<string, SimNode>();
          for (const n of nodes) {
            if (n.id === centerId || n.id === hovered) picked.set(n.id, n);
          }
          const byDegree = [...nodes].sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0));
          const boxes: { x1: number; y1: number; x2: number; y2: number }[] = [];
          const claim = (n: SimNode) => {
            const sx = n.x * cam.k + cam.tx;
            const sy = n.y * cam.k + cam.ty;
            const half = (labelOf(n.node).length * 6) / 2;
            const box = { x1: sx - half, y1: sy, x2: sx + half, y2: sy + 14 };
            if (boxes.some((b) => !(box.x2 < b.x1 || box.x1 > b.x2 || box.y2 < b.y1 || box.y1 > b.y2))) return false;
            boxes.push(box);
            return true;
          };
          for (const n of picked.values()) claim(n);
          for (const n of byDegree) {
            if (picked.size >= 12) break;
            if (picked.has(n.id)) continue;
            if (claim(n)) picked.set(n.id, n);
          }
          return [...picked.values()];
        })()
      : [];

  const focus = hovered ? new Set([hovered, ...(neighbours.get(hovered) ?? [])]) : null;
  const hoveredNode = hovered ? byId.get(hovered) : undefined;
  const labelled = new Set<string>();
  const claimed: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const labelShrink = Math.max(1, cam.k);
  const CHAR_W = 6.2 / labelShrink;
  const LABEL_H = 13 / labelShrink;
  const boxOf = (n: SimNode) => {
    const halfW = (labelOf(n.node).length * CHAR_W) / 2;
    return { x1: n.x - halfW, y1: n.y + n.r + 4, x2: n.x + halfW, y2: n.y + n.r + 4 + LABEL_H };
  };
  for (const n of drawNodes) if (n.id === egoId) claimed.push(boxOf(n));
  for (const n of [...drawNodes]
    .filter((nn) => nn.id !== egoId)
    .sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0))) {
    if (labelled.size >= MAX_LABELS) break;
    const box = boxOf(n);
    const hits = claimed.some((c) => !(box.x2 < c.x1 || box.x1 > c.x2 || box.y2 < c.y1 || box.y1 > c.y2));
    if (hits) continue;
    claimed.push(box);
    labelled.add(n.id);
  }

  const showGalaxy = scoped.nodes.length > 0 && (galaxyOpacity > 0.02 || galaxyEverRef.current);
  const showRich = scoped.nodes.length > 0 && richOpacity > 0.04;
  // The SVG world transform, tilt folded in for 3d.
  const worldTransform = `translate(${cam.tx} ${cam.ty}) scale(${cam.k}) translate(0 ${cy}) scale(1 ${tiltY}) translate(0 ${-cy})`;

  return (
    <div
      ref={wrapRef}
      className={`iv-constellation${className ? ` ${className}` : ''}`}
      data-mode={mode}
      onPointerDown={(ev) => {
        const pan = panRef.current;
        if (pan && !pinchRef.current && ev.pointerId !== pan.pointerId) {
          const rect = ev.currentTarget.getBoundingClientRect();
          const c = camRef.current;
          const midX = (pan.lx + ev.clientX) / 2 - rect.left;
          const midY = (pan.ly + ev.clientY) / 2 - rect.top;
          pinchRef.current = {
            id1: pan.pointerId,
            id2: ev.pointerId,
            x1: pan.lx,
            y1: pan.ly,
            x2: ev.clientX,
            y2: ev.clientY,
            k0: c.k,
            d0: Math.hypot(ev.clientX - pan.lx, ev.clientY - pan.ly),
            wx: (midX - c.tx) / c.k,
            wy: (midY - c.ty) / c.k,
          };
          panRef.current = null;
          dragRef.current = null;
          return;
        }
        if (dragRef.current || panRef.current || pinchRef.current) return;
        if ((ev.target as HTMLElement).closest('.iv-history, .iv-focus-crumb, .iv-hover-card, button, input, select'))
          return;
        panRef.current = {
          pointerId: ev.pointerId,
          sx: ev.clientX,
          sy: ev.clientY,
          lx: ev.clientX,
          ly: ev.clientY,
          tx0: camRef.current.tx,
          ty0: camRef.current.ty,
          k: camRef.current.k,
          moved: false,
          galaxy: galaxyOpacity > 0.5,
        };
      }}
      onPointerMove={(ev) => {
        if (richOpacity >= 0.15 || panRef.current || dragRef.current) return;
        const now = performance.now();
        if (now - hoverScanRef.current < 30) return;
        hoverScanRef.current = now;
        const rect = ev.currentTarget.getBoundingClientRect();
        const p = screenToWorldTilted(ev.clientX - rect.left, ev.clientY - rect.top);
        let bestId: string | null = null;
        let bestD = 14 / camRef.current.k;
        for (const n of nodesRef.current) {
          const d = Math.hypot(n.x - p.x, n.y - p.y);
          if (d < bestD) {
            bestD = d;
            bestId = n.id;
          }
        }
        setHovered(bestId);
      }}
      onPointerLeave={() => setHovered(null)}
    >
      {centered && centered.id !== egoId && onResetFocus && (
        <button type="button" className="iv-focus-crumb" onClick={() => onResetFocus()}>
          ◎ centered on {labelOf(centered)} — back to you
        </button>
      )}

      {children}

      {showGalaxy && (
        <Suspense fallback={null}>
          <GalaxyLayer
            nodesRef={nodesRef}
            edgesRef={edgesRef}
            visuals={galaxyVisuals}
            tick={tick}
            cam={cam}
            w={w}
            h={H}
            opacity={galaxyOpacity}
            parchment={theme.star}
            edgeColor={theme.ring}
          />
        </Suspense>
      )}

      {galaxyHubs.length > 0 && (
        <div className="iv-galaxy-labels" style={{ opacity: galaxyOpacity }}>
          {galaxyHubs.map((n) => (
            <span
              key={n.id}
              className={n.id === centerId ? 'iv-galaxy-label iv-galaxy-label--center' : 'iv-galaxy-label'}
              style={{ left: n.x * cam.k + cam.tx, top: n.y * cam.k + cam.ty + 7 }}
            >
              {labelOf(n.node)}
            </span>
          ))}
        </div>
      )}

      {showRich && (
        <svg
          ref={svgRef}
          width={w}
          height={H}
          style={{
            display: 'block',
            touchAction: 'none',
            position: 'relative',
            opacity: richOpacity,
            pointerEvents: richOpacity < 0.15 ? 'none' : undefined,
          }}
        >
          <g transform={worldTransform}>
            {Array.from({ length: outerHop }, (_, i) => i + 1).map((hop) => (
              <g key={`ring-${hop}`} style={{ pointerEvents: 'none' }}>
                <circle cx={cx} cy={cy} r={ringR(hop)} fill="none" stroke={theme.ring} strokeOpacity={0.07} strokeWidth={1} />
                <text
                  x={cx + ringR(hop) - 4}
                  y={cy - 5}
                  textAnchor="end"
                  fill={theme.ring}
                  fillOpacity={0.38}
                  style={{ fontFamily: 'var(--ae-font-mono, ui-monospace)', fontSize: 'calc(10px * var(--ae-text-scale, 1))', letterSpacing: '0.18em', textTransform: 'uppercase' }}
                >
                  {hop === maxHop ? `${maxHop}+` : hop} {hop === 1 ? 'hop' : 'hops'}
                </text>
              </g>
            ))}

            {sectors.size > 1 &&
              [...sectors.entries()].map(([name, sector]) => {
                const outer = ringR(outerHop);
                const bx = cx + Math.cos(sector.start) * outer;
                const by = cy + Math.sin(sector.start) * outer;
                const lx = cx + Math.cos(sector.mid) * (outer + 16);
                const ly = cy + Math.sin(sector.mid) * (outer + 16);
                const flip = Math.cos(sector.mid) < 0;
                const lit = (hoveredNode?.node.group ?? 'other') === name;
                const hue = groupColorOf(name) ?? theme.sector;
                return (
                  <g key={`sector-${name}`} style={{ pointerEvents: 'none' }}>
                    <line x1={cx} y1={cy} x2={bx} y2={by} stroke={lit ? hue : theme.sector} strokeOpacity={lit ? 0.45 : 0.14} strokeDasharray="2 6" />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor={flip ? 'end' : 'start'}
                      dominantBaseline="middle"
                      fill={hue}
                      fillOpacity={lit ? 1 : 0.65}
                      style={{ fontFamily: 'var(--ae-font-mono, ui-monospace)', fontSize: `calc(${lit ? 11 : 10}px * var(--ae-text-scale, 1))`, letterSpacing: '0.18em', textTransform: 'uppercase' }}
                    >
                      {name}
                    </text>
                  </g>
                );
              })}

            {edgesRef.current.map((e, i) => {
              const a = byId.get(e.source);
              const b = byId.get(e.target);
              if (!a || !b) return null;
              if (
                cullOn &&
                (Math.max(a.x, b.x) < visX1 || Math.min(a.x, b.x) > visX2 || Math.max(a.y, b.y) < visY1 || Math.min(a.y, b.y) > visY2)
              )
                return null;
              const inFocus = !!hovered && (e.source === hovered || e.target === hovered);
              const dimmed = !!hovered && !inFocus;
              const dash = e.kind === 'inferred' ? '7 5' : e.kind === 'pending' ? '2 5' : undefined;
              return (
                <line
                  key={i}
                  data-edge={e.kind ?? 'confirmed'}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={theme.ring}
                  strokeWidth={inFocus ? 2 : 1}
                  strokeOpacity={inFocus ? 0.95 : dimmed ? 0.06 : e.kind === 'pending' ? 0.18 : 0.25}
                  strokeDasharray={dash}
                />
              );
            })}

            {hoveredNode &&
              edgesRef.current
                .filter((e) => (e.source === hovered || e.target === hovered) && e.label)
                .map((e, i) => {
                  const a = byId.get(e.source);
                  const b = byId.get(e.target);
                  if (!a || !b) return null;
                  return (
                    <text key={`l-${i}`} x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} textAnchor="middle" fill={theme.ring} style={{ fontFamily: 'var(--ae-font-mono, ui-monospace)', fontSize: 'calc(10px * var(--ae-text-scale, 1))', pointerEvents: 'none' }}>
                      {e.label}
                    </text>
                  );
                })}

            {[...drawNodes]
              .sort((a, b) => Number(a.id === egoId) - Number(b.id === egoId))
              .map((n) => {
                const isEgo = n.id === egoId;
                const inFocus = !focus || focus.has(n.id);
                const override = resolveOverride(n.node);
                const glow = override ?? (isEgo ? theme.focusHalo : n.node.glow ?? theme.starHalo);
                const core = override ?? (isEgo ? theme.focusCore : theme.star);
                const bright = isEgo ? 1 : n.node.brightness ?? 0.5;
                const glowSize = isEgo ? 26 : 1 + bright * 13;
                const fillOpacity = isEgo ? 1 : 0.22 + 0.78 * bright;
                const strokeOpacity = isEgo ? 1 : 0.3 + 0.7 * bright;
                const labelOpacity = isEgo ? 1 : 0.4 + 0.6 * bright;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x},${n.y})`}
                    data-hop={hops.get(n.id) ?? maxHop}
                    opacity={inFocus ? 1 : 0.25}
                    style={{ cursor: n.id === centerId ? 'pointer' : 'grab', transition: 'opacity 120ms ease' }}
                    onPointerDown={(ev) => {
                      ev.preventDefault();
                      dragRef.current = { id: n.id, sx: ev.clientX, sy: ev.clientY, moved: false, anchor: ev.currentTarget };
                    }}
                    onPointerEnter={() => {
                      if (!dragRef.current) setHovered(n.id);
                    }}
                    onPointerLeave={() => setHovered((h) => (h === n.id ? null : h))}
                  >
                    <circle
                      className={isEgo ? 'iv-star iv-star--you' : 'iv-star'}
                      r={n.r}
                      fill={core}
                      fillOpacity={fillOpacity}
                      stroke={glow}
                      strokeOpacity={strokeOpacity}
                      strokeWidth={isEgo ? 2 : 1}
                      filter={`drop-shadow(0 0 ${glowSize}px ${glow})`}
                    />
                    {(isEgo || labelled.has(n.id) || (!!focus && focus.has(n.id))) && (
                      <text
                        y={n.r + 15 / labelShrink}
                        textAnchor="middle"
                        fill={theme.label}
                        fillOpacity={labelOpacity}
                        style={{ fontFamily: 'var(--ae-font-mono, ui-monospace)', fontSize: `calc(${11 / labelShrink}px * var(--ae-text-scale, 1))`, letterSpacing: '0.02em', pointerEvents: 'none' }}
                      >
                        {labelOf(n.node)}
                      </text>
                    )}
                  </g>
                );
              })}
          </g>
        </svg>
      )}

      {timeControl && timeSpan && (
        <div className="iv-history">
          <button
            type="button"
            className="iv-history-play"
            aria-label={playing ? 'Pause history' : 'Play history from the beginning'}
            onClick={() => {
              if (playing) setPlaying(false);
              else {
                setAsOf(timeSpan.min);
                setPlaying(true);
              }
            }}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <input
            type="range"
            className="iv-history-slider"
            min={timeSpan.min}
            max={timeSpan.max}
            step={(timeSpan.max - timeSpan.min) / 200}
            value={asOf ?? timeSpan.max}
            onChange={(e) => {
              setPlaying(false);
              const v = Number(e.target.value);
              setAsOf(v >= timeSpan.max - 1000 ? null : v);
            }}
          />
          <span className="iv-history-label">{asOf === null ? 'now' : `as of ${new Date(asOf).toLocaleDateString()}`}</span>
        </div>
      )}

      {hoveredNode && !dragRef.current && (
        <div
          className="iv-hover-card"
          style={{
            left: Math.min(Math.max(hoveredNode.x * cam.k + cam.tx + 18, 8), w - 190),
            top: Math.min(Math.max((cy + (hoveredNode.y - cy) * tiltY) * cam.k + cam.ty - 14, 8), H - 96),
          }}
        >
          <div className="iv-hover-card-name">{labelOf(hoveredNode.node)}</div>
          {(hoveredNode.node.meta || hoveredNode.node.group) && (
            <div className="iv-hover-card-row">
              {hoveredNode.node.meta}
              {hoveredNode.node.group && (
                <span className="iv-hover-card-group" style={{ color: groupColorOf(hoveredNode.node.group) ?? undefined }}>
                  {hoveredNode.node.group}
                </span>
              )}
            </div>
          )}
          <div className="iv-hover-card-row">
            {(hops.get(hoveredNode.id) ?? maxHop) === 0
              ? 'centre'
              : `${hops.get(hoveredNode.id)} hop${(hops.get(hoveredNode.id) ?? 0) > 1 ? 's' : ''} away`}
            {' · '}
            {degree.get(hoveredNode.id) ?? 0} connection{(degree.get(hoveredNode.id) ?? 0) === 1 ? '' : 's'}
          </div>
        </div>
      )}
    </div>
  );
}
