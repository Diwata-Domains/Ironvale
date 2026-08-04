import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusPip } from '../index.js'

const meta = {
  title: 'Components/StatusPip',
  component: StatusPip,
  parameters: {
    docs: {
      description: {
        component:
          'Semantic instrument status — ok / warn / red map to the feedback tokens (distinct from the theme accent); unavailable is a hollow muted state ("no data" is a state, not an alarm).',
      },
    },
  },
  args: { status: 'ok' },
  argTypes: {
    status: { control: 'inline-radio', options: ['ok', 'warn', 'red', 'unavailable'] },
  },
} satisfies Meta<typeof StatusPip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <StatusPip status="ok" />
      <StatusPip status="warn" />
      <StatusPip status="red" />
      <StatusPip status="unavailable" />
    </div>
  ),
}
