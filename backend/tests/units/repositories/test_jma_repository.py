from datetime import UTC, datetime

import pytest

from app.infrastructure.repositories.jma_repository import JmaRepository


@pytest.fixture
def repository():
    return JmaRepository()


def test_seed_loader(repository: JmaRepository):
    assert repository.forecast_areas is not None
    assert len(repository.forecast_areas) > 0


def test_get_area_with_week_id(repository: JmaRepository):
    area = repository.get_area_with_week_id(week_id="016000")
    assert area is not None
    assert area.area_id == "016010"
    assert area.area_code == "sapporo"
    assert area.area_name == "札幌"
    assert area.week_id == "016000"


def test_get_weekly_forecast(repository: JmaRepository):
    forecasts = repository.get_weekly_forecast()

    assert forecasts is not None
    assert len(forecasts) > 0
    assert forecasts[0].date_time == datetime.now(UTC).date()


def test_get_hourly_forecast(repository: JmaRepository):
    area = repository.get_area_with_week_id(week_id="016000")
    forecasts = repository.get_hourly_forecast(area)

    assert forecasts is not None
    assert len(forecasts) > 0


def test_get_forecast(repository: JmaRepository):
    area = repository.get_area_with_week_id(week_id="016000")
    forecasts = repository.get_forecast(area)

    assert forecasts is not None
    assert len(forecasts) > 0
