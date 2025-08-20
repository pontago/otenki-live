import type * as React from 'react';
import { Suspense } from 'react';

import { BreadcrumbNav } from '@/components/breadcrumb-nav';

import { detailedForecast } from '@/features/weather/api/forecast';
import { CurrentWeather, CurrentWeatherSkeleton } from '@/features/weather/components/current-weather';
import { DailyWeather, DailyWeatherSkeleton } from '@/features/weather/components/daily-weather';
import { HourlyWeather, HourlyWeatherSkeleton } from '@/features/weather/components/hourly-weather';
import {
  WeatherObjectDetection,
  WeatherObjectDetectionSkeleton,
} from '@/features/weather/components/weather-object-detection';
import { PrefectureCode, RegionCode } from '@/features/weather/types/weather';
import { generateSignature } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<DetailedWeatherPageProps> }) {
  const { region, pref } = await params;
  let title: string;

  try {
    const forecast = await detailedForecast(region as RegionCode, pref as PrefectureCode);
    title = `${forecast.meta.areaName}の天気`;
  } catch {
    title = `${region}の${pref}の天気`;
  }

  const description = `${title}をライブストリームから取得した情報で確認できます`;
  const signature = generateSignature(title);
  return {
    title,
    description,
    openGraph: {
      images: [`/og?title=${title}&hash=${signature}`],
      title,
      description,
    },
  };
}

type DetailedWeatherPageProps = {
  region: string;
  pref: string;
};

export default async function DetailedWeatherPage({ params }: { params: Promise<DetailedWeatherPageProps> }) {
  const { region, pref } = await params;

  return (
    <div>
      <Suspense
        fallback={
          <>
            <BreadcrumbNav items={[]} />
            <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <section aria-labelledby='current-weather-heading' className='lg:col-span-1 space-y-6'>
                <h2 id='current-weather-heading' className='sr-only'>
                  現在の天気
                </h2>
                <CurrentWeatherSkeleton />
              </section>

              <section aria-labelledby='forecast-heading' className='lg:col-span-2 space-y-6'>
                <h2 id='forecast-heading' className='sr-only'>
                  天気予報
                </h2>
                <WeatherObjectDetectionSkeleton />
                <HourlyWeatherSkeleton />
                <DailyWeatherSkeleton />
              </section>
            </div>
          </>
        }
      >
        <DetailedWeatherWrapper region={region} pref={pref} />
      </Suspense>
    </div>
  );
}

const DetailedWeatherWrapper = async ({ region, pref }: { region: string; pref: string }) => {
  const forecast = await detailedForecast(region as RegionCode, pref as PrefectureCode);
  return (
    <>
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
    </>
  );
};
