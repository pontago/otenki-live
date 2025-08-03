import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DailyWeather } from '@/features/weather/components/daily-weather';
import { WeatherForecast } from '@/features/weather/types/weather';
import { handlers } from '@/mocks/handlers';
import dailyForecast from '@/mocks/handlers/daily-forecast.json';
import { expect, within } from '@storybook/test';
import { DateTime } from 'luxon';

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
      expect(dateElement).toBeInTheDocument();

      const cardElement = dateElement.closest('[data-slot="card"]');
      expect(cardElement).toBeInTheDocument();

      const weatherElement = cardElement?.querySelector('img');
      expect(weatherElement).toBeInTheDocument();
      expect(weatherElement).toHaveAttribute(
        'src',
        expect.stringContaining(`/icons/weather/${forecast.weatherCode}.png`)
      );
      expect(weatherElement).toHaveAttribute('alt', forecast.weatherName);

      const maxTempElement = await canvas.findByText(`${forecast.tempMax}°C`);
      expect(maxTempElement).toBeInTheDocument();

      const minTempElement = await canvas.findByText(`${forecast.tempMin}°C`);
      expect(minTempElement).toBeInTheDocument();
    }
  },
};
