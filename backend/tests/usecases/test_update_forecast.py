import pytest

from app.core.di.container import Container
from app.usecases.weather_forecast.update_forecast_interactor import UpdateForecastInteractor

# @pytest.fixture
# def mock_forecast():
#     forecasts = [
#         WeatherForecastDto(
#             pk="13000000",
#             sk="2025-03-10#2025-04-30T12:00:00+09:00",
#             data=ForecastData(
#                 weather_code=101,
#                 wind="北西",
#                 wave="小",
#                 pops=[ForecastPopData(date_time=datetime.now(), pop=10)],
#                 temp_min=10,
#                 temp_max=20,
#             ),
#             created_at=datetime.now(),
#         ),
#         WeatherForecastDto(
#             pk="13000000",
#             sk="2025-03-10#2025-04-30T13:00:00+09:00",
#             data=ForecastData(
#                 weather_code=102,
#                 wind="北西",
#                 wave="小",
#                 pops=[ForecastPopData(date_time=datetime.now(), pop=10)],
#                 temp_min=10,
#                 temp_max=20,
#             ),
#             created_at=datetime.now(),
#         ),
#     ]

#     with WeatherForecastDto.batch_write() as batch:
#         for forecast in forecasts:
#             batch.save(forecast)


@pytest.fixture
def usecase(container: Container):
    container.wire(modules=[__name__])
    usecase = UpdateForecastInteractor()
    return usecase


# def test_get_forecast(mock_forecast, usecase):
#     all_forecasts = usecase.get_forecast("13000000", date(2025, 3, 10))
#     assert len(all_forecasts) == 2

#     forecasts = usecase.get_forecast("13000000", date(2025, 3, 10), 1)
#     assert len(forecasts) == 1


def test_update_forecast(usecase):
    usecase.execute()
    forecasts = usecase.jma_repository.get_weekly_forecast()
    assert len(forecasts) > 0
