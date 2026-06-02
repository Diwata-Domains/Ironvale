import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack, Surface, Text } from '../index.js';

const meta = {
  title: 'Primitives/Surface',
  component: Surface,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Container primitive for grouping content on a token-driven background. Choose the variant that matches the content hierarchy and keep semantic structure with the `as` prop when the surface represents a section or article.'
      }
    }
  },
  args: {
    variant: 'base'
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['base', 'raised', 'overlay']
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'aside']
    }
  }
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

function SurfaceContent() {
  return (
    <Stack gap="sm">
      <Text as="h3" variant="heading">
        Revenue snapshot
      </Text>
      <Text variant="body">
        Use surfaces to group related content and let Aether semantic tokens control depth.
      </Text>
      <Text variant="caption">Updated 5 minutes ago</Text>
    </Stack>
  );
}

export const Default: Story = {
  args: {
    as: 'section'
  },
  render: (args) => (
    <Surface {...args} style={{ width: 'min(32rem, calc(100vw - 3rem))' }}>
      <SurfaceContent />
    </Surface>
  )
};

export const Variants: Story = {
  render: () => (
    <Stack gap="md">
      <Surface variant="base">
        <SurfaceContent />
      </Surface>
      <Surface variant="raised">
        <SurfaceContent />
      </Surface>
      <Surface variant="overlay">
        <SurfaceContent />
      </Surface>
    </Stack>
  )
};
