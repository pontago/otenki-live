from datetime import date

from usecases.weather_forecast.repository import IWeatherForecastRepository


class WeatherForecastInteractor:
    def __init__(self, repository: IWeatherForecastRepository):
        self.repository = repository

    def get_forcast(self, areaCode: str, date: date):
        return self.repository.get_forecast(areaCode, date)
