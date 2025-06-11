from datetime import UTC, date, datetime, timedelta

from app.core.settings import AppSettings
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.repositories.weather_forecast_repository import IWeatherForecastRepository
from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto
from app.infrastructure.mappers.weather_forecast_mapper import to_dto, to_entity


class WeatherForecastRepository(IWeatherForecastRepository):
    def __init__(self):
        if not WeatherForecastDto.exists():
            WeatherForecastDto.create_table(wait=True, billing_mode=AppSettings.dynamodb_billing_mode)

    def get_forecasts(self, area_code: str, date: date, limit: int | None) -> list[JmaForecast]:
        dtos = WeatherForecastDto.query(area_code, scan_index_forward=False, limit=limit)
        results: list[JmaForecast] = [to_entity(dto) for dto in dtos]
        return results

    def save(self, data: JmaForecast):
        dto = to_dto(data)
        dto.created_at = datetime.now(UTC)
        dto.expires_at = datetime.now(UTC) + timedelta(days=AppSettings.weather_forecast_ttl_days)
        dto.save()

    # def add_forecasts(self, forecasts: list[WeatherForecastDto]):
    #     """
    #     PynamoDBでoverwrite_by_pkeysが使えないため、キーの重複エラーが出てしまう。
    #     とりあえず非同期I/Oで個別に保存する。
    #     """
    #     # with WeatherForecastDto.batch_write() as batch:
    #     #     for forecast in forecasts:
    #     #         batch.save(forecast)
    #     for forecast in forecasts:
    #         forecast.save()
