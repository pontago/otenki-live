from abc import ABC, abstractmethod

from app.domain.entities.forecast_area.entity import ForecastArea
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast


class IJmaRepository(ABC):
    @abstractmethod
    def seed_loader(self):
        raise NotImplementedError

    @abstractmethod
    def get_forecast_areas(self) -> list[ForecastArea]:
        raise NotImplementedError

    @abstractmethod
    def get_forecast_regions(self) -> list[ForecastArea]:
        raise NotImplementedError

    @abstractmethod
    def get_area_with_week_id(self, week_id: str) -> ForecastArea:
        raise NotImplementedError

    @abstractmethod
    def get_forecast_areas_with_region_code(self, region_code: str) -> list[ForecastArea]:
        raise NotImplementedError

    @abstractmethod
    def get_forecast_area_with_region_code(self, region_code: str) -> ForecastArea:
        raise NotImplementedError

    @abstractmethod
    def get_forecast_area_with_area_code(self, area_code: str) -> ForecastArea:
        raise NotImplementedError

    @abstractmethod
    def get_weather_name(self, weather_code: int) -> str:
        raise NotImplementedError

    @abstractmethod
    def get_weekly_forecast(self) -> list[JmaForecast]:
        raise NotImplementedError

    @abstractmethod
    def get_hourly_forecast(self, forecast_area: ForecastArea) -> list[JmaHourlyForecast]:
        raise NotImplementedError

    @abstractmethod
    def get_forecast(self, forecast_area: ForecastArea) -> list[JmaForecast]:
        raise NotImplementedError
