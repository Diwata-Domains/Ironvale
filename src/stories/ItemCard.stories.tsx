import type { Meta, StoryObj } from '@storybook/react-vite'
import { ItemCard, Stack } from '../index.js'

const meta = {
  title: 'Shell/ItemCard',
  component: ItemCard,
  parameters: {
    docs: {
      description: {
        component:
          'Compact overview card for a single Grain packet or Sanctum to-do — the row the Sovereign "Today" surface repeats.',
      },
    },
  },
  args: {
    title: 'Scry data-lake setup',
    description: 'CCX23 — TASK-0115',
    status: 'red',
    badge: { label: 'critical', variant: 'error' },
    meta: 'Grain · Diwata-Infra',
  },
} satisfies Meta<typeof ItemCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const List: Story = {
  render: () => (
    <Stack gap="sm" style={{ maxWidth: '32rem' }}>
      <ItemCard
        status="red"
        title="Scry data-lake setup"
        description="CCX23 — TASK-0115"
        badge={{ label: 'critical', variant: 'error' }}
        meta="Grain · Diwata-Infra"
      />
      <ItemCard
        status="yellow"
        title="Health domain"
        description="Neglected 4 days"
        badge={{ label: 'to-do', variant: 'warning' }}
        meta="Sanctum"
      />
      <ItemCard
        status="green"
        title="Sovereign shell"
        description="AppShell, AppNav, ScrollArea shipped"
        badge={{ label: 'done', variant: 'success' }}
        meta="Grain · ironvale"
        onClick={() => {}}
      />
    </Stack>
  ),
}
