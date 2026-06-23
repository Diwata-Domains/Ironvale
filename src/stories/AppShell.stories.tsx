import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppShell, AppNav, ScrollArea, Card, Stack, Text } from '../index.js'

const Icon = ({ d }: { d: string }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d={d} />
  </svg>
)

const navItems = [
  { label: 'Today', active: true, icon: <Icon d="M2 6l6-4 6 4v8H2z" /> },
  { label: 'Grain', icon: <Icon d="M3 3h10v10H3z" /> },
  { label: 'Sanctum', icon: <Icon d="M8 2l5 3v6l-5 3-5-3V5z" /> },
  { label: 'Chat', icon: <Icon d="M2 3h12v8H6l-3 2V3z" /> },
]

const meta = {
  title: 'Shell/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Responsive application frame for the Sovereign/Sanctum (Tauri) apps. The nav region is a left rail on desktop and a bottom bar on mobile — resize the canvas below 640px to see it reflow.',
      },
    },
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ height: '480px', border: '1px solid var(--ae-color-border)' }}>
      <AppShell
        nav={<AppNav items={navItems} />}
        statusBar={
          <div style={{ padding: '6px 12px' }}>
            <Text variant="caption">Sovereign · connected to DAEMON</Text>
          </div>
        }
      >
        <ScrollArea style={{ height: '100%', padding: 'var(--ae-space-component-lg)' }}>
          <Stack gap="md" style={{ maxWidth: '40rem' }}>
            <Text as="h2" variant="heading">Today</Text>
            <Card variant="raised">
              <Text variant="label" style={{ display: 'block', marginBottom: 4 }}>Grain · critical</Text>
              <Text variant="body">Scry data-lake (CCX23) setup — TASK-0115</Text>
            </Card>
            <Card variant="raised">
              <Text variant="label" style={{ display: 'block', marginBottom: 4 }}>Sanctum · to-do</Text>
              <Text variant="body">Health domain — neglected 4 days</Text>
            </Card>
          </Stack>
        </ScrollArea>
      </AppShell>
    </div>
  ),
}
