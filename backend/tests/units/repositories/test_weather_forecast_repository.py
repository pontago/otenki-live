from datetime import UTC, datetime

import pytest

from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_forecast.pop_data import PopData
from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto
from app.infrastructure.repositories.weather_forecast_repository import WeatherForecastRepository


@pytest.fixture
def mock_forecasts():
    forecasts = [
        JmaForecast(
            report_date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC),
            date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC).date(),
            area_code="13000000",
            area_name="東京都",
            weather_code=101,
            wind="北西",
            wave="小",
            pops=[PopData(date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC), pop=10)],
            temp_min=10,
            temp_max=20,
        ),
        JmaForecast(
            report_date_time=datetime(2025, 3, 10, 13, 0, tzinfo=UTC),
            date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC).date(),
            area_code="13000000",
            area_name="東京都",
            weather_code=102,
            wind="北西",
            wave="小",
            pops=[PopData(date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC), pop=10)],
            temp_min=10,
            temp_max=20,
        ),
    ]
    return forecasts


@pytest.fixture
def repository():
    return WeatherForecastRepository()


def test_save(repository, mock_forecasts):
    for forecast in mock_forecasts:
        repository.save(forecast)

    forecasts = list(WeatherForecastDto.scan())

    assert forecasts
    assert len(forecasts) == 2


def test_get_forecasts(repository, mock_forecasts):
    for forecast in mock_forecasts:
        repository.save(forecast)

    forecasts = repository.get_forecasts("13000000", datetime(2025, 3, 10).date(), limit=1)

    assert len(forecasts) > 0
