import type { Meta, StoryObj } from '@storybook/react-vite'
import { MonoStat, Tile } from '../index.js'

const meta = {
  title: 'Components/Tile',
  component: Tile,
  parameters: {
    docs: {
      description: {
        component:
          'The instrument card: a watch-only board panel with a status pip, a quiet asOf timestamp, and a deep-link affordance. Tiles render readings and never carry action buttons — red is the only loud state.',
      },
    },
  },
  args: { title: 'Deploys', status: 'ok' },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['ok', 'warn', 'red', 'unavailable', undefined],
    },
  },
} satisfies Meta<typeof Tile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Health',
    status: 'ok',
    asOf: new Date().toISOString(),
    href: 'https://example.com',
    linkLabel: 'open',
    children: 'All probes green.',
  },
}

export const RedIsLoud: Story = {
  args: {
    title: 'Deploys',
    status: 'red',
    asOf: new Date().toISOString(),
    href: 'https://example.com/actions',
    linkLabel: 'runs',
    children: 'Deploy — Apex: skipped after a red run on the same merge.',
  },
}

export const WithMonoStats: Story = {
  args: {
    title: 'Ops',
    status: 'ok',
    asOf: new Date().toISOString(),
    children: (
      <div style={{ display: 'flex', gap: 24 }}>
        <MonoStat value={1204} label="users" delta="+38 this week" />
        <MonoStat value={87} label="waitlist" />
        <MonoStat value={412} label="rows / 24h" />
      </div>
    ),
  },
}

export const Unavailable: Story = {
  args: {
    title: 'Lake',
    status: 'unavailable',
    children: 'lore unreachable — this is a state, not an alarm.',
  },
}
