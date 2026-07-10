import type { Preview } from '@storybook/react-vite'
import '../src/mockup/styles/index.css'
import '../src/krds/krds-tokens.css'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: { name: 'Light', value: '#ffffff' },
        gray: { name: 'Gray', value: '#f8fafc' },
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
}

export default preview
