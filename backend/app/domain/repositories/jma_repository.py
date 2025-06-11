from abc import ABC, abstractmethod

from app.domain.entities.jma_forecast.entity import JmaForecast


class IJmaRepository(ABC):
    @abstractmethod
    def get_weekly_forecast(self) -> list[JmaForecast]:
        raise NotImplementedError
