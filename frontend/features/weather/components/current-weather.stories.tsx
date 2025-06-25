import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CurrentWeather } from '@/features/weather/components/current-weather';
import { WeatherForecast } from '@/features/weather/types/weather';
import { handlers } from '@/mocks/handlers';
import prefectureForecast from '@/mocks/handlers/prefecture-forecast.json';

const meta = {
  component: CurrentWeather,
  title: 'components/CurrentWeather',
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: [...handlers],
    },
  },
} satisfies Meta<typeof CurrentWeather>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    forecast: prefectureForecast[0] as WeatherForecast,
  },
};
