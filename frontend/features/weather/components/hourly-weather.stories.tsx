import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HourlyWeather } from '@/features/weather/components/hourly-weather';
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
};
