import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CurrentWeather } from '@/features/weather/components/current-weather';
import { WeatherForecast } from '@/features/weather/types/weather';
import { handlers } from '@/mocks/handlers';
import prefectureForecast from '@/mocks/handlers/prefecture-forecast.json';
import { expect, within } from '@storybook/test';

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
    forecast: prefectureForecast.find((forecast) => forecast.areaCode === 'tokyo') as WeatherForecast,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const forecast = prefectureForecast.find((forecast) => forecast.areaCode === 'tokyo') as WeatherForecast;

    const regionElement = await canvas.findByText(forecast.areaName);
    expect(regionElement).toBeInTheDocument();

    const weatherElement = await canvas.findByText(forecast.weatherName);
    expect(weatherElement).toBeInTheDocument();

    const maxTempElement = await canvas.findByText(`最高気温: ${forecast.tempMax}°C`);
    expect(maxTempElement).toBeInTheDocument();

    const minTempElement = await canvas.findByText(`最低気温: ${forecast.tempMin}°C`);
    expect(minTempElement).toBeInTheDocument();

    const popElement = await canvas.findByText(`${forecast.pops[0].pop}%`);
    expect(popElement).toBeInTheDocument();

    const personElement = await canvas.findByText(`歩行者: ${forecast.liveDetectData?.person}人`);
    expect(personElement).toBeInTheDocument();

    const umbrellaElement = await canvas.findByText(`傘利用: ${forecast.liveDetectData?.umbrella}人`);
    expect(umbrellaElement).toBeInTheDocument();

    const tshirtElement = await canvas.findByText(`半袖: ${forecast.liveDetectData?.tshirt}人`);
    expect(tshirtElement).toBeInTheDocument();

    const longSleeveElement = await canvas.findByText(`長袖: ${forecast.liveDetectData?.longSleeve}人`);
    expect(longSleeveElement).toBeInTheDocument();
  },
};
