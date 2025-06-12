export interface CurrentWeatherData {
  location: string;
  temperature: number; // Celsius
  feelsLike: number; // Celsius
  humidity: number; // %
  windSpeed: number; // km/h
  cloudCover: number; // %
  condition: string; // e.g., "Sunny", "Cloudy", "Rainy"
  description: string; // e.g., "Clear skies with gentle breeze"
  icon: string; // identifier for weather icon map
  pressure: number; // hPa
  visibility: number; // km
  uvIndex: number;
  peopleCount?: number;
  umbrellaCount?: number;
  shortSleeveCount?: number;
  longSleeveCount?: number;
}

export interface DailyForecastItem {
  date: string; // e.g., "2024-10-28"
  dayName: string; // e.g. "Monday"
  highTemp: number; // Celsius
  lowTemp: number; // Celsius
  condition: string; // e.g., "Sunny", "Cloudy"
  icon: string;
  precipitationChance: number; // %
}

export interface HourlyForecastItem {
  time: string; // e.g., "15:00"
  temperature: number; // Celsius
  condition: string; // e.g., "Sunny", "Cloudy"
  icon: string;
  precipitationChance: number; // %
}

export interface WeatherData {
  current: CurrentWeatherData;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  forecastSummary: string; // For AI
}
