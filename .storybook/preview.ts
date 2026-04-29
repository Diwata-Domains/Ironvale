import type { Preview } from '@storybook/react-vite';

import '@diwata/aether/tokens.css';
import '../src/ironvale.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i
      }
    }
  }
};

export default preview;
