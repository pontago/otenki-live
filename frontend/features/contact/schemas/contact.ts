import z from 'zod';

const requiredError = '入力されていません。';

export const contactFormSchema = z.object({
  name: z.string({ error: requiredError }).trim().min(1, requiredError).max(100, '100文字以内で入力してください。'),
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  email: z.string({ error: requiredError }).trim().email('メールアドレスの形式が正しくありません。'),
  message: z
    .string({ error: requiredError })
    .trim()
    .min(1, requiredError)
    .max(10000, '10000文字以内で入力してください。'),
});
