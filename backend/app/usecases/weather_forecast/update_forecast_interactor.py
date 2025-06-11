import asyncio

from dependency_injector.wiring import Provide, inject
from loguru import logger

from app.core.di.container import Container
from app.core.utils import parallel
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.repositories.jma_repository import IJmaRepository
from app.domain.repositories.weather_forecast_repository import IWeatherForecastRepository


@inject
class UpdateForecastInteractor:
    def __init__(
        self,
        weather_forecast_repository: IWeatherForecastRepository = Provide[Container.weather_forecast_repository],
        jma_repository: IJmaRepository = Provide[Container.jma_repository],
    ):
        self.weather_forecast_repository = weather_forecast_repository
        self.jma_repository = jma_repository

    # def get_forecast(self, area_code: str, date: date, limit: int | None = None) -> list[WeatherForecastDto]:
    #     return self.weather_forecast_repository.get_forecast(area_code=area_code, date=date, limit=limit)

    def execute(self) -> int:
        forecasts = self.jma_repository.get_weekly_forecast()

        if not forecasts:
            logger.warning("JMA forecast is empty.")
            return -1

            # await asyncio.gather(
            #     *(
            #         asyncio.to_thread(self.weather_forecast_repository.add_forecast, dtoForecast)
            #         for dtoForecast in dtoForecasts
            #     )
            # )

        # self.weather_forecast_repository.add_forecasts(dtoForecasts)
        asyncio.run(self._add_forecast_async(forecasts=forecasts))

        return len(forecasts)

    async def _add_forecast_async(self, forecasts: list[JmaForecast]):
        await parallel(
            [asyncio.to_thread(self.weather_forecast_repository.save, forecast) for forecast in forecasts],
            concurrency=3,
        )
