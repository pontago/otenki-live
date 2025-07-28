import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ContactForm } from '@/features/contact/components/contact-form';
import { handlers } from '@/mocks/handlers';

const meta = {
  component: ContactForm,
  title: 'components/ContactForm',
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: [...handlers],
    },
  },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
