from abc import ABC, abstractmethod

from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast


class IJmaRepository(ABC):
    @abstractmethod
    def get_weekly_forecast(self) -> list[JmaForecast]:
        raise NotImplementedError

    @abstractmethod
    def get_hourly_forecast(self) -> list[JmaHourlyForecast]:
        raise NotImplementedError
