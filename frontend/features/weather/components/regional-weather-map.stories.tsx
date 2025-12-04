import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { RegionalWeatherMap } from '@/features/weather/components/regional-weather-map';
import { RegionalWeather } from '@/features/weather/types/weather';
import { handlers } from '@/mocks/handlers';
import regionalForecast from '@/mocks/handlers/regional-forecast.json';

const meta = {
  component: RegionalWeatherMap,
  title: 'components/RegionalWeatherMap',
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: [...handlers],
    },
  },
} satisfies Meta<typeof RegionalWeatherMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    forecasts: regionalForecast as RegionalWeather[],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // モックデータからリージョン情報を取得
    const regionTests = (regionalForecast as RegionalWeather[]).map((forecast) => ({
      regionName: forecast.regionName,
      regionCode: forecast.regionCode,
      expectedHref: `/${forecast.regionCode}`,
    }));

    // 各リージョンのテストを実行
    for (const test of regionTests) {
      // リージョンの要素が存在することを確認
      const regionElement = await canvas.findByTitle(test.regionName);
      await expect(regionElement).toBeInTheDocument();

      // リージョンのリンクが正しく設定されているかテスト
      const regionLink = await canvas.findByRole('link', { name: new RegExp(test.regionName) });
      await expect(regionLink).toHaveAttribute('href', test.expectedHref);
    }

    // 総合的な確認
    await expect(regionTests).toHaveLength(regionalForecast.length); // モックデータのリージョン数と一致することを確認
  },
};
