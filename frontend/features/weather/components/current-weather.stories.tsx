import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

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
    forecast: prefectureForecast.find((forecast) => forecast.areaCode === 'tokyo') as WeatherForecast,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const forecast = prefectureForecast.find((forecast) => forecast.areaCode === 'tokyo') as WeatherForecast;

    const regionElement = await canvas.findByText(forecast.areaName);
    await expect(regionElement).toBeInTheDocument();

    const weatherElement = await canvas.findByText(forecast.weatherName);
    await expect(weatherElement).toBeInTheDocument();

    const maxTempElement = await canvas.findByText(`最高気温: ${String(forecast.tempMax)}°C`);
    await expect(maxTempElement).toBeInTheDocument();

    const minTempElement = await canvas.findByText(`最低気温: ${String(forecast.tempMin)}°C`);
    await expect(minTempElement).toBeInTheDocument();

    const popElement = await canvas.findByText(`${String(forecast.pops[0].pop)}%`);
    await expect(popElement).toBeInTheDocument();

    const personElement = await canvas.findByText(`歩行者: ${String(forecast.liveDetectData?.person)}人`);
    await expect(personElement).toBeInTheDocument();

    const umbrellaElement = await canvas.findByText(`傘利用: ${String(forecast.liveDetectData?.umbrella)}人`);
    await expect(umbrellaElement).toBeInTheDocument();

    const tshirtElement = await canvas.findByText(`半袖: ${String(forecast.liveDetectData?.tshirt)}人`);
    await expect(tshirtElement).toBeInTheDocument();

    const longSleeveElement = await canvas.findByText(`長袖: ${String(forecast.liveDetectData?.longSleeve)}人`);
    await expect(longSleeveElement).toBeInTheDocument();
  },
};
