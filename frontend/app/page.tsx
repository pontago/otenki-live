import { Metadata } from 'next';
import { Suspense } from 'react';

import { regionalForecasts } from '@/features/weather/api/forecast';
import { RegionalWeatherList, RegionalWeatherListSkeleton } from '@/features/weather/components/regional-weather-list';
import { RegionalWeatherMap, RegionalWeatherMapSkeleton } from '@/features/weather/components/regional-weather-map';

export const metadata: Metadata = {};

export default function IndexPage() {
  return (
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
