import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DailyWeather } from '@/features/weather/components/daily-weather';
import { WeatherForecast } from '@/features/weather/types/weather';
import { handlers } from '@/mocks/handlers';
import dailyForecast from '@/mocks/handlers/daily-forecast.json';
import { expect, within } from '@storybook/test';

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
      const dateElement = await canvas.findByText(forecast.date);
      expect(dateElement).toBeInTheDocument();
    }
  },
};
