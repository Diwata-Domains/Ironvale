import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading, Stack, Text } from '../index.js';

const meta = {
  title: 'Primitives/Heading',
  component: Heading,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The section-heading scale: 1 = page title, 2 = section title, 3 = subsection, 4 = ' +
          'uppercase micro-label. `level` drives the size/weight AND the default semantic element ' +
          '(h1–h4); override the tag with `as` when the outline needs a different level than the ' +
          'visual one. Sizes are token-driven, so the text-scale axis lifts the whole scale together.',
      },
    },
  },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { level: 2, children: 'Section title' },
};

export const Scale: Story = {
  render: () => (
    <Stack gap="md">
      <Heading level={1}>Page title — the loudest thing on the screen</Heading>
      <Heading level={2}>Section title groups related content</Heading>
      <Heading level={3}>Subsection heading</Heading>
      <Heading level={4}>Micro-label eyebrow</Heading>
      <Text variant="body">
        Body copy for contrast, so the heading scale reads against the text it introduces.
      </Text>
    </Stack>
  ),
};

export const SemanticOverride: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Keep the document outline correct independent of size. A visually large heading can render ' +
          'as an `h2` when it is not the page title.',
      },
    },
  },
  render: () => (
    <Stack gap="sm">
      <Heading level={4} as="h2">
        Overview
      </Heading>
      <Heading level={1} as="h2">
        Visually a page title, semantically an h2
      </Heading>
    </Stack>
  ),
};
