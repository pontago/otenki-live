import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DateTime } from 'luxon';
import { expect, within } from 'storybook/test';

import { WeatherObjectDetection } from '@/features/weather/components/weather-object-detection';
import { handlers } from '@/mocks/handlers';
import objectDetectionData from '@/mocks/handlers/object-detection-data.json';

import { LiveDetectData } from '../types/weather';

const meta = {
  component: WeatherObjectDetection,
  title: 'components/WeatherObjectDetection',
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: [...handlers],
    },
  },
} satisfies Meta<typeof WeatherObjectDetection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: objectDetectionData as LiveDetectData[],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const data = objectDetectionData as LiveDetectData[];

    for (const item of data) {
      const timeElement = await canvas.findByText(DateTime.fromISO(item.dateTime).toFormat('HH:mm'));
      await expect(timeElement).toBeInTheDocument();

      const personElement = await canvas.findByText(`歩行者: ${String(item.person)}人`);
      await expect(personElement).toBeInTheDocument();

      const umbrellaElement = await canvas.findByText(`傘利用: ${String(item.umbrella)}人`);
      await expect(umbrellaElement).toBeInTheDocument();

      const tshirtElement = await canvas.findByText(`半袖: ${String(item.tshirt)}人長袖: ${String(item.longSleeve)}人`);
      await expect(tshirtElement).toBeInTheDocument();
    }
  },
};
