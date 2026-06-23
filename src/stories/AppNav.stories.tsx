import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppNav } from '../index.js'

const Icon = ({ d }: { d: string }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d={d} />
  </svg>
)

const items = [
  { label: 'Today', active: true, icon: <Icon d="M2 6l6-4 6 4v8H2z" /> },
  { label: 'Grain', icon: <Icon d="M3 3h10v10H3z" /> },
  { label: 'Sanctum', icon: <Icon d="M8 2l5 3v6l-5 3-5-3V5z" /> },
  { label: 'Chat', icon: <Icon d="M2 3h12v8H6l-3 2V3z" /> },
]

const meta = {
  title: 'Shell/AppNav',
  component: AppNav,
  parameters: {
    docs: {
      description: {
        component:
          'Responsive navigation built from `NavItem`s. Vertical rail on desktop, horizontal tab bar on mobile (≤640px). Designed for the `nav` slot of `AppShell`.',
      },
    },
  },
  args: { items },
} satisfies Meta<typeof AppNav>

export default meta
type Story = StoryObj<typeof meta>

export const Rail: Story = {}
