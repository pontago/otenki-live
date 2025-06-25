import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
    forecast: prefectureForecast[0] as WeatherForecast,
  },
};
