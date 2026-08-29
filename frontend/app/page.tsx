import { Metadata } from 'next';
import { Suspense } from 'react';

import { ColorWalkerBanner } from '@/components/color-walker-banner';

import { regionalForecasts } from '@/features/weather/api/forecast';
import { RegionalWeatherList, RegionalWeatherListSkeleton } from '@/features/weather/components/regional-weather-list';
import { RegionalWeatherMap, RegionalWeatherMapSkeleton } from '@/features/weather/components/regional-weather-map';
import { CONSTANTS } from '@/lib/constants';

export const metadata: Metadata = {};

const colorWalkerJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: CONSTANTS.COLOR_WALKER.NAME,
  description:
    'お題のカラーを探して撮影するカラーハンティングアプリです。ひとりでもグループでも、ハンティングカラー抽選と、コラージュ作成からSNS共有・チャットまでサポートします。',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'iOS, Android',
  url: CONSTANTS.COLOR_WALKER.URL,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
};

export default function IndexPage() {
  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(colorWalkerJsonLd) }} />
      <ColorWalkerBanner className='mb-4 md:mb-6' />
      <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-2'>
        <Suspense
          fallback={
            <>
              <section aria-label='regional-weather-map-heading' className='space-y-6'>
                <RegionalWeatherMapSkeleton />
              </section>
              <section aria-label='forecast-heading' className='mt-20 lg:mt-0'>
                <RegionalWeatherListSkeleton />
              </section>
            </>
          }
        >
          <IndexWrapper />
        </Suspense>
      </div>
    </>
  );
}

const IndexWrapper = async () => {
  const forecasts = await regionalForecasts();
  return (
    <>
      <section aria-label='regional-weather-map-heading' className='space-y-6'>
        <RegionalWeatherMap forecasts={forecasts.data} />
      </section>
      <section aria-label='forecast-heading' className='mt-20 lg:mt-0'>
        <RegionalWeatherList forecasts={forecasts.data} />
      </section>
    </>
  );
};
