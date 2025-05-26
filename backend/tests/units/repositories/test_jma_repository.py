from datetime import UTC, datetime

import pytest

from app.infrastructure.repositories.jma_repository import JmaRepository


@pytest.fixture
def repository():
    return JmaRepository()


def test_get_weekly_forecast(repository):
    forecasts = repository.get_weekly_forecast()

    assert forecasts is not None
    assert len(forecasts) > 0
    assert forecasts[0].date_time.date() == datetime.now(UTC).date()
    # pprint.pprint(forecasts[0])
    # print(forecasts[0].date_time.astimezone(UTC))
    # print(datetime.now(UTC))
