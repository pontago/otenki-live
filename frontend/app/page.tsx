import { notFound } from 'next/navigation';

import { regionalForecasts } from '@/features/weather/api/forecast';
import { RegionalWeatherList } from '@/features/weather/components/regional-weather-list';
import { RegionalWeatherMap } from '@/features/weather/components/regional-weather-map';
import { RegionalWeatherResponse } from '@/features/weather/types/weather';
import { NotFoundError } from '@/lib/exceptions';
import { Metadata } from 'next';

export const metadata: Metadata = {};

export default async function IndexPage() {
  let forecasts: RegionalWeatherResponse;
  try {
    forecasts = await regionalForecasts();
  } catch (e) {
    if (e instanceof NotFoundError) {
      notFound();
    }
    throw e;
  }

  return (
    <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-2'>
      <section aria-label='regional-weather-map-heading' className='space-y-6'>
        <RegionalWeatherMap forecasts={forecasts.data} />
      </section>
      <section aria-label='forecast-heading' className='mt-20 lg:mt-0'>
        <RegionalWeatherList forecasts={forecasts.data} />
      </section>
    </div>
  );
}
