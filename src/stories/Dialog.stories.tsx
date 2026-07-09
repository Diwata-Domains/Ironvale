import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Dialog, Stack, Text } from '../index.js'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          'Accessible modal dialog. Renders in a portal over a scrim, traps focus, closes on Esc or overlay click, locks body scroll, and restores focus to the trigger on close. Provide a `title` (used as the accessible name) or an `ariaLabel`.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    closeOnEsc: { control: 'boolean' },
    closeOnOverlayClick: { control: 'boolean' },
  },
  // Required props satisfied at the meta level; every story drives them via `render`.
  args: { open: false, onClose: () => {} },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { size: 'md', closeOnEsc: true, closeOnOverlayClick: true },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Delete workspace"
          description="This permanently removes the workspace and everything in it."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          <Text variant="body">
            Type the workspace name to confirm in the real flow — this demo just closes.
          </Text>
        </Dialog>
      </>
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null)
    return (
      <Stack direction="horizontal" gap="sm">
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Button key={s} variant="ghost" onClick={() => setSize(s)}>
            Open {s}
          </Button>
        ))}
        <Dialog
          open={size !== null}
          onClose={() => setSize(null)}
          size={size ?? 'md'}
          title={`Size: ${size ?? ''}`}
          description="Width scales with the size prop; height is capped to the viewport."
          footer={
            <Button onClick={() => setSize(null)}>Done</Button>
          }
        >
          <Text variant="body">Body content scrolls when it exceeds the available height.</Text>
        </Dialog>
      </Stack>
    )
  },
}
