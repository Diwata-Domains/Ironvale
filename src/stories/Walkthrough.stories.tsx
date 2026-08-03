import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Walkthrough, Button, type WalkStep, type WalkthroughProps } from '../index.js';

const meta = {
  title: 'Primitives/Walkthrough',
  component: Walkthrough,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'In-app guided tour: a dimmed spotlight over each target, a portalled + viewport-clamped ' +
          'tooltip card, and an OPTIONAL self-driving cursor that glides between targets and pulses a ' +
          '"click" on arrival — the "watch how to use this page" experience. Keyboard-driven ' +
          '(←/→/Enter/Esc), skips missing targets, re-measures on scroll/resize, reduced-motion-aware.',
      },
    },
  },
} satisfies Meta<typeof Walkthrough>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A little demo page of fake targets the tour points at. */
function DemoPage({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 40,
        background: 'var(--ae-color-bg-base)',
        color: 'var(--ae-color-text-primary)',
        fontFamily: 'var(--ae-font-family-base)',
      }}
    >
      <header
        id="demo-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 18px',
          border: '1px solid var(--ae-color-border)',
          borderRadius: 10,
          marginBottom: 28,
        }}
      >
        <strong style={{ letterSpacing: '0.04em' }}>◆ Ironvale Demo</strong>
        <span id="demo-avatar" style={{ padding: '6px 12px', border: '1px solid var(--ae-color-border)', borderRadius: 999 }}>
          you ▾
        </span>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {['Entities', 'Signals', 'Missions'].map((label, i) => (
          <div
            key={label}
            id={`demo-tile-${i}`}
            style={{
              padding: 18,
              border: '1px solid var(--ae-color-border)',
              borderRadius: 10,
              background: 'var(--ae-color-bg-raised)',
            }}
          >
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ae-color-text-muted)' }}>
              {label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{(i + 1) * 12}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <span id="demo-cta">
          <Button variant="primary">+ New mission</Button>
        </span>
        <span id="demo-secondary">
          <Button variant="ghost">Open constellation</Button>
        </span>
      </div>

      {children}
    </div>
  );
}

const STEPS: WalkStep[] = [
  {
    target: '#demo-header',
    title: 'This is your header',
    body: 'Everything you need is one glance away — the wordmark takes you home from anywhere.',
    placement: 'bottom',
  },
  {
    target: '#demo-tile-0',
    title: 'Your live counts',
    body: 'Each tile is the thing it names, and a shortcut into it. Watch the cursor — it drives itself.',
    placement: 'bottom',
  },
  {
    target: '#demo-tile-2',
    title: 'Missions',
    body: 'Work in flight. The spotlight follows along as the tour advances.',
    placement: 'bottom',
  },
  {
    target: '#demo-cta',
    title: 'Start something',
    body: 'The primary action on the page. Press Next (or →) and the cursor points the way.',
    placement: 'top',
  },
  {
    target: '#demo-avatar',
    title: 'That is the whole tour',
    body: 'Your account lives here. Press Done to finish.',
    placement: 'left',
  },
];

/** The default interactive tour — spotlight + tooltip + the self-driving cursor. */
export const Guided: Story = {
  args: { steps: STEPS, open: true, onClose: () => {} },
  render: (args: WalkthroughProps) => {
    const [open, setOpen] = useState(true);
    return (
      <DemoPage>
        <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1 }}>
          <Button variant="primary" onClick={() => setOpen(true)}>
            ▸ Show me
          </Button>
        </div>
        <Walkthrough {...args} open={open} onClose={() => setOpen(false)} />
      </DemoPage>
    );
  },
};

/** Video-like autoplay: the tour advances on its own, with a pause/replay control. */
export const Autoplay: Story = {
  args: { steps: STEPS, open: true, onClose: () => {}, autoplay: { stepMs: 2600 } },
  render: (args: WalkthroughProps) => {
    const [open, setOpen] = useState(true);
    return (
      <DemoPage>
        <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1 }}>
          <Button variant="primary" onClick={() => setOpen(true)}>
            ▶ Watch it
          </Button>
        </div>
        <Walkthrough {...args} open={open} onClose={() => setOpen(false)} />
      </DemoPage>
    );
  },
};

/** Cursor off — spotlight + card only, for a calmer, click-through tour. */
export const NoCursor: Story = {
  args: { steps: STEPS, open: true, onClose: () => {}, cursor: false },
  render: (args: WalkthroughProps) => {
    const [open, setOpen] = useState(true);
    return (
      <DemoPage>
        <Walkthrough {...args} open={open} onClose={() => setOpen(false)} />
      </DemoPage>
    );
  },
};
