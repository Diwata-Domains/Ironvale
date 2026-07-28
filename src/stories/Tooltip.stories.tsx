import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tooltip, Button } from '../index.js';

const meta = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Help/hint primitive. Opens on pointer hover AND keyboard focus, dismisses on Escape or blur, ' +
          'wires aria-describedby, reduced-motion-aware. The vehicle for the toolkit help-system.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnButton: Story = {
  args: {
    label: 'A spring is a source flowing into your verse on a schedule.',
    placement: 'top',
    children: <Button variant="ghost">Hover or focus me</Button>,
  },
};

export const OnText: Story = {
  args: {
    label: 'A signal is a lake arrival that crossed your rules and now asks for judgment.',
    placement: 'bottom',
    children: (
      <span style={{ borderBottom: '1px dotted currentColor', cursor: 'help' }} tabIndex={0}>
        signal
      </span>
    ),
  },
};
