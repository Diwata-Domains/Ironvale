import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Input, Stack, Surface, Text } from '../index.js';

const meta = {
  title: 'Foundations/Introduction',
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Workspace: Story = {
  render: () => (
    <Surface
      variant="raised"
      style={{
        width: 'min(40rem, calc(100vw - 2rem))',
        margin: '1rem auto'
      }}
    >
      <Stack gap="lg">
        <div>
          <Text as="h1" variant="heading">
            Ironvale Storybook
          </Text>
          <Text variant="body">
            Storybook is configured and loading Aether tokens plus Ironvale source CSS.
          </Text>
        </div>
        <Stack direction="horizontal" gap="sm" wrap>
          <Button variant="primary">Primary action</Button>
          <Button variant="ghost">Secondary action</Button>
          <Button variant="danger">Destructive action</Button>
        </Stack>
        <Stack gap="sm">
          <Text as="label" variant="label" htmlFor="storybook-input">
            Example field
          </Text>
          <Input id="storybook-input" placeholder="Component stories land in Phase 2" />
        </Stack>
      </Stack>
    </Surface>
  )
};
