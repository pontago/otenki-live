from datetime import UTC, datetime

import pytest

from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_forecast.pop_data import PopData
from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast
from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto
from app.infrastructure.dto.dynamodb.weather_hourly_forecast.model import WeatherHourlyForecastDto
from app.infrastructure.repositories.weather_forecast_repository import WeatherForecastRepository


@pytest.fixture
def mock_forecasts():
    forecasts = [
        JmaForecast(
            report_date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC),
            date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC).date(),
            area_id="13000000",
            weather_code=101,
            wind="北西",
            wave="小",
            pops=[PopData(date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC), pop=10)],
            temp_min=10,
            temp_max=20,
        ),
        JmaForecast(
            report_date_time=datetime(2025, 3, 10, 13, 0, tzinfo=UTC),
            date_time=datetime(2025, 3, 11, 12, 0, tzinfo=UTC).date(),
            area_id="13000000",
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
def mock_hourly_forecasts():
    forecasts = [
        JmaHourlyForecast(
            report_date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC),
            date_time=datetime(2025, 3, 10, 12, 0, tzinfo=UTC),
            area_id="13000000",
            weather_code=101,
            temp=10,
            temp_min=10,
            temp_max=20,
        ),
        JmaHourlyForecast(
            report_date_time=datetime(2025, 3, 10, 13, 0, tzinfo=UTC),
            date_time=datetime(2025, 3, 10, 13, 0, tzinfo=UTC),
            area_id="13000000",
            weather_code=102,
            temp=10,
            temp_min=10,
            temp_max=20,
        ),
    ]
    return forecasts


@pytest.fixture
def repository():
    return WeatherForecastRepository()


def test_save(repository, mock_forecasts, mock_hourly_forecasts):
    for forecast in mock_forecasts:
        repository.save(forecast)

    for forecast in mock_hourly_forecasts:
        repository.save(forecast)

    forecasts = list(WeatherForecastDto.scan())
    hourly_forecasts = list(WeatherHourlyForecastDto.scan())

    assert forecasts
    assert len(forecasts) == 2

    assert hourly_forecasts
    assert len(hourly_forecasts) == 2


def test_get_hourly_forecasts(repository, mock_hourly_forecasts):
    for forecast in mock_hourly_forecasts:
        repository.save(forecast)

    hourly_forecasts = repository.get_hourly_forecasts("13000000", datetime(2025, 3, 10).date())
    assert len(hourly_forecasts) == 2


def test_get_latest_hourly_forecasts(repository, mock_hourly_forecasts):
    for forecast in mock_hourly_forecasts:
        repository.save(forecast)

    hourly_forecasts = repository.get_latest_hourly_forecasts("13000000")
    assert len(hourly_forecasts) == 2


def test_get_forecasts(repository, mock_forecasts):
    for forecast in mock_forecasts:
        repository.save(forecast)

    forecasts = repository.get_forecasts("13000000", datetime(2025, 3, 10).date())
    assert len(forecasts) == 1

    forecasts = repository.get_forecasts()
    assert len(forecasts) == 2
