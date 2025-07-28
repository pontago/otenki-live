from dependency_injector.wiring import Provide, inject

from app.adapter.api.v1.schemas.base import ResponseStatus
from app.adapter.api.v1.schemas.forecast import RegionalWeatherResponse
from app.core.di.container import Container
from app.usecases.services.weather_forecast_service import WeatherForecastService


@inject
class RegionalForecastInteractor:
    def __init__(
        self,
        weather_forecast_service: WeatherForecastService = Provide[Container.weather_forecast_service],
    ):
        self.weather_forecast_service = weather_forecast_service

    async def execute(self) -> RegionalWeatherResponse:
        forecasts = await self.weather_forecast_service.get_regional_forecasts()
        return RegionalWeatherResponse(
            status=ResponseStatus.SUCCESS,
            meta={"count": len(forecasts)},
            data=forecasts,
        )
