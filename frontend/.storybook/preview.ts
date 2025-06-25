import type { Preview } from '@storybook/nextjs-vite';
import { Settings } from 'luxon';
import { initialize, mswLoader } from 'msw-storybook-addon';

import '../styles/globals.css';

initialize();

Settings.defaultZone = 'Asia/Tokyo';
Settings.defaultLocale = 'ja-JP';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  loaders: [mswLoader],
};

export default preview;
