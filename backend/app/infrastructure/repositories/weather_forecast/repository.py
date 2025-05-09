from datetime import UTC, date, datetime

from domain.weather_forecast.model import WeatherForecast
from usecases.weather_forecast.repository import IWeatherForecastRepository


class WeatherForecastRepository(IWeatherForecastRepository):
    def __init__(self):
        self.forcasts = []

        if not WeatherForecast.exists():
            WeatherForecast.create_table(wait=True)

    def get_forecast(self, area_code: str, date: date) -> list[WeatherForecast]:
        return list(WeatherForecast.query(area_code))

    def add_forecast(self, area_code, date) -> WeatherForecast:
        sk = f"{date}#2025-04-10T00:00:00+09:00"
        data = {
            "weathers": ["晴", "晴", "晴", "晴", "晴"],
            "winds": ["北西", "北西", "北西", "北西", "北西"],
            "waves": ["小", "小", "小", "小", "小"],
            "pops": ["10", "10", "10", "10", "10"],
            "temps": ["25", "25", "25", "25", "25"],
        }
        forecast = WeatherForecast(pk=area_code, sk=sk, data=data, created_at=datetime.now(UTC))
        forecast.save()
        return forecast
