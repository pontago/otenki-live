import { http, HttpResponse } from 'msw';

import {
  Area,
  AreasResponse,
  LiveChannel,
  LiveChannelsResponse,
  PrefectureCode,
  RegionalWeather,
  RegionalWeatherResponse,
  RegionCode,
  WeatherForecast,
  WeatherResponse,
  WeathersResponse,
} from '@/features/weather/types/weather';

import dailyForecast from './daily-forecast.json';
import areas from './forecast-area.json';
import hourlyForecast from './hourly-forecast.json';
import liveChannels from './live-channel.json';
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
    const data = forecast.map(({ ...attr }) => ({ ...attr }));

    return HttpResponse.json({
      status: 'success',
      data: data as WeatherForecast[],
      meta: {
        count: data.length,
        regionCode: region,
        regionName: data[0].regionName,
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
      const current = forecast.map(({ ...attr }) => ({ ...attr }));

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
          regionName: current[0].regionName,
          areaCode: prefecture,
          areaName: current[0].areaName,
        },
      });
    }
  ),
];

export const liveChannelsHandlers = [
  http.get<never, never, LiveChannelsResponse>('*/live-channel', () => {
    return HttpResponse.json({
      status: 'success',
      data: liveChannels as LiveChannel[],
      meta: {
        count: liveChannels.length,
      },
    });
  }),
];

export const areasHandlers = [
  http.get<never, never, AreasResponse>('*/area', () => {
    return HttpResponse.json({
      status: 'success',
      data: areas as Area[],
      meta: {
        count: areas.length,
      },
    });
  }),
];
