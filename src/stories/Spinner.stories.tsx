import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Spinner, Stack, Text } from '../index.js'

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          'CSS-only loading indicator. Uses `--ae-color-action-primary` for the spinning segment so it picks up the correct brand colour in every product theme. Always pair with an accessible label — the component renders `role="status"` and `aria-label="Loading"` by default.',
      },
    },
  },
  args: { size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="lg" style={{ alignItems: 'center' }}>
      <Stack gap="sm" style={{ alignItems: 'center' }}>
        <Spinner size="sm" /><Text variant="caption">sm</Text>
      </Stack>
      <Stack gap="sm" style={{ alignItems: 'center' }}>
        <Spinner size="md" /><Text variant="caption">md</Text>
      </Stack>
      <Stack gap="sm" style={{ alignItems: 'center' }}>
        <Spinner size="lg" /><Text variant="caption">lg</Text>
      </Stack>
    </Stack>
  ),
}

export const InButton: Story = {
  name: 'In context (loading button)',
  render: () => (
    <Stack direction="horizontal" gap="sm">
      <Button disabled aria-busy="true">
        <Spinner size="sm" />
        Saving…
      </Button>
      <Button variant="ghost" disabled aria-busy="true">
        <Spinner size="sm" />
        Loading
      </Button>
    </Stack>
  ),
}

export const FullPageState: Story = {
  name: 'Full-page loading state',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '48px 0' }}>
      <Spinner size="lg" />
      <Text variant="caption">Loading familiars…</Text>
    </div>
  ),
}
