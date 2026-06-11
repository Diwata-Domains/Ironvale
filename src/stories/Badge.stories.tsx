import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Stack } from '../index.js'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'Inline label for status, intent, or categorical classification. Intent variants (success/warning/error/neutral/info) communicate system state. Tier variants (sovereign/adept/guild) are Conclave-specific classifications.',
      },
    },
  },
  args: { variant: 'neutral', children: 'Badge' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'neutral', 'info', 'sovereign', 'adept', 'guild'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const IntentVariants: Story = {
  name: 'Intent variants',
  render: () => (
    <Stack direction="horizontal" gap="sm" wrap>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Degraded</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="neutral">Draft</Badge>
      <Badge variant="info">Pending</Badge>
    </Stack>
  ),
}

export const TierVariants: Story = {
  name: 'Tier variants (Conclave)',
  parameters: {
    docs: {
      description: {
        story: 'Used to classify Conclave familiars by tier. Sovereign uses the gold accent, reflecting its elevated status.',
      },
    },
  },
  render: () => (
    <Stack direction="horizontal" gap="sm" wrap>
      <Badge variant="sovereign">Sovereign</Badge>
      <Badge variant="adept">Adept</Badge>
      <Badge variant="guild">Guild</Badge>
    </Stack>
  ),
}

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <Stack gap="sm">
      <Stack direction="horizontal" gap="sm" wrap>
        <Badge variant="success">success</Badge>
        <Badge variant="warning">warning</Badge>
        <Badge variant="error">error</Badge>
        <Badge variant="neutral">neutral</Badge>
        <Badge variant="info">info</Badge>
      </Stack>
      <Stack direction="horizontal" gap="sm" wrap>
        <Badge variant="sovereign">sovereign</Badge>
        <Badge variant="adept">adept</Badge>
        <Badge variant="guild">guild</Badge>
      </Stack>
    </Stack>
  ),
}
