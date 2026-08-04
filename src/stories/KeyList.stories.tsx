import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusChip, useKeyList } from '../index.js'
import type { StatusChipStatus } from '../index.js'

const ROWS: { id: string; title: string; status: StatusChipStatus }[] = [
  { id: 'ASSAY-1', title: 'Login page renders blank', status: 'reopened' },
  { id: 'ASSAY-2', title: 'Checkout button moved', status: 'confirm-proposed' },
  { id: 'ASSAY-3', title: 'Footer typo fixed', status: 'closed' },
  { id: 'ASSAY-4', title: 'CTA contrast below AA', status: 'open' },
]

function Demo() {
  const [last, setLast] = useState<string | null>(null)
  const list = useKeyList({
    count: ROWS.length,
    onActivate: (i) => setLast(ROWS[i].id),
  })
  return (
    <div>
      <p style={{ color: 'var(--ae-color-text-muted)' }}>
        Click the list once, then <kbd>j</kbd>/<kbd>k</kbd> or arrows to move, <kbd>Enter</kbd> to
        activate.{last && ` Last activated: ${last}`}
      </p>
      <div style={{ border: '1px solid var(--ae-color-border)', borderRadius: 8 }}>
        {ROWS.map((row, i) => (
          <a
            key={row.id}
            href={`#${row.id}`}
            ref={list.registerRow(i)}
            onClick={(e) => {
              e.preventDefault()
              setLast(row.id)
            }}
            onMouseEnter={() => list.select(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '6px 12px',
              textDecoration: 'none',
              color: 'var(--ae-color-text-primary)',
              background: i === list.selected ? 'var(--ae-color-bg-subtle)' : 'transparent',
            }}
          >
            <span style={{ fontFamily: 'var(--ae-font-family-mono)' }}>{row.id}</span>
            <span style={{ flex: 1 }}>{row.title}</span>
            <StatusChip status={row.status} />
          </a>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: 'Hooks/useKeyList',
  parameters: {
    docs: {
      description: {
        component:
          'Keyboard-first list machinery: j/k + arrows move selection AND focus (real focus-visible states), Enter activates, "/" hands off to a filter input. Typing contexts and modifier chords are ignored. Escape stays with the host page.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TicketList: Story = {
  name: 'Dense ticket list',
  render: () => <Demo />,
}
