from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from app.core.di.container import Container
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_forecast.pop_data import PopData
from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast
from app.infrastructure.repositories.jma_repository import JmaRepository
from app.infrastructure.repositories.weather_forecast_repository import WeatherForecastRepository
from app.usecases.weather_forecast.regional_forecast_interactor import RegionalForecastInteractor


@pytest.fixture
def repository():
    return WeatherForecastRepository()


@pytest.fixture
def mock_forecasts(repository: WeatherForecastRepository):
    today = datetime.now(ZoneInfo("Asia/Tokyo"))
    forecast_areas = JmaRepository().get_forecast_areas()

    for forecast_area in forecast_areas:
        jma_forecast = JmaForecast(
            report_date_time=today,
            date_time=today.date(),
            area_id=forecast_area.area_id,
            weather_code=100,
            wind="北西",
            wave="小",
            pops=[PopData(date_time=today, pop=10)],
            temp_min=10,
            temp_max=20,
        )

        repository.save(jma_forecast)


@pytest.fixture
def mock_hourly_forecasts(repository: WeatherForecastRepository):
    today = datetime.now(ZoneInfo("Asia/Tokyo"))
    forecast_areas = JmaRepository().get_forecast_areas()

    for forecast_area in forecast_areas:
        for i in range(0, 9):
            jma_hourly_forecast = JmaHourlyForecast(
                report_date_time=today,
                date_time=today.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(hours=i * 3),
                area_id=forecast_area.area_id,
                weather_code=101,
                temp=10,
                temp_min=10,
                temp_max=20,
            )
            repository.save(jma_hourly_forecast)


@pytest.fixture
def usecase(container: Container):
    container.wire(modules=[__name__])
    usecase = RegionalForecastInteractor()
    return usecase


@pytest.mark.asyncio
async def test_execute(
    usecase: RegionalForecastInteractor, repository: WeatherForecastRepository, mock_forecasts, mock_hourly_forecasts
):
    regional_weathers = await usecase.execute()

    assert len(regional_weathers.data) > 0
