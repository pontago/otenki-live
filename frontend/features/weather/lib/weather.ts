import { WeatherForecast } from '../types/weather';

export const latestWeatherPop = (weatherForecast: WeatherForecast): number => {
  if (weatherForecast.pops.length === 0) {
    return -1;
  }

  const sortedPops = weatherForecast.pops.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  return sortedPops[0].pop;
};
