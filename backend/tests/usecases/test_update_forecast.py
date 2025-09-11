import pytest

from app.core.di.container import Container
from app.usecases.weather_forecast.update_forecast_interactor import UpdateForecastInteractor


@pytest.fixture
def usecase(container: Container):
    container.wire(modules=[__name__])
    usecase = UpdateForecastInteractor()
    return usecase


def test_update_forecast(usecase: UpdateForecastInteractor):
    updated_count = usecase.execute()
    assert updated_count > 0

    forecasts = usecase.weather_forecast_repository.get_forecasts()
    assert len(forecasts) > 0

    hourly_forecasts = usecase.weather_forecast_repository.get_hourly_forecasts()
    assert len(hourly_forecasts) > 0
