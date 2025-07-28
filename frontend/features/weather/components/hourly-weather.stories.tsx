import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HourlyWeather } from '@/features/weather/components/hourly-weather';
import { handlers } from '@/mocks/handlers';
import hourlyForecast from '@/mocks/handlers/hourly-forecast.json';
import { expect, within } from '@storybook/test';
import { HourlyWeatherData } from '@/features/weather/types/weather';
import { DateTime } from 'luxon';

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
      expect(timeElement).toBeInTheDocument();

      const tempElement = await canvas.findByText(`${forecast.temp}°C`);
      expect(tempElement).toBeInTheDocument();

      const cardElement = timeElement.closest('[data-slot="card"]');
      expect(cardElement).toBeInTheDocument();

      const weatherElement = cardElement?.querySelector('img');
      expect(weatherElement).toBeInTheDocument();
      expect(weatherElement).toHaveAttribute(
        'src',
        expect.stringContaining(`/icons/weather/${forecast.weatherCode}.png`)
      );
      expect(weatherElement).toHaveAttribute('alt', forecast.weatherName);
    }
  },
};
