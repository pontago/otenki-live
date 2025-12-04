import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { DateTime } from 'luxon';

import { DailyWeather } from '@/features/weather/components/daily-weather';
import { WeatherForecast } from '@/features/weather/types/weather';
import { handlers } from '@/mocks/handlers';
import dailyForecast from '@/mocks/handlers/daily-forecast.json';

const meta = {
  component: DailyWeather,
  title: 'components/DailyWeather',
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: [...handlers],
    },
  },
} satisfies Meta<typeof DailyWeather>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: dailyForecast as WeatherForecast[],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dailyForecasts = dailyForecast as WeatherForecast[];

    for (const forecast of dailyForecasts) {
      const dateElement = await canvas.findByText(DateTime.fromISO(forecast.date).toFormat('M/d'));
      await expect(dateElement).toBeInTheDocument();

      const cardElement = dateElement.closest('[data-slot="card"]');
      await expect(cardElement).toBeInTheDocument();

      const weatherElement = cardElement?.querySelector('img');
      await expect(weatherElement).toBeInTheDocument();
      await expect(weatherElement).toHaveAttribute(
        'src',
        expect.stringContaining(`/optimized/icons/weather/${forecast.weatherCode.toString()}-36.png`)
      );
      await expect(weatherElement).toHaveAttribute('alt', forecast.weatherName);

      if (forecast.tempMax !== undefined) {
        const maxTempElement = await canvas.findByText(`${forecast.tempMax.toString()}°C`);
        await expect(maxTempElement).toBeInTheDocument();
      }

      if (forecast.tempMin !== undefined) {
        const minTempElement = await canvas.findByText(`${forecast.tempMin.toString()}°C`);
        await expect(minTempElement).toBeInTheDocument();
      }
    }
  },
};
