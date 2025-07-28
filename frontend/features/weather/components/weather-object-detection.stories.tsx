import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
};
