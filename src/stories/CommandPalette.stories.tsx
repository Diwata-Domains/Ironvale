import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, CommandPalette, StatusChip } from '../index.js'
import type { PaletteItem, StatusChipStatus } from '../index.js'

const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  parameters: {
    docs: {
      description: {
        component:
          'Generic ⌘K jump palette: a focus-trapped input over ranked results (exact id/keyword > id substring > title prefix > title substring). Router-agnostic — the host owns the hotkey and acts on `onSelect`. Rows are customizable via `renderItem`.',
      },
    },
  },
  args: {
    open: true,
    onClose: () => {},
    onSelect: () => {},
    items: [],
  },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

interface TicketItem extends PaletteItem {
  status: StatusChipStatus
}

const TICKETS: TicketItem[] = [
  {
    id: 'ASSAY-1',
    title: 'Login page renders blank',
    keywords: ['VERIFY-0001-001'],
    status: 'reopened',
  },
  {
    id: 'ASSAY-2',
    title: 'Checkout button moved',
    keywords: ['VERIFY-0002-001'],
    status: 'confirm-proposed',
  },
  { id: 'ASSAY-3', title: 'Footer typo fixed', status: 'closed' },
]

function Demo() {
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div style={{ minHeight: 240 }}>
      <Button onClick={() => setOpen(true)}>Open palette (⌘K in-app)</Button>
      {picked && <p>Selected: {picked}</p>}
      <CommandPalette<TicketItem>
        open={open}
        onClose={() => setOpen(false)}
        items={TICKETS}
        onSelect={(t) => setPicked(t.id)}
        placeholder="Jump to ticket — id, VERIFY-…, or words"
        emptyLabel="No matching tickets"
        renderItem={(t) => (
          <>
            <span style={{ fontFamily: 'var(--ae-font-family-mono)' }}>{t.id}</span>
            <span className="iv-cmdk-item-title">{t.title}</span>
            <StatusChip status={t.status} />
          </>
        )}
      />
    </div>
  )
}

export const TicketJumper: Story = {
  name: 'Ticket jumper (custom rows)',
  render: () => <Demo />,
}
