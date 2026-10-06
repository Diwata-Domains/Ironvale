import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Calendar, DatePicker, Stack, Text } from '../index.js';

const meta = {
  title: 'Primitives/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A themed date field that replaces `<input type="date">`, whose picker is drawn by the OS and ' +
          'cannot follow the theme. Strings in, strings out: `value`, `min`, `max` and the `onChange` ' +
          'argument are `YYYY-MM-DD` calendar days (or `""` for none) — no `Date` crosses the API and ' +
          'nothing is converted through UTC, so the chosen day never shifts by timezone. The popover is a ' +
          '`role="dialog"` portalled to <body> and positioned with fixed coordinates; it flips and clamps ' +
          'against the viewport. Keyboard: Enter/Space/ArrowDown opens with focus on the chosen day (else ' +
          'today); arrows move by day/week, Home/End by week, PageUp/PageDown by month (Shift: year), ' +
          'Enter/Space chooses, Escape or an outside click closes and returns focus. The exported ' +
          '`Calendar` is the same month grid, inline.',
      },
    },
  },
  args: {
    value: '',
    onChange: () => {},
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ initial = '', ...rest }: { initial?: string } & Record<string, unknown>) {
  const [value, setValue] = useState(initial);
  return (
    <Stack gap="sm">
      <DatePicker value={value} onChange={setValue} aria-label="Due date" {...rest} />
      <Text variant="label">value: {value ? `"${value}"` : '""'}</Text>
    </Stack>
  );
}

const frame = { width: 'min(20rem, calc(100vw - 3rem))', paddingBottom: '24rem' };

export const Default: Story = {
  render: () => (
    <div style={frame}>
      <Controlled />
    </div>
  ),
};

export const Selected: Story = {
  render: () => (
    <div style={frame}>
      <Controlled initial="2026-10-14" />
    </div>
  ),
};

export const Bounded: Story = {
  parameters: {
    docs: {
      description: {
        story: 'With `min` and `max`: days outside the window are disabled and focus never moves past them.',
      },
    },
  },
  render: () => (
    <div style={frame}>
      <Controlled initial="2026-10-14" min="2026-10-10" max="2026-10-20" />
    </div>
  ),
};

export const SundayStart: Story = {
  render: () => (
    <div style={frame}>
      <Controlled initial="2026-10-14" weekStartsOn={0} clearable={false} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <Stack gap="md" style={{ width: 'min(20rem, calc(100vw - 3rem))' }}>
      <Stack gap="sm">
        <Text variant="label">Placeholder</Text>
        <DatePicker value="" onChange={() => {}} aria-label="Due date" />
      </Stack>
      <Stack gap="sm">
        <Text variant="label">Disabled</Text>
        <DatePicker value="2026-10-14" onChange={() => {}} disabled aria-label="Due date" />
      </Stack>
    </Stack>
  ),
};

export const InlineCalendar: Story = {
  parameters: {
    docs: {
      description: { story: 'The month grid on its own — the presentational half, with no field or popover.' },
    },
  },
  render: () => {
    const [value, setValue] = useState('2026-10-14');
    return (
      <Stack gap="sm">
        <Calendar value={value} onSelect={setValue} />
        <Text variant="label">value: "{value}"</Text>
      </Stack>
    );
  },
};
