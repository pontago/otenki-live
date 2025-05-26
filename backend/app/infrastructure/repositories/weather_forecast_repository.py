from datetime import date

from app.domain.repositories.weather_forecast_repository import IWeatherForecastRepository
from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto


class WeatherForecastRepository(IWeatherForecastRepository):
    def __init__(self):
        self.forcasts = []

        if not WeatherForecastDto.exists():
            WeatherForecastDto.create_table(wait=True)

    def get_forecast(self, area_code: str, date: date, limit: int | None) -> list[WeatherForecastDto]:
        return list(WeatherForecastDto.query(area_code, scan_index_forward=False, limit=limit))

    def add_forecast(self, forecast: WeatherForecastDto):
        forecast.save()

    def add_forecasts(self, forecasts: list[WeatherForecastDto]):
        """
        PynamoDBでoverwrite_by_pkeysが使えないため、キーの重複エラーが出てしまう。
        とりあえず非同期I/Oで個別に保存する。
        """
        # with WeatherForecastDto.batch_write() as batch:
        #     for forecast in forecasts:
        #         batch.save(forecast)
        for forecast in forecasts:
            forecast.save()
