import asyncio
from datetime import UTC, datetime, timedelta

from dependency_injector.wiring import Provide, inject
from loguru import logger

from app.core.di.container import Container
from app.core.settings import AppSettings
from app.core.utils import parallel
from app.domain.repositories.jma_repository import IJmaRepository
from app.domain.repositories.weather_forecast_repository import IWeatherForecastRepository
from app.infrastructure.dto.dynamodb.weather_forecast.forecast_data import ForecastData, ForecastPopData
from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto


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

        dtoForecasts = [
            WeatherForecastDto(
                pk=forecast.area_code,
                sk=f"{forecast.date_time}#{forecast.report_date_time}",
                data=ForecastData(
                    weather_code=forecast.weather_code,
                    wind=forecast.wind,
                    wave=forecast.wave,
                    pops=[ForecastPopData(date_time=d.date_time.astimezone(UTC), pop=d.pop) for d in forecast.pops],
                    temp_min=forecast.temp_min,
                    temp_max=forecast.temp_max,
                ),
                created_at=datetime.now(UTC),
                expire_at=datetime.now(UTC) + timedelta(days=AppSettings.weather_forecast_ttl_days),
            )
            for forecast in forecasts
        ]

        # self.weather_forecast_repository.add_forecasts(dtoForecasts)
        asyncio.run(self._add_forecast_async(dtoForecasts=dtoForecasts))

        return len(dtoForecasts)

    async def _add_forecast_async(self, dtoForecasts: list[WeatherForecastDto]):
        await parallel(
            [
                asyncio.to_thread(self.weather_forecast_repository.add_forecast, dtoForecast)
                for dtoForecast in dtoForecasts
            ],
            concurrency=3,
        )
