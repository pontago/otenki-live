import {
  DetailedWeather,
  PrefectureCode,
  RegionalWeather,
  RegionalWeatherResponse,
  RegionCode,
  WeatherForecast,
  WeatherResponse,
  WeathersResponse,
} from '@/features/weather/types/weather';
import { env } from '@/lib/env';
import logger from '@/lib/logger';

export const regionalForecasts = async (): Promise<RegionalWeather[]> => {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/forecast`, {
      cache: 'no-store',
    });
    const responseData: RegionalWeatherResponse = await response.json();
    return responseData.data;
  } catch (error) {
    logger.error(error);
  }
  return [];
};

export const prefectureForecasts = async (region: RegionCode): Promise<WeatherForecast[]> => {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/forecast/${region}`, {
      cache: 'no-store',
    });
    const responseData: WeathersResponse = await response.json();
    return responseData.data;
  } catch (error) {
    logger.error(error);
  }
  return [];
};

export const detailedForecast = async (
  region: RegionCode,
  prefecture: PrefectureCode
): Promise<DetailedWeather | undefined> => {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/forecast/${region}/${prefecture}`, {
      cache: 'no-store',
    });
    const responseData: WeatherResponse = await response.json();
    return responseData.data;
  } catch (error) {
    logger.error(error);
  }
};
