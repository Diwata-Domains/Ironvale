import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack, StatusChip } from '../index.js'

const meta = {
  title: 'Components/StatusChip',
  component: StatusChip,
  parameters: {
    docs: {
      description: {
        component:
          'Ticket/work-item status chip family for the suite-wide lifecycle vocabulary (CP-006 + the ticketing rulings): a pass proposes closure (confirm-proposed, gold), a human confirms (closed), and a failed re-verification reopens the SAME item (reopened). Dense-list friendly: each chip leads with a state dot.',
      },
    },
  },
  args: { status: 'open' },
  argTypes: {
    status: {
      control: 'select',
      options: ['triage', 'todo', 'open', 'reopened', 'confirm-proposed', 'closed', 'canceled'],
    },
    label: { control: 'text' },
  },
} satisfies Meta<typeof StatusChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Lifecycle: Story = {
  name: 'The ruled lifecycle',
  render: () => (
    <Stack direction="horizontal" gap="sm" wrap>
      <StatusChip status="triage" />
      <StatusChip status="todo" />
      <StatusChip status="open" />
      <StatusChip status="reopened" />
      <StatusChip status="confirm-proposed" />
      <StatusChip status="closed" />
      <StatusChip status="canceled" />
    </Stack>
  ),
}

export const DenseLabel: Story = {
  name: 'Label override (dense lists)',
  render: () => <StatusChip status="confirm-proposed" label="Proposed" />,
}
