import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { Input, Stack, Text } from '../index.js';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Single-line form control primitive. Inputs require an external label in real usage, and validation or help text should be rendered adjacent to the field rather than encoded in the placeholder.'
      }
    }
  },
  args: {
    type: 'text',
    placeholder: 'name@example.com'
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search']
    }
  }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Stack gap="sm">
      <Text as="label" variant="label" htmlFor="input-story-field">
        {label}
      </Text>
      {children}
      {hint ? <Text variant="caption">{hint}</Text> : null}
    </Stack>
  );
}

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 'min(24rem, calc(100vw - 3rem))' }}>
      <Field label="Email address" hint="Use a persistent label so the field stays understandable after the user types.">
        <Input {...args} id="input-story-field" />
      </Field>
    </div>
  )
};

export const SupportedTypes: Story = {
  render: () => (
    <Stack gap="md">
      <Field label="Search">
        <Input id="search-field" type="search" placeholder="Search accounts" />
      </Field>
      <Field label="Email">
        <Input id="email-field" type="email" placeholder="name@example.com" />
      </Field>
      <Field label="Password">
        <Input id="password-field" type="password" placeholder="Enter password" />
      </Field>
    </Stack>
  )
};

export const ErrorAndDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `error` prop only changes presentation. Pair it with adjacent error copy and appropriate validation semantics in the consuming form.'
      }
    }
  },
  render: () => (
    <Stack gap="md">
      <Field label="Workspace name" hint="This name is already in use.">
        <Input id="workspace-field" error defaultValue="ironvale" aria-invalid="true" />
      </Field>
      <Field label="Archived field" hint="Disabled fields should still be explained when they cannot be edited.">
        <Input id="archived-field" disabled defaultValue="Locked value" />
      </Field>
    </Stack>
  )
};
