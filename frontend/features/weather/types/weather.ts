export type WeatherForecast = {
  dateTime: string;
  areaId: string;
  areaName: string;
  areaCode: PrefectureCode;
  weatherCode: number;
  wind?: string;
  wave?: string;
  pops: PopData[];
  tempMin?: number;
  tempMax?: number;
  liveDetectData: LiveDetectData;
};

export type PopData = {
  dateTime: string;
  pop: number;
};

export type LiveDetectData = {
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
  temp: number;
};

export type DetailedWeather = {
  current: WeatherForecast;
  hourly: HourlyWeatherData[];
  daily: WeatherForecast[];
};

export type RegionalWeatherResponse = {
  data: RegionalWeather[];
};

export type WeathersResponse = {
  data: WeatherForecast[];
};

export type WeatherResponse = {
  data: DetailedWeather;
};

export type RegionCode =
  | 'hokkaido'
  | 'tohoku'
  | 'kanto'
  | 'chubu'
  | 'kansai'
  | 'chugoku'
  | 'shikoku'
  | 'kyushu'
  | 'okinawa';

export type PrefectureCode =
  | 'hokkaido'
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
