from abc import ABC, abstractmethod

from app.domain.jma_forecast.model import JmaForecast


class IJmaRepository(ABC):
    @abstractmethod
    def get_weekly_forecast(self) -> list[JmaForecast]:
        raise NotImplementedError
