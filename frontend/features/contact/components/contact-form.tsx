'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { contactFormSchema } from '@/features/contact/schemas/contact';
import { ContactFormData } from '@/features/contact/types/contact';
import { ValidationErrors } from '@/lib/exceptions';
import { sendContact } from '@/features/contact/api/contact';
import logger from '@/lib/logger';

export const ContactForm = () => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await sendContact(data);
    } catch (e) {
      if (e instanceof ValidationErrors) {
        e.errors.forEach((error) => {
          form.setError(error.field as keyof ContactFormData, { message: error.message });
        });
      } else if (e instanceof Error) {
        form.setError('root.serverError', { message: e.message });
      }
    }
  };

  return (
    <>
      {form.formState.isSubmitSuccessful && (
        <div className='w-full'>
          <p className='text-lg'>お問い合わせを受け付けました</p>
          <p className='mt-4 text-sm'>確認のため自動返信メールをお送りしております。</p>
          <p className='text-sm'>内容を確認の上、ご連絡いたしますのでしばらくお待ちください。</p>
        </div>
      )}
      {!form.formState.isSubmitSuccessful && (
        <>
          <p className='mb-6'>このサイトについてのお問い合わせは、以下のフォームからお願いします。</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>お名前</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input type='email' {...field} />
                      {/* <input
                      {...field}
                      type='email'
                      className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                      placeholder=''
                    /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>お問い合わせ内容</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        // className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        placeholder='お問い合わせ内容を入力してください'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? '送信中...' : '送信する'}
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
};
