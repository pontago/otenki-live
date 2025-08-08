import { Separator } from '@/components/ui/separator';
import { env } from '@/lib/env';
import { ContactForm } from '@/features/contact/components/contact-form';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'お問い合わせのページです',
};

export default function ContactPage() {
  return (
    <section aria-labelledby='contact-heading' className='mx-5 space-y-2 text-sm'>
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy='afterInteractive'
      />
      <h1 id='contact-heading' className='text-lg font-medium'>
        お問い合わせ
      </h1>
      <Separator className='my-4' />

      <div className='max-w-2xl'>
        <ContactForm />
      </div>
    </section>
  );
}
