import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack, StatusDot, Text } from '../index.js'

const meta = {
  title: 'Components/StatusDot',
  component: StatusDot,
  parameters: {
    docs: {
      description: {
        component:
          'Small indicator for health or presence status. Colour maps directly to feedback tokens so it responds correctly to any product theme. Use `pulse` for live or actively-changing state.',
      },
    },
  },
  args: { color: 'green', size: 'md', pulse: false },
  argTypes: {
    color: { control: 'inline-radio', options: ['green', 'yellow', 'red', 'grey'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    pulse: { control: 'boolean' },
  },
} satisfies Meta<typeof StatusDot>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Colors: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md">
      <Stack direction="horizontal" gap="sm" style={{ alignItems: 'center' }}>
        <StatusDot color="green" /><Text variant="label">healthy</Text>
      </Stack>
      <Stack direction="horizontal" gap="sm" style={{ alignItems: 'center' }}>
        <StatusDot color="yellow" /><Text variant="label">degraded</Text>
      </Stack>
      <Stack direction="horizontal" gap="sm" style={{ alignItems: 'center' }}>
        <StatusDot color="red" /><Text variant="label">unreachable</Text>
      </Stack>
      <Stack direction="horizontal" gap="sm" style={{ alignItems: 'center' }}>
        <StatusDot color="grey" /><Text variant="label">unknown</Text>
      </Stack>
    </Stack>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md" style={{ alignItems: 'center' }}>
      <StatusDot color="green" size="sm" />
      <StatusDot color="green" size="md" />
      <StatusDot color="green" size="lg" />
    </Stack>
  ),
}

export const Pulse: Story = {
  args: { color: 'green', pulse: true },
  parameters: {
    docs: {
      description: {
        story: 'Use `pulse` to indicate a live connection or actively-updating state.',
      },
    },
  },
}

export const InContext: Story = {
  name: 'In context (service row)',
  render: () => (
    <div style={{ width: 'min(24rem, 100%)', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {[
        { name: 'DAEMON',   url: 'localhost:8001', ok: true },
        { name: 'Conclave', url: 'localhost:8002', ok: true },
        { name: 'Assay',    url: 'localhost:8000', ok: false },
        { name: 'Lore',     url: 'localhost:8003', ok: false },
      ].map((s) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: 'var(--ae-border-width) solid var(--ae-color-border)' }}>
          <StatusDot color={s.ok ? 'green' : 'red'} />
          <Text variant="label" style={{ flex: 1 }}>{s.name}</Text>
          <Text variant="caption" style={{ fontFamily: 'monospace' }}>{s.url}</Text>
        </div>
      ))}
    </div>
  ),
}
