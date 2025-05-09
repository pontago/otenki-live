from abc import ABC, abstractmethod
from datetime import date

from domain.weather_forecast.model import WeatherForecast


class IWeatherForecastRepository(ABC):
    @abstractmethod
    def get_forecast(self, area_code: str, date: date) -> list[WeatherForecast]:
        raise NotImplementedError

    @abstractmethod
    def add_forecast(self, area_code: str, date: date) -> WeatherForecast:
        raise NotImplementedError
