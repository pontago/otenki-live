import { BaseResponse } from '@/types/api';

export type WeatherForecast = {
  date: string;
  areaId: string;
  areaName: string;
  areaCode: PrefectureCode;
  weatherCode: number;
  weatherName: string;
  wind?: string;
  wave?: string;
  pops: PopData[];
  tempMin?: number;
  tempMax?: number;
  liveChannel?: LiveChannel;
  liveDetectData?: LiveDetectData;
};

export type LiveChannel = {
  name: string;
  url: string;
};

export type PopData = {
  dateTime: string;
  pop: number;
};

export type LiveDetectData = {
  dateTime: string;
  person: number;
  umbrella: number;
  tshirt: number;
  longSleeve: number;
};

export type RegionalWeather = {
  regionCode: RegionCode;
  regionName: string;
  weatherForecast: WeatherForecast;
};

export type HourlyWeatherData = {
  dateTime: string;
  weatherCode: number;
  weatherName: string;
  temp: number;
};

export type DetailedWeather = {
  current: WeatherForecast;
  hourly: HourlyWeatherData[];
  objectDetection: LiveDetectData[];
  daily: WeatherForecast[];
};

export type Area = {
  areaCode: PrefectureCode;
  areaName: string;
  regionCode: RegionCode;
  regionName: string;
};

export type RegionalWeatherResponse = BaseResponse & {
  data: RegionalWeather[];
  meta: {
    count: number;
  };
};

export type WeathersResponse = BaseResponse & {
  data: WeatherForecast[];
  meta: {
    count: number;
    regionCode: RegionCode;
    regionName: string;
  };
};

export type WeatherResponse = BaseResponse & {
  data: DetailedWeather;
  meta: {
    regionCode: RegionCode;
    regionName: string;
    areaCode: PrefectureCode;
    areaName: string;
  };
};

export type LiveChannelsResponse = BaseResponse & {
  data: LiveChannel[];
  meta: {
    count: number;
  };
};

export type AreasResponse = BaseResponse & {
  data: Area[];
  meta: {
    count: number;
  };
};

export type RegionCode =
  | 'hokkaido'
  | 'tohoku'
  | 'kanto'
  | 'hokuriku'
  | 'tokai'
  | 'kinki'
  | 'chugoku'
  | 'shikoku'
  | 'kyushu'
  | 'okinawa';

export type PrefectureCode =
  | 'sapporo'
  | 'aomori'
  | 'iwate'
  | 'miyagi'
  | 'akita'
  | 'yamagata'
  | 'fukushima'
  | 'ibaraki'
  | 'tochigi'
  | 'gunma'
  | 'saitama'
  | 'chiba'
  | 'tokyo'
  | 'kanagawa'
  | 'niigata'
  | 'toyama'
  | 'ishikawa'
  | 'fukui'
  | 'yamanashi'
  | 'nagano'
  | 'gifu'
  | 'shizuoka'
  | 'aichi'
  | 'mie'
  | 'shiga'
  | 'kyoto'
  | 'osaka'
  | 'hyogo'
  | 'nara'
  | 'wakayama'
  | 'tottori'
  | 'shimane'
  | 'okayama'
  | 'hiroshima'
  | 'yamaguchi'
  | 'tokushima'
  | 'kagawa'
  | 'ehime'
  | 'kochi'
  | 'fukuoka'
  | 'saga'
  | 'nagasaki'
  | 'kumamoto'
  | 'oita'
  | 'miyazaki'
  | 'kagoshima'
  | 'okinawa';
