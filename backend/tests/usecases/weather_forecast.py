from datetime import date
from unittest import mock

import pytest
from core.di.container import Container
from domain.weather_forecast.model import WeatherForecast
from usecases.weather_forecast.interactor import WeatherForecastInteractor


@pytest.fixture
def container():
    container = Container()
    container.wire(modules=[__name__])
    return container


@pytest.fixture
def forecast_mock(container):
    forecast_mock = mock.Mock()
    forecast_mock.get_forecast.return_value = [
        WeatherForecast(
            areaCode="13000000",
            dateWithReport="2025-03-10#2025-04-30T12:00:00",
            data={
                "weathers": ["晴", "晴", "晴", "晴", "晴"],
                "winds": ["北西", "北西", "北西", "北西", "北西"],
                "waves": ["小", "小", "小", "小", "小"],
                "pops": ["10", "10", "10", "10", "10"],
                "temps": ["25", "25", "25", "25", "25"],
            },
        )
    ]

    return forecast_mock


def test_mock_get_forecast(container, forecast_mock):
    with container.weather_forecast_repository.override(forecast_mock):
        usecase = WeatherForecastInteractor()
        forecasts = usecase.get_forecast("13000000", date(2025, 3, 10))

    assert len(forecasts) == 1


def test_get_forecast(container):
    usecase = WeatherForecastInteractor()
    forecasts = usecase.get_forecast("13000000", date(2025, 3, 10))

    assert len(forecasts) == 1


def test_add_forecast(container):
    usecase = WeatherForecastInteractor()
    forecast = usecase.add_forecast("13000000", date(2025, 3, 10))

    assert forecast
