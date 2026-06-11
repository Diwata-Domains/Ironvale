import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Table, Tbody, Td, Th, Thead, Tr } from '../index.js'

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'Semantic data table using the full sub-component set: Table, Thead, Tbody, Tr, Th, Td. Use `compact` for dense operator views. Use `static` to disable row hover highlighting.',
      },
    },
  },
  args: { compact: false, static: false },
  argTypes: {
    compact: { control: 'boolean' },
    static: { control: 'boolean' },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { name: 'Vesper',  tier: 'sovereign', status: 'active',    joined: '2026-01-12' },
  { name: 'Oryn',    tier: 'adept',     status: 'active',    joined: '2026-02-08' },
  { name: 'Kael',    tier: 'guild',     status: 'draft',     joined: '2026-04-03' },
  { name: 'Sable',   tier: 'adept',     status: 'suspended', joined: '2026-05-19' },
]

function statusVariant(s: string) {
  if (s === 'active') return 'success' as const
  if (s === 'suspended') return 'error' as const
  return 'neutral' as const
}

function tierVariant(t: string) {
  if (t === 'sovereign' || t === 'adept' || t === 'guild') return t as const
  return 'neutral' as const
}

export const Default: Story = {
  render: (args) => (
    <Table {...args} style={{ width: 'min(36rem, 100%)' }}>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Tier</Th>
          <Th>Status</Th>
          <Th>Joined</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((r) => (
          <Tr key={r.name}>
            <Td style={{ fontWeight: 500 }}>{r.name}</Td>
            <Td><Badge variant={tierVariant(r.tier)}>{r.tier}</Badge></Td>
            <Td><Badge variant={statusVariant(r.status)}>{r.status}</Badge></Td>
            <Td style={{ fontFamily: 'monospace' }}>{r.joined}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  ),
}

export const Compact: Story = {
  render: () => (
    <Table compact style={{ width: 'min(36rem, 100%)' }}>
      <Thead>
        <Tr><Th>Name</Th><Th>Tier</Th><Th>Status</Th><Th>Joined</Th></Tr>
      </Thead>
      <Tbody>
        {rows.map((r) => (
          <Tr key={r.name}>
            <Td style={{ fontWeight: 500 }}>{r.name}</Td>
            <Td><Badge variant={tierVariant(r.tier)}>{r.tier}</Badge></Td>
            <Td><Badge variant={statusVariant(r.status)}>{r.status}</Badge></Td>
            <Td style={{ fontFamily: 'monospace' }}>{r.joined}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  ),
}
