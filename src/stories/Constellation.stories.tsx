import { useMemo, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Constellation } from '../index.js';
import type { ConstellationEdge, ConstellationNode } from '../index.js';

// ── Generic seeded data — NOT Diwa. A tiny fictional "team + tools + topics" graph, proving the
// primitive draws any domain: no knowledge-graph types, no entity/dossier concepts. Seeded so the
// layout is deterministic across reloads (no Math.random).

const GROUPS = ['crew', 'tools', 'topics', 'partners'] as const;
const GROUP_HUE: Record<string, string> = {
  crew: '#60a5fa',
  tools: '#2dd4bf',
  topics: '#a78bfa',
  partners: '#f0a35e',
};

function seededGraph(n: number): { nodes: ConstellationNode[]; edges: ConstellationEdge[] } {
  let s = (n * 2654435761) >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 0xffffffff);
  const now = Date.UTC(2026, 6, 30);
  const YEAR = 365 * 24 * 3600 * 1000;

  const nodes: ConstellationNode[] = [
    { id: 'me', label: 'You', group: 'crew', t: now - YEAR, meta: 'anchor' },
  ];
  const edges: ConstellationEdge[] = [];
  for (let i = 1; i < n; i++) {
    const group = GROUPS[Math.floor(rand() * GROUPS.length)];
    const born = now - rand() * YEAR;
    nodes.push({
      id: `n${i}`,
      label: `${group[0].toUpperCase()}${group.slice(1)} ${i}`,
      group,
      glow: GROUP_HUE[group],
      brightness: 0.25 + rand() * 0.75,
      t: born,
      meta: group === 'crew' ? 'person' : group === 'tools' ? 'service' : 'topic',
    });
    // preferential-ish attachment to an earlier node
    const target = i === 1 ? 'me' : rand() < 0.4 ? 'me' : `n${Math.max(1, Math.floor(rand() * i))}`;
    const kind = rand() < 0.7 ? 'confirmed' : rand() < 0.5 ? 'inferred' : 'pending';
    edges.push({ from: nodes[i].id, to: target, kind, label: 'linked', t: born });
  }
  return { nodes, edges };
}

function Playground({ n, mode: initialMode }: { n: number; mode: '2d' | '3d' }) {
  const graph = useMemo(() => seededGraph(n), [n]);
  const [mode, setMode] = useState<'2d' | '3d'>(initialMode);
  const [reach, setReach] = useState(4);
  const [atTime, setAtTime] = useState<number | null>(null);
  const [clicked, setClicked] = useState<string>('—');

  const extent = useMemo(() => {
    const ts = graph.nodes.map((x) => x.t!).filter(Boolean);
    return { min: Math.min(...ts), max: Date.UTC(2026, 6, 30) };
  }, [graph]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: 640 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', fontFamily: 'var(--ae-font-mono, monospace)', fontSize: 12 }}>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          projection
          <button type="button" onClick={() => setMode((m) => (m === '2d' ? '3d' : '2d'))} style={btn}>
            {mode.toUpperCase()}
          </button>
        </label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          reach
          <select value={reach} onChange={(e) => setReach(Number(e.target.value))} style={btn}>
            <option value={1}>1 hop</option>
            <option value={2}>2 hops</option>
            <option value={3}>3 hops</option>
            <option value={4}>everything</option>
          </select>
        </label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', flex: 1, minWidth: 220 }}>
          timelapse
          <input
            type="range"
            min={extent.min}
            max={extent.max}
            value={atTime ?? extent.max}
            onChange={(e) => {
              const v = Number(e.target.value);
              setAtTime(v >= extent.max - 1000 ? null : v);
            }}
            style={{ flex: 1 }}
          />
          <span style={{ minWidth: 84, textAlign: 'right' }}>
            {atTime === null ? 'now' : new Date(atTime).toLocaleDateString()}
          </span>
        </label>
        <span>clicked: {clicked}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, border: '1px solid var(--ae-color-border)', borderRadius: 10 }}>
        <Constellation
          nodes={graph.nodes}
          edges={graph.edges}
          egoId="me"
          focusId="me"
          reach={reach}
          mode={mode}
          atTime={atTime}
          onTimeChange={setAtTime}
          timeControl={false}
          getGroupColor={(g) => GROUP_HUE[g]}
          onNodeClick={(node) => setClicked(node.label)}
        />
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  fontFamily: 'inherit',
  fontSize: 12,
  padding: '3px 10px',
  borderRadius: 6,
  border: '1px solid var(--ae-color-border)',
  background: 'var(--ae-color-bg-raised)',
  color: 'var(--ae-color-text-primary)',
  cursor: 'pointer',
};

const meta = {
  title: 'Primitives/Constellation',
  component: Constellation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A data-agnostic force-directed graph sky. Nodes ring out from a focus by hop distance; ' +
          'groups gather into wedges; drag a star to pin it, scrub time to watch the graph assemble, ' +
          'and toggle a 2D/3D projection. Every colour is an aether token or a caller theme prop — ' +
          'the demo data below is a generic team/tools/topics graph, no product types.',
      },
    },
  },
} satisfies Meta<typeof Constellation>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The full playground: 2D/3D toggle, reach selector, timelapse slider, click read-out. */
export const Playground2D: Story = {
  name: 'Playground (2D)',
  args: { nodes: [], edges: [] },
  render: () => <Playground n={18} mode="2d" />,
};

/** The same graph through the 3D-mode seam — the rings read as a tilted, receding disk. */
export const Projection3D: Story = {
  name: '3D-mode seam',
  args: { nodes: [], edges: [] },
  render: () => <Playground n={18} mode="3d" />,
};

/** A denser sky (still generic) — exercises the population-spaced rings and label thinning. */
export const Dense: Story = {
  name: 'Denser sky',
  args: { nodes: [], edges: [] },
  render: () => <Playground n={60} mode="2d" />,
};
