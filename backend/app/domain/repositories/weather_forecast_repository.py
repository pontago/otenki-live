from abc import ABC, abstractmethod
from datetime import date

from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast


class IWeatherForecastRepository(ABC):
    @abstractmethod
    def get_forecasts(
        self, area_id: str | None = None, date: date | None = None, limit: int | None = None
    ) -> list[JmaForecast]:
        raise NotImplementedError

    @abstractmethod
    def get_hourly_forecasts(
        self, area_id: str | None = None, date: date | None = None, limit: int | None = None
    ) -> list[JmaHourlyForecast]:
        raise NotImplementedError

    @abstractmethod
    def get_latest_hourly_forecasts(
        self, area_id: str | None = None, limit: int | None = None
    ) -> list[JmaHourlyForecast]:
        raise NotImplementedError

    @abstractmethod
    def save(self, data: JmaForecast | JmaHourlyForecast):
        raise NotImplementedError

    # @abstractmethod
    # def add_forecasts(self, forecasts: list[WeatherForecastDto]):
    #     raise NotImplementedError
