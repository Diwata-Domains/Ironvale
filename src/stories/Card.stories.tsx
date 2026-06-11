import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Stack, Text } from '../index.js'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'Container for grouping related content on a themed surface. `base` is the default depth — use `raised` to lift content in a list or grid, `flush` when you own the inner padding.',
      },
    },
  },
  args: { variant: 'base' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['base', 'raised', 'flush'],
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Card content goes here.' },
}

export const Variants: Story = {
  render: () => (
    <Stack gap="md" style={{ width: 'min(28rem, 100%)' }}>
      <Card variant="base">
        <Text variant="label" style={{ display: 'block', marginBottom: 4 }}>Base</Text>
        <Text variant="body">Default surface — use for most content blocks.</Text>
      </Card>
      <Card variant="raised">
        <Text variant="label" style={{ display: 'block', marginBottom: 4 }}>Raised</Text>
        <Text variant="body">Elevated surface — use in grids or to highlight key cards.</Text>
      </Card>
      <Card variant="flush">
        <div style={{ padding: '16px', background: 'var(--ae-color-bg-muted)', borderRadius: 'var(--ae-radius-md)' }}>
          <Text variant="label" style={{ display: 'block', marginBottom: 4 }}>Flush</Text>
          <Text variant="body">No padding — you control the inner layout.</Text>
        </div>
      </Card>
    </Stack>
  ),
}

export const WithHeader: Story = {
  render: () => (
    <Card style={{ width: 'min(28rem, 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <Text as="h3" variant="heading">Familiar Registry</Text>
          <Text variant="caption" style={{ marginTop: 2 }}>3 familiars active</Text>
        </div>
      </div>
      <Text variant="body">
        Cards can contain any mix of heading, body copy, badges, actions, or other components.
        All spacing derives from Aether semantic tokens.
      </Text>
    </Card>
  ),
}
