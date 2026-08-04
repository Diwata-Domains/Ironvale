import type { Meta, StoryObj } from '@storybook/react-vite'
import { MonoStat } from '../index.js'

const meta = {
  title: 'Components/MonoStat',
  component: MonoStat,
  parameters: {
    docs: {
      description: {
        component:
          'One big mono numeral with its label — the instrument register\'s unit of reading a number at a glance. Tabular numerals; the optional delta stays quiet.',
      },
    },
  },
  args: { value: 1204, label: 'users' },
} satisfies Meta<typeof MonoStat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDelta: Story = {
  args: { value: 87, label: 'waitlist', delta: '+3 this week' },
}
