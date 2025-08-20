import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Separator } from '@/components/ui/separator';

import { liveChannels } from '@/features/weather/api/forecast';
import { LiveChannelsResponse } from '@/features/weather/types/weather';
import { NotFoundError } from '@/lib/exceptions';

export const metadata: Metadata = {
  title: 'クレジット',
  description: 'このサイトで使用しているデータのクレジットです',
};

export default async function CreditsPage() {
  let channels: LiveChannelsResponse;
  try {
    channels = await liveChannels();
  } catch (e) {
    if (e instanceof NotFoundError) {
      notFound();
    }
    throw e;
  }

  return (
    <section aria-labelledby='credits-heading' className='mx-5 space-y-2 text-sm'>
      <h1 id='credits-heading' className='text-lg font-medium'>
        クレジット
      </h1>
      <p>このサイトで使用しているデータは、以下のサイトから取得しています。</p>
      <Separator className='my-4' />

      <div className='max-w-2xl'>
        <h2 className='font-semibold mb-2'>気象データ</h2>
        <ul className='space-y-1'>
          <li>
            <a href='https://www.jma.go.jp/jma/' target='_blank' rel='noopener noreferrer' className='hover:underline'>
              気象庁
            </a>
          </li>
          <li>
            <a
              href='https://github.com/ciscorn/jma-weather-images'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline'
            >
              天気画像（ciscorn/jma-weather-images）
            </a>
          </li>
        </ul>

        <h2 className='font-semibold mt-4 mb-2'>動画ストリーミングデータ</h2>
        <ul className='space-y-1'>
          {channels.data.map((channel, index) => (
            <li key={index} className='space-y-1'>
              <a href={channel.url} target='_blank' rel='noopener noreferrer' className='hover:underline'>
                {channel.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
