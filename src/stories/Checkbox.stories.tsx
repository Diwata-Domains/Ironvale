import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox, Stack } from '../index.js';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A themed checkbox on a real `<input type="checkbox">`. Border when unchecked, accent fill + ' +
          'check glyph when checked, a dash when indeterminate. Focus-visible ring is drawn on the box. ' +
          'Controlled via `checked` / `onChange`; an optional `label` makes the whole row the click target.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ label, initial = false }: { label: string; initial?: boolean }) {
  const [checked, setChecked] = useState(initial);
  return <Checkbox label={label} checked={checked} onChange={setChecked} />;
}

export const Default: Story = {
  render: () => <Controlled label="Email me about replies" />,
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Every visual state side by side — unchecked, checked, indeterminate, and disabled.',
      },
    },
  },
  render: () => (
    <Stack gap="md">
      <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
      <Checkbox label="Checked" checked onChange={() => {}} />
      <Checkbox label="Indeterminate" indeterminate onChange={() => {}} />
      <Checkbox label="Disabled unchecked" disabled checked={false} onChange={() => {}} />
      <Checkbox label="Disabled checked" disabled checked onChange={() => {}} />
      <Checkbox aria-label="No label" checked onChange={() => {}} />
    </Stack>
  ),
};

export const Group: Story = {
  render: () => (
    <Stack gap="sm">
      <Controlled label="Springs" initial />
      <Controlled label="Signals" initial />
      <Controlled label="Missions" />
      <Controlled label="Agents" />
    </Stack>
  ),
};
