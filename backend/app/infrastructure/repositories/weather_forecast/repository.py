from datetime import date

from domain.weather_forecast.model import WeatherForecast
from usecases.weather_forecast.repository import IWeatherForecastRepository


class WeatherForecastRepository(IWeatherForecastRepository):
    def __init__(self):
        self.forcasts = {}

    def get_forecast(self, areaCode: str, date: date) -> list[WeatherForecast]:
        return []
