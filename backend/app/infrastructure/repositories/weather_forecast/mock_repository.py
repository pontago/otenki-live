from datetime import date

from domain.weather_forecast.model import WeatherForecast
from usecases.weather_forecast.repository import IWeatherForecastRepository


class MockWeatherForecastRepository(IWeatherForecastRepository):
    def __init__(self):
        self.forecasts = {
            "13000000": [
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
        }

    def get_forecast(self, area_code: str, date: date) -> list[WeatherForecast]:
        return self.forecasts.get(area_code, [])
