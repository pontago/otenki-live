from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient

from app.adapter.api.main import app
from app.adapter.api.v1.schemas.base import ResponseStatus
from app.core.settings import AppSettings
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_forecast.pop_data import PopData
from app.infrastructure.repositories.jma_repository import JmaRepository
from app.infrastructure.repositories.weather_forecast_repository import WeatherForecastRepository


@pytest.fixture
def repository():
    return WeatherForecastRepository()


@pytest.fixture
def mock_forecasts(repository):
    today = datetime.now(UTC)
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
def client():
    return TestClient(app)


def test_get_regional_weathers(client, mock_forecasts):
    response = client.get(f"{AppSettings.api_v1_prefix}/forecast")
    assert response.status_code == 200

    json = response.json()
    assert json.get("status") == ResponseStatus.SUCCESS.value
    assert len(json.get("data")) > 0
