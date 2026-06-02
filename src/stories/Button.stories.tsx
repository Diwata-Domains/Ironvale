import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Stack } from '../index.js';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Presentation-only button primitive. Use the native `button` element for actions, keep visible button text concise, and prefer `disabled` only when the action is truly unavailable.'
      }
    }
  },
  args: {
    children: 'Save changes',
    variant: 'primary',
    size: 'md'
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'ghost', 'danger']
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    }
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="horizontal" gap="sm" wrap>
      <Button {...args} variant="primary">
        Primary action
      </Button>
      <Button {...args} variant="ghost">
        Secondary action
      </Button>
      <Button {...args} variant="danger">
        Delete record
      </Button>
    </Stack>
  )
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="horizontal" gap="sm" wrap>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </Stack>
  )
};

export const DisabledAndBusy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `aria-busy="true"` when work is in progress and the label still describes the pending action. Disabled buttons should remain rare and still be paired with nearby explanatory text in product UIs.'
      }
    }
  },
  render: (args) => (
    <Stack direction="horizontal" gap="sm" wrap>
      <Button {...args} disabled>
        Disabled
      </Button>
      <Button {...args} aria-busy="true">
        Saving...
      </Button>
    </Stack>
  )
};
