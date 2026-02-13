import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DateTime } from 'luxon';
import { expect, within } from 'storybook/test';

import { HourlyWeather } from '@/features/weather/components/hourly-weather';
import { HourlyWeatherData } from '@/features/weather/types/weather';
import { handlers } from '@/mocks/handlers';
import hourlyForecast from '@/mocks/handlers/hourly-forecast.json';

const meta = {
  component: HourlyWeather,
  title: 'components/HourlyWeather',
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: [...handlers],
    },
  },
} satisfies Meta<typeof HourlyWeather>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: hourlyForecast,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hourlyForecasts = hourlyForecast as HourlyWeatherData[];

    for (const forecast of hourlyForecasts) {
      const timeElement = await canvas.findByText(DateTime.fromISO(forecast.dateTime).toFormat('HH:mm'));
      await expect(timeElement).toBeInTheDocument();

      const tempElement = await canvas.findByText(`${forecast.temp.toString()}°C`);
      await expect(tempElement).toBeInTheDocument();

      const cardElement = timeElement.closest('[data-slot="card"]');
      await expect(cardElement).toBeInTheDocument();

      const weatherElement = cardElement?.querySelector('img');
      await expect(weatherElement).toBeInTheDocument();
      await expect(weatherElement).toHaveAttribute(
        'src',
        expect.stringContaining(`/optimized/icons/weather/${forecast.weatherCode.toString()}-36.png`)
      );
      await expect(weatherElement).toHaveAttribute('alt', forecast.weatherName);
    }
  },
};
