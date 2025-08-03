import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description: 'このサイトについてのページです',
};

export default function AboutPage() {
  return (
    <section aria-labelledby='about-heading' className='mx-5 space-y-2 text-sm'>
      <h1 id='about-heading' className='text-lg font-medium'>
        このサイトについて
      </h1>
      <Separator className='my-4' />
      <p>このサイトは、日本の気象庁が提供する気象情報をもとに、地域ごとの天気予報を提供するサイトです。</p>
      <p>
        ライブストリームから取得した動画を解析し、実際の町並みから歩行者、傘をさしている人、服装を推定した情報を確認できます。
      </p>
      <p></p>
    </section>
  );
}
