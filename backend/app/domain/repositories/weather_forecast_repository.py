from abc import ABC, abstractmethod
from datetime import date

from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto


class IWeatherForecastRepository(ABC):
    @abstractmethod
    def get_forecast(self, area_code: str, date: date, limit: int | None) -> list[WeatherForecastDto]:
        raise NotImplementedError

    @abstractmethod
    def add_forecast(self, forecast: WeatherForecastDto):
        raise NotImplementedError

    @abstractmethod
    def add_forecasts(self, forecasts: list[WeatherForecastDto]):
        raise NotImplementedError
