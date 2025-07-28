import { notFound } from 'next/navigation';
import type * as React from 'react';

import { BreadcrumbNav } from '@/components/breadcrumb-nav';

import { detailedForecast } from '@/features/weather/api/forecast';
import { CurrentWeather } from '@/features/weather/components/current-weather';
import { DailyWeather } from '@/features/weather/components/daily-weather';
import { HourlyWeather } from '@/features/weather/components/hourly-weather';
import { WeatherObjectDetection } from '@/features/weather/components/weather-object-detection';
import { PrefectureCode, RegionCode, WeatherResponse } from '@/features/weather/types/weather';
import { NotFoundError } from '@/lib/exceptions';

type DetailedWeatherPageProps = {
  region: string;
  pref: string;
};

export default async function DetailedWeatherPage({ params }: { params: Promise<DetailedWeatherPageProps> }) {
  const { region, pref } = await params;
  let forecast: WeatherResponse;
  try {
    forecast = await detailedForecast(region as RegionCode, pref as PrefectureCode);
  } catch (e) {
    if (e instanceof NotFoundError) {
      notFound();
    }
    throw e;
  }

  return (
    <div>
      <BreadcrumbNav
        items={[{ name: forecast.meta.regionName, link: `/${region}` }, { name: forecast.meta.areaName }]}
      />
      <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <section aria-labelledby='current-weather-heading' className='lg:col-span-1 space-y-6'>
          <h2 id='current-weather-heading' className='sr-only'>
            現在の天気
          </h2>
          <CurrentWeather forecast={forecast.data.current} />
        </section>

        <section aria-labelledby='forecast-heading' className='lg:col-span-2 space-y-6'>
          <h2 id='forecast-heading' className='sr-only'>
            天気予報
          </h2>
          <WeatherObjectDetection data={forecast.data.objectDetection} />
          <HourlyWeather data={forecast.data.hourly} />
          <DailyWeather data={forecast.data.daily} />
        </section>
      </div>
    </div>
  );
}
