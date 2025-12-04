import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { PrefectureWeather } from '@/features/weather/components/prefecture-weather';
import { WeatherForecast } from '@/features/weather/types/weather';
import { handlers } from '@/mocks/handlers';
import prefectureForecast from '@/mocks/handlers/prefecture-forecast.json';

const meta = {
  component: PrefectureWeather,
  title: 'components/PrefectureWeather',
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: [...handlers],
    },
  },
} satisfies Meta<typeof PrefectureWeather>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    forecasts: prefectureForecast.filter((forecast) => forecast.regionCode === 'kanto') as WeatherForecast[],
    region: 'kanto',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const forecasts = prefectureForecast.filter((forecast) => forecast.regionCode === 'kanto') as WeatherForecast[];

    for (const forecast of forecasts) {
      const prefElement = await canvas.findByText(forecast.areaName);
      await expect(prefElement).toBeInTheDocument();

      const cardElement = prefElement.closest('[data-slot="card"]');
      await expect(cardElement).toBeInTheDocument();

      const cardCanvas = within(cardElement as HTMLElement);
      const maxTempElement = await cardCanvas.findByText(`最高: ${String(forecast.tempMax)}°C`);
      await expect(maxTempElement).toBeInTheDocument();

      const minTempElement = await cardCanvas.findByText(`最低: ${String(forecast.tempMin)}°C`);
      await expect(minTempElement).toBeInTheDocument();
    }
  },
};
