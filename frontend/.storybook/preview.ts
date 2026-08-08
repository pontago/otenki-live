import type { Preview } from '@storybook/nextjs-vite';
import { Settings } from 'luxon';
import { mswLoader } from 'msw-storybook-addon/csf3';

import '../styles/globals.css';

// msw-storybook-addon 3.0 で initialize() は廃止され、addon 側が worker の
// 生成と起動を行うようになった (main.ts の addons に登録する)
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
  loaders: [mswLoader()],
};

export default preview;
