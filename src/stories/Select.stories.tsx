import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select, Stack, Text } from '../index.js';

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A themed dropdown that replaces the native `<select>` so the open menu follows the theme. ' +
          'The menu is portalled to <body> and positioned with fixed coordinates — it flips and clamps ' +
          'against the viewport so an overflow ancestor or a screen edge never clips it. Keyboard: open ' +
          'with Enter/Space/ArrowDown, move with arrows/Home/End, type-ahead to jump, Enter to choose, ' +
          'Escape/Tab/outside-click to dismiss. The active option is exposed via aria-activedescendant.',
      },
    },
  },
  args: {
    value: '',
    onChange: () => {},
    options: [],
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

function Controlled({ initial = '', ...rest }: { initial?: string } & Record<string, unknown>) {
  const [value, setValue] = useState(initial);
  return <Select value={value} onChange={setValue} options={FRUITS} aria-label="Fruit" {...rest} />;
}

export const Default: Story = {
  render: () => (
    <div style={{ width: 'min(20rem, calc(100vw - 3rem))' }}>
      <Controlled />
    </div>
  ),
};

export const Selected: Story = {
  render: () => (
    <div style={{ width: 'min(20rem, calc(100vw - 3rem))' }}>
      <Controlled initial="cherry" />
    </div>
  ),
};

export const Open: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The menu open, showing the selected option (accent checkmark) and the active option state.',
      },
    },
  },
  render: () => {
    const [value, setValue] = useState('banana');
    return (
      <div style={{ width: 'min(20rem, calc(100vw - 3rem))', paddingBottom: '18rem' }}>
        <Select
          value={value}
          onChange={setValue}
          options={FRUITS}
          aria-label="Fruit"
          data-testid="open-select"
        />
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <Stack gap="md" style={{ width: 'min(20rem, calc(100vw - 3rem))' }}>
      <Stack gap="sm">
        <Text variant="label">Placeholder</Text>
        <Controlled />
      </Stack>
      <Stack gap="sm">
        <Text variant="label">Disabled</Text>
        <Select value="apple" onChange={() => {}} options={FRUITS} disabled aria-label="Fruit" />
      </Stack>
    </Stack>
  ),
};
