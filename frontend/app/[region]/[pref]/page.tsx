import type * as React from 'react';

import { BreadcrumbNav } from '@/components/breadcrumb-nav';

import { detailedForecast } from '@/features/weather/api/forecast';
import { CurrentWeather } from '@/features/weather/components/current-weather';
import { DailyWeather } from '@/features/weather/components/daily-weather';
import { HourlyWeather } from '@/features/weather/components/hourly-weather';
import { PrefectureCode, RegionCode } from '@/features/weather/types/weather';

// const getBackgroundClasses = (condition?: string): string => {
//   if (!condition) return 'bg-gradient-to-br from-slate-700 to-slate-900 animate-bg-pan-neutral'; // Default
//   const normalizedCondition = condition.toLowerCase();

//   if (normalizedCondition.includes('sunny') || normalizedCondition.includes('clear')) {
//     return 'bg-gradient-to-br from-orange-400 via-red-400 to-yellow-400 animate-bg-pan-sunny';
//   }
//   if (normalizedCondition.includes('cloudy') || normalizedCondition.includes('overcast')) {
//     return 'bg-gradient-to-br from-sky-600 via-slate-500 to-gray-400 animate-bg-pan-cloudy';
//   }
//   if (
//     normalizedCondition.includes('rain') ||
//     normalizedCondition.includes('drizzle') ||
//     normalizedCondition.includes('showers')
//   ) {
//     return 'bg-gradient-to-br from-blue-700 via-indigo-600 to-slate-800 animate-bg-pan-rainy';
//   }
//   if (normalizedCondition.includes('snow') || normalizedCondition.includes('sleet')) {
//     return 'bg-gradient-to-br from-sky-300 via-white to-blue-300 animate-bg-pan-snowy';
//   }
//   if (normalizedCondition.includes('thunderstorm')) {
//     return 'bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 animate-bg-pan-stormy';
//   }
//   if (
//     normalizedCondition.includes('fog') ||
//     normalizedCondition.includes('mist') ||
//     normalizedCondition.includes('haze')
//   ) {
//     return 'bg-gradient-to-br from-slate-400 via-gray-500 to-slate-600 animate-bg-pan-foggy';
//   }
//   return 'bg-gradient-to-br from-slate-700 to-slate-900 animate-bg-pan-neutral';
// };

type DetailedWeatherPageProps = {
  region: string;
  pref: string;
};

export default async function DetailedWeatherPage({ params }: { params: Promise<DetailedWeatherPageProps> }) {
  const { region, pref } = await params;
  const forecast = await detailedForecast(region as RegionCode, pref as PrefectureCode);
  // const backgroundClass = weatherData ? getBackgroundClasses(weatherData.current.condition) : getBackgroundClasses();
  // const pageKey = weatherData ? `${weatherData.current.location}-${weatherData.current.condition}` : 'loading';

  return (
    <div>
      <BreadcrumbNav items={[{ name: region, link: `/${region}` }, { name: pref }]} />
      <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <section aria-labelledby='current-weather-heading' className='lg:col-span-1 space-y-6 animate-fade-in'>
          <h2 id='current-weather-heading' className='sr-only'>
            Current Weather
          </h2>
          {forecast && <CurrentWeather forecast={forecast.current} />}
        </section>

        <section aria-labelledby='forecast-heading' className='lg:col-span-2 space-y-6 animate-fade-in'>
          <h2 id='forecast-heading' className='sr-only'>
            Weather Forecasts
          </h2>
          {forecast && <HourlyWeather data={forecast.hourly} />}
          {forecast && <DailyWeather data={forecast.daily} />}
        </section>
      </div>
    </div>
  );
}
