from datetime import date

from core.di.container import Container
from dependency_injector.wiring import Provide, inject
from usecases.weather_forecast.repository import IWeatherForecastRepository


@inject
class WeatherForecastInteractor:
    def __init__(self, repository: IWeatherForecastRepository = Provide[Container.weather_forecast_repository]):
        self.repository = repository

    def get_forecast(self, area_code: str, date: date):
        return self.repository.get_forecast(area_code, date)

    def add_forecast(self, area_code: str, date: date):
        return self.repository.add_forecast(area_code, date)
