import type { Meta, StoryObj } from '@storybook/react-vite'
import { NavItem, Stack } from '../index.js'

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" />
    <rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" />
  </svg>
)

const CircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" /><circle cx="8" cy="8" r="2" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="2.5" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" />
  </svg>
)

const meta = {
  title: 'Components/NavItem',
  component: NavItem,
  parameters: {
    docs: {
      description: {
        component:
          'Navigation link used inside app sidebars. Renders as an `<a>` — pair with your router\'s link component or `NavLink` by applying `iv-nav-item` and `iv-nav-item--active` CSS classes directly.',
      },
    },
  },
  args: { label: 'Dashboard', active: false },
  argTypes: {
    active: { control: 'boolean' },
  },
} satisfies Meta<typeof NavItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = {
  args: { active: true },
}

export const WithIcon: Story = {
  args: { label: 'Familiars', icon: <GridIcon /> },
}

export const NavGroup: Story = {
  name: 'Nav group (sidebar)',
  parameters: {
    docs: {
      description: {
        story: 'Typical sidebar usage — one active item, rest idle. Active state uses `--ae-color-action-primary` which resolves to product-theme crimson (Conclave) or gold (DAEMON).',
      },
    },
  },
  render: () => (
    <div style={{ width: 180, background: 'var(--ae-color-bg-subtle)', padding: '8px', borderRadius: 'var(--ae-radius-lg)' }}>
      <Stack gap="xs">
        <NavItem label="Familiars" icon={<GridIcon />} active />
        <NavItem label="Circles" icon={<CircleIcon />} />
        <NavItem label="Settings" icon={<SettingsIcon />} />
      </Stack>
    </div>
  ),
}
