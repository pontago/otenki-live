from dependency_injector.wiring import Provide, inject

from app.adapter.api.v1.schemas.base import ResponseStatus
from app.adapter.api.v1.schemas.forecast import WeathersResponse
from app.core.di.container import Container
from app.domain.repositories.jma_repository import IJmaRepository
from app.infrastructure.exceptions import AreaNotFoundError
from app.usecases.services.weather_forecast_service import WeatherForecastService


@inject
class PrefectureForecastInteractor:
    def __init__(
        self,
        weather_forecast_service: WeatherForecastService = Provide[Container.weather_forecast_service],
        jma_repository: IJmaRepository = Provide[Container.jma_repository],
    ):
        self.weather_forecast_service = weather_forecast_service
        self.jma_repository = jma_repository

    async def execute(self, region_code: str) -> WeathersResponse:
        forecast_area = self.jma_repository.get_forecast_area_with_region_code(region_code)
        if not forecast_area:
            raise AreaNotFoundError

        forecasts = await self.weather_forecast_service.get_forecasts(region_code)
        return WeathersResponse(
            status=ResponseStatus.SUCCESS,
            meta={
                "count": len(forecasts),
                "region_code": forecast_area.region_code,
                "region_name": forecast_area.region_name,
            },
            data=forecasts,
        )
