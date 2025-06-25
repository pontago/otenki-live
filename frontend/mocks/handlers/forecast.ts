import { http, HttpResponse } from 'msw';

import {
  PrefectureCode,
  RegionalWeather,
  RegionalWeatherResponse,
  RegionCode,
  WeatherForecast,
  WeatherResponse,
  WeathersResponse,
} from '@/features/weather/types/weather';

import dailyForecast from './daily-forecast.json';
import hourlyForecast from './hourly-forecast.json';
import prefectureForecast from './prefecture-forecast.json';
import regionalForecast from './regional-forecast.json';

export const regionalForecastHandlers = [
  http.get<never, never, RegionalWeatherResponse>('*/forecast', () => {
    return HttpResponse.json({
      data: regionalForecast as RegionalWeather[],
    });
  }),
];

export const prefectureForecastHandlers = [
  http.get<{ region: RegionCode }, never, WeathersResponse>('*/forecast/:region', ({ params }) => {
    const { region } = params;
    const forecast = prefectureForecast.filter((item) => item.regionCode === region);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = forecast.map(({ regionCode, ...attr }) => ({ ...attr }));

    return HttpResponse.json({
      data: data as WeatherForecast[],
    });
  }),
];

export const detailedForecastHandlers = [
  http.get<{ region: RegionCode; prefecture: PrefectureCode }, never, WeatherResponse>(
    '*/forecast/:region/:prefecture',
    ({ params }) => {
      const { prefecture } = params;
      const forecast = prefectureForecast.filter((item) => item.areaCode === prefecture);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const current = forecast.map(({ regionCode, ...attr }) => ({ ...attr }));

      return HttpResponse.json({
        data: {
          current: current[0] as WeatherForecast,
          hourly: hourlyForecast,
          daily: dailyForecast as WeatherForecast[],
        },
      });
    }
  ),
];
