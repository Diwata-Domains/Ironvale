import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack, Surface, Text } from '../index.js';

const meta = {
  title: 'Primitives/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Layout primitive for vertical and horizontal spacing. Use Stack to express rhythm and grouping instead of ad hoc margin rules, and preserve DOM order so keyboard and screen-reader traversal remain predictable.'
      }
    }
  },
  args: {
    gap: 'md',
    direction: 'vertical',
    wrap: false
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal']
    },
    gap: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    }
  }
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

function ExampleCard({ label }: { label: string }) {
  return (
    <Surface style={{ minWidth: '10rem' }}>
      <Text variant="label">{label}</Text>
    </Surface>
  );
}

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <ExampleCard label="First item" />
      <ExampleCard label="Second item" />
      <ExampleCard label="Third item" />
    </Stack>
  )
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal'
  },
  render: (args) => (
    <Stack {...args}>
      <ExampleCard label="Filter" />
      <ExampleCard label="Sort" />
      <ExampleCard label="Export" />
    </Stack>
  )
};

export const Wrapping: Story = {
  args: {
    direction: 'horizontal',
    wrap: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'Enable wrapping for horizontal groups that need to survive narrow viewports without collapsing order or relying on one-off responsive overrides.'
      }
    }
  },
  render: (args) => (
    <div style={{ maxWidth: '24rem' }}>
      <Stack {...args}>
        <ExampleCard label="Alpha" />
        <ExampleCard label="Beta" />
        <ExampleCard label="Gamma" />
        <ExampleCard label="Delta" />
      </Stack>
    </div>
  )
};
