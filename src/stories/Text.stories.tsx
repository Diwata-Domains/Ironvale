import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack, Text } from '../index.js';

const meta = {
  title: 'Primitives/Text',
  component: Text,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Typography primitive for body copy, labels, headings, and captions. Choose the variant for visual treatment and the `as` prop for semantic HTML so document structure and form labeling stay correct.'
      }
    }
  },
  args: {
    children: 'Body copy communicates the default reading style for Ironvale.'
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['body', 'label', 'heading', 'caption']
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label']
    }
  }
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'body',
    as: 'p'
  }
};

export const Variants: Story = {
  render: () => (
    <Stack gap="sm">
      <Text as="h2" variant="heading">
        Heading variant
      </Text>
      <Text variant="body">
        Body variant is the default for longer text and general interface copy.
      </Text>
      <Text as="label" variant="label" htmlFor="text-story-field">
        Label variant
      </Text>
      <Text variant="caption">Caption variant supports secondary or supporting text.</Text>
    </Stack>
  )
};

export const SemanticElements: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Keep semantic structure separate from styling. For example, a heading may render as `h2` or `h3` depending on page outline, while a label should render as `label` and point to its form control with `htmlFor`.'
      }
    }
  },
  render: () => (
    <Stack gap="sm">
      <Text as="h1" variant="heading">
        Page title
      </Text>
      <Text as="h2" variant="heading">
        Section title
      </Text>
      <Text as="span" variant="caption">
        Inline supporting metadata
      </Text>
      <Text as="label" variant="label" htmlFor="text-story-field">
        Email address
      </Text>
    </Stack>
  )
};
