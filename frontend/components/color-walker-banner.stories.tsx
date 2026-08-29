import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { ColorWalkerBanner } from '@/components/color-walker-banner';

import { CONSTANTS } from '@/lib/constants';

const meta = {
  component: ColorWalkerBanner,
  title: 'components/ColorWalkerBanner',
  tags: ['autodocs'],
} satisfies Meta<typeof ColorWalkerBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // バナー全体が外部リンクとして機能していることを確認
    const link = await canvas.findByRole('link', { name: new RegExp(CONSTANTS.COLOR_WALKER.NAME) });
    await expect(link).toHaveAttribute('href', CONSTANTS.COLOR_WALKER.URL);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    // SEO 上のキーワードがアンカーテキストに含まれていることを確認
    await expect(link).toHaveTextContent('カラーハンティングアプリ');
    await expect(await canvas.findByText(CONSTANTS.COLOR_WALKER.DESCRIPTION)).toBeInTheDocument();

    // アプリアイコンの alt テキストを確認
    await expect(canvas.getByAltText(`${CONSTANTS.COLOR_WALKER.NAME} アプリアイコン`)).toBeInTheDocument();
  },
};

// モバイル幅 (iPhone SE 相当) でレイアウトが破綻しないことの確認用
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};
