import asyncio

from dependency_injector.wiring import Provide, inject
from loguru import logger

from app.core.di.container import Container
from app.core.utils import parallel
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast
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

    def execute(self) -> int:
        forecast_areas = self.jma_repository.get_forecast_areas()

        forecast_count = 0
        for forecast_area in forecast_areas:
            forecasts = self.jma_repository.get_forecast(forecast_area=forecast_area)

            if forecasts:
                forecast_count += 1
                asyncio.run(self._add_forecast_async(forecasts=forecasts))
            else:
                logger.warning(f"JMA forecast is empty. [{forecast_area.area_code}]")

            hourly_forecasts = self.jma_repository.get_hourly_forecast(forecast_area=forecast_area)

            if hourly_forecasts:
                asyncio.run(self._add_forecast_async(forecasts=hourly_forecasts))
            else:
                logger.warning(f"JMA hourly forecast is empty. [{forecast_area.area_code}]")

        # forecasts = self.jma_repository.get_weekly_forecast()

        # if not forecasts:
        #     logger.warning("JMA forecast is empty.")
        #     return -1

        # await asyncio.gather(
        #     *(
        #         asyncio.to_thread(self.weather_forecast_repository.add_forecast, dtoForecast)
        #         for dtoForecast in dtoForecasts
        #     )
        # )

        # self.weather_forecast_repository.add_forecasts(dtoForecasts)

        return forecast_count

    async def _add_forecast_async(self, forecasts: list[JmaForecast] | list[JmaHourlyForecast]):
        await parallel(
            [asyncio.to_thread(self.weather_forecast_repository.save, forecast) for forecast in forecasts],
            concurrency=3,
        )
