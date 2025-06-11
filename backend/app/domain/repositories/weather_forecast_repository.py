from abc import ABC, abstractmethod
from datetime import date

from app.domain.entities.jma_forecast.entity import JmaForecast


class IWeatherForecastRepository(ABC):
    @abstractmethod
    def get_forecasts(self, area_code: str, date: date, limit: int | None) -> list[JmaForecast]:
        raise NotImplementedError

    @abstractmethod
    def save(self, data: JmaForecast):
        raise NotImplementedError

    # @abstractmethod
    # def add_forecasts(self, forecasts: list[WeatherForecastDto]):
    #     raise NotImplementedError
