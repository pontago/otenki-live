import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PrefectureWeather } from '@/features/weather/components/prefecture-weather';
import { WeatherForecast } from '@/features/weather/types/weather';
import { handlers } from '@/mocks/handlers';
import prefectureForecast from '@/mocks/handlers/prefecture-forecast.json';
import { expect, within } from '@storybook/test';

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
    forecast: prefectureForecast.find((forecast) => forecast.areaCode === 'tokyo') as WeatherForecast,
    region: 'kanto',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const forecast = prefectureForecast.find((forecast) => forecast.areaCode === 'tokyo') as WeatherForecast;

    const regionElement = await canvas.findByText(forecast.areaName);
    expect(regionElement).toBeInTheDocument();

    const maxTempElement = await canvas.findByText(`最高: ${forecast.tempMax}°C`);
    expect(maxTempElement).toBeInTheDocument();

    const minTempElement = await canvas.findByText(`最低: ${forecast.tempMin}°C`);
    expect(minTempElement).toBeInTheDocument();
  },
};
