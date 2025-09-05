import camelcaseKeys from 'camelcase-keys';
import { notFound } from 'next/navigation';

import {
  AreasResponse,
  LiveChannelsResponse,
  PrefectureCode,
  RegionalWeatherResponse,
  RegionCode,
  WeatherResponse,
  WeathersResponse,
} from '@/features/weather/types/weather';
import { apiFetch } from '@/lib/api';
import { env } from '@/lib/env';
import { NotFoundError } from '@/lib/exceptions';

export const regionalForecasts = async (): Promise<RegionalWeatherResponse> => {
  const response = await apiFetch(`${env.NEXT_PUBLIC_API_BASE_URL}/forecast/`);

  if (response.status === 404) {
    throw new NotFoundError();
  }

  if (!response.ok) {
    throw new Error(`Unexpected status: ${response.statusText}`);
  }

  const responseData: RegionalWeatherResponse = await response.json();
  return camelcaseKeys(responseData, { deep: true });
};

export const prefectureForecasts = async (region: RegionCode): Promise<WeathersResponse> => {
  const response = await apiFetch(`${env.NEXT_PUBLIC_API_BASE_URL}/forecast/${region}`);

  if (response.status === 404) {
    notFound();
    // throw new NotFoundError();
  }

  if (!response.ok) {
    throw new Error(`Unexpected status: ${response.statusText}`);
  }

  const responseData: WeathersResponse = await response.json();
  return camelcaseKeys(responseData, { deep: true });
};

export const detailedForecast = async (region: RegionCode, prefecture: PrefectureCode): Promise<WeatherResponse> => {
  const response = await apiFetch(`${env.NEXT_PUBLIC_API_BASE_URL}/forecast/${region}/${prefecture}`);

  if (response.status === 404) {
    notFound();
    // throw new NotFoundError();
  }

  if (!response.ok) {
    throw new Error(`Unexpected status: ${response.statusText}`);
  }

  const responseData: WeatherResponse = await response.json();
  return camelcaseKeys(responseData, { deep: true });
};

export const liveChannels = async (): Promise<LiveChannelsResponse> => {
  const response = await apiFetch(`${env.NEXT_PUBLIC_API_BASE_URL}/live-channel`);

  if (response.status === 404) {
    throw new NotFoundError();
  }

  if (!response.ok) {
    throw new Error(`Unexpected status: ${response.statusText}`);
  }

  const responseData: LiveChannelsResponse = await response.json();
  return camelcaseKeys(responseData, { deep: true });
};

export const areas = async (): Promise<AreasResponse> => {
  const response = await apiFetch(`${env.NEXT_PUBLIC_API_BASE_URL}/area`);

  if (response.status === 404) {
    throw new NotFoundError();
  }

  if (!response.ok) {
    throw new Error(`Unexpected status: ${response.statusText}`);
  }

  const responseData: AreasResponse = await response.json();
  return camelcaseKeys(responseData, { deep: true });
};
