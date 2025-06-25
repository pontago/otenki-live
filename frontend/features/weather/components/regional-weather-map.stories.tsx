import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
};
