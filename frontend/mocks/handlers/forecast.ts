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
import objectDetectionData from './object-detection-data.json';
import prefectureForecast from './prefecture-forecast.json';
import regionalForecast from './regional-forecast.json';

export const regionalForecastHandlers = [
  http.get<never, never, RegionalWeatherResponse>('*/forecast', () => {
    return HttpResponse.json({
      status: 'success',
      data: regionalForecast as RegionalWeather[],
      meta: {
        count: regionalForecast.length,
      },
    });
  }),
];

export const prefectureForecastHandlers = [
  http.get<{ region: RegionCode }, never, WeathersResponse>('*/forecast/:region', ({ params }) => {
    const { region } = params;
    const forecast = prefectureForecast.filter((item) => item.regionCode === region);
    const data = forecast.map(({ regionCode, ...attr }) => ({ ...attr }));

    return HttpResponse.json({
      status: 'success',
      data: data as WeatherForecast[],
      meta: {
        count: data.length,
        regionCode: region,
        regionName: region,
      },
    });
  }),
];

export const detailedForecastHandlers = [
  http.get<{ region: RegionCode; prefecture: PrefectureCode }, never, WeatherResponse>(
    '*/forecast/:region/:prefecture',
    ({ params }) => {
      const { region, prefecture } = params;
      const forecast = prefectureForecast.filter((item) => item.areaCode === prefecture);
      const current = forecast.map(({ regionCode, ...attr }) => ({ ...attr }));

      return HttpResponse.json({
        status: 'success',
        data: {
          current: current[0] as WeatherForecast,
          hourly: hourlyForecast,
          objectDetection: objectDetectionData,
          daily: dailyForecast as WeatherForecast[],
        },
        meta: {
          regionCode: region,
          regionName: region,
          areaCode: prefecture,
          areaName: prefecture,
        },
      });
    }
  ),
];
