import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, waitFor } from '@storybook/test';

import { ContactForm } from '@/features/contact/components/contact-form';
import { handlers } from '@/mocks/handlers';
import { expect, within } from '@storybook/test';

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole('form');
    expect(form).toBeInTheDocument();

    expect(canvas.getByLabelText('お名前')).toBeInTheDocument();
    expect(canvas.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(canvas.getByLabelText('お問い合わせ内容')).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: '送信する' })).toBeInTheDocument();
  },
};

export const FormInput: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // フォーム要素を取得
    const nameInput = canvas.getByLabelText('お名前');
    const emailInput = canvas.getByLabelText('メールアドレス');
    const messageInput = canvas.getByLabelText('お問い合わせ内容');

    // フォームに入力
    await user.type(nameInput, '田中太郎');
    await user.type(emailInput, 'tanaka@example.com');
    await user.type(messageInput, 'このサイトについて質問があります。');

    // 入力値が正しく反映されていることを確認
    expect(nameInput).toHaveValue('田中太郎');
    expect(emailInput).toHaveValue('tanaka@example.com');
    expect(messageInput).toHaveValue('このサイトについて質問があります。');
  },
};

export const FormValidation: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // 空のフォームで送信を試行
    const submitButton = canvas.getByRole('button', { name: '送信する' });
    await user.click(submitButton);

    // バリデーションエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(canvas.getAllByText('入力されていません。')).toHaveLength(2);
    });

    // 無効なメールアドレスでテスト
    const emailInput = canvas.getByLabelText('メールアドレス');
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    // メールアドレスのバリデーションエラーが表示されることを確認
    await waitFor(() => {
      expect(canvas.getByText('メールアドレスの形式が正しくありません。')).toBeInTheDocument();
    });
  },
};

export const FormSubmission: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // 有効なデータでフォームに入力
    const nameInput = canvas.getByLabelText('お名前');
    const emailInput = canvas.getByLabelText('メールアドレス');
    const messageInput = canvas.getByLabelText('お問い合わせ内容');

    await user.type(nameInput, '田中太郎');
    await user.type(emailInput, 'tanaka@example.com');
    await user.type(messageInput, 'このサイトについて質問があります。');

    // 送信ボタンをクリック
    const submitButton = canvas.getByRole('button', { name: '送信する' });
    await user.click(submitButton);

    // 送信中はボタンが無効化されることを確認
    expect(canvas.getByRole('button', { name: '送信中...' })).toBeInTheDocument();

    // 送信完了後、成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(canvas.getByText('お問い合わせを受け付けました')).toBeInTheDocument();
    });
  },
};

export const FormSubmissionWithLongText: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // 長いテキストでテスト
    const nameInput = canvas.getByLabelText('お名前');
    const emailInput = canvas.getByLabelText('メールアドレス');
    const messageInput = canvas.getByLabelText('お問い合わせ内容');

    // 名前の最大文字数テスト
    const longName = 'a'.repeat(101);
    await user.type(nameInput, longName);
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'テストメッセージ');

    const submitButton = canvas.getByRole('button', { name: '送信する' });
    await user.click(submitButton);

    // 名前の文字数制限エラーが表示されることを確認
    await waitFor(() => {
      expect(canvas.getByText('100文字以内で入力してください。')).toBeInTheDocument();
    });
  },
};
