import React from 'react'
import type { Preview, Decorator } from '@storybook/react-vite'

import '@diwata/aether/tokens.css'
import '@diwata/aether/themes/conclave.css'
import '@diwata/aether/themes/daemon.css'
import '@diwata/aether/themes/diwa.css'
import '../src/ironvale.css'

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals['theme'] as string) || 'diwata'
  return (
    <div
      data-theme={theme}
      style={{
        padding: '1.5rem',
        background: 'var(--ae-color-bg-base)',
        color: 'var(--ae-color-text-primary)',
        minHeight: '100vh',
        fontFamily: 'var(--ae-font-family-base)',
      }}
    >
      <Story />
    </div>
  )
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Diwata product theme',
      defaultValue: 'diwata',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default (light)' },
          { value: 'diwata',   title: 'Diwata (dark brand)' },
          { value: 'dark',     title: 'Dark (neutral)' },
          { value: 'conclave', title: 'Conclave' },
          { value: 'daemon',   title: 'DAEMON' },
          { value: 'diwa',     title: 'Diwa Domains' },
        ],
        showName: true,
      },
    },
  },
  decorators: [withTheme],
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: { toc: true },
    viewport: {
      viewports: {
        web:     { name: 'Web (1280px)',     styles: { width: '1280px', height: '800px' } },
        tablet:  { name: 'Tablet (768px)',   styles: { width: '768px',  height: '1024px' } },
        mobile:  { name: 'Mobile (390px)',   styles: { width: '390px',  height: '844px' } },
        desktop: { name: 'Desktop (1440px)', styles: { width: '1440px', height: '900px' } },
      },
      defaultViewport: 'web',
    },
  },
  tags: ['autodocs'],
}

export default preview
