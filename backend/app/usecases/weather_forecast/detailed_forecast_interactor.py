from dependency_injector.wiring import Provide, inject

from app.adapter.api.v1.schemas.base import ResponseStatus
from app.adapter.api.v1.schemas.forecast import DetailedWeather, WeatherResponse
from app.core.di.container import Container
from app.domain.repositories.jma_repository import IJmaRepository
from app.infrastructure.exceptions import AreaNotFoundError
from app.usecases.services.weather_forecast_service import WeatherForecastService


@inject
class DetailedForecastInteractor:
    def __init__(
        self,
        weather_forecast_service: WeatherForecastService = Provide[Container.weather_forecast_service],
        jma_repository: IJmaRepository = Provide[Container.jma_repository],
    ):
        self.weather_forecast_service = weather_forecast_service
        self.jma_repository = jma_repository

    async def execute(self, area_code: str) -> WeatherResponse:
        forecast_area = self.jma_repository.get_forecast_area_with_area_code(area_code)
        if not forecast_area:
            raise AreaNotFoundError

        (
            current_forecast,
            daily_forecasts,
            hourly_forecasts,
            object_detections,
        ) = await self.weather_forecast_service.get_forecast(area_code)

        return WeatherResponse(
            status=ResponseStatus.SUCCESS,
            meta={
                "region_code": forecast_area.region_code,
                "region_name": forecast_area.region_name,
                "area_code": forecast_area.area_code,
                "area_name": forecast_area.area_name,
            },
            data=DetailedWeather(
                current=current_forecast,
                hourly=hourly_forecasts,
                daily=daily_forecasts,
                object_detection=object_detections,
            ),
        )
