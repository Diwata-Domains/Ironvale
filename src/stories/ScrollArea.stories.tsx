import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea, Stack, Text } from '../index.js'

const meta = {
  title: 'Shell/ScrollArea',
  component: ScrollArea,
  parameters: {
    docs: {
      description: {
        component: 'Overflow container with a themed thin scrollbar, for scrollable panels inside the app shell.',
      },
    },
  },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ScrollArea style={{ height: '220px', maxWidth: '24rem', border: '1px solid var(--ae-color-border)', padding: 'var(--ae-space-component-md)' }}>
      <Stack gap="sm">
        {Array.from({ length: 20 }, (_, i) => (
          <Text key={i} variant="body">Scrollable row {i + 1}</Text>
        ))}
      </Stack>
    </ScrollArea>
  ),
}
