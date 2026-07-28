import type { Meta, StoryObj } from '@storybook/react-vite';

import { AppearancePanel } from '../index.js';

const meta = {
  title: 'Primitives/AppearancePanel',
  component: AppearancePanel,
  parameters: {
    docs: {
      description: {
        component:
          'The appearance editor: 7 theme presets × light/dark × font × text-size × accent × contrast × density. ' +
          'Tokens-as-data (each axis is a data-* attribute + a persisted setter) — no color picker. ' +
          'Click the trigger to open; selecting an axis re-themes the whole canvas.',
      },
    },
  },
} satisfies Meta<typeof AppearancePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // left-anchored so it opens rightward from this left-placed trigger (as in a Settings card)
  render: () => <AppearancePanel align="left" />,
};
