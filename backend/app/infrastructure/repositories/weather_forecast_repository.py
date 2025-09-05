from datetime import UTC, date, datetime, timedelta
from zoneinfo import ZoneInfo

from app.core.settings import AppSettings
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast
from app.domain.repositories.weather_forecast_repository import IWeatherForecastRepository
from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto
from app.infrastructure.dto.dynamodb.weather_hourly_forecast.model import WeatherHourlyForecastDto
from app.infrastructure.mappers.weather_forecast_mapper import to_dto, to_entity
from app.infrastructure.mappers.weather_hourly_forecast_mapper import to_dto as to_hourly_dto
from app.infrastructure.mappers.weather_hourly_forecast_mapper import to_entity as to_hourly_entity


class WeatherForecastRepository(IWeatherForecastRepository):
    def __init__(self):
        if not WeatherForecastDto.exists():
            WeatherForecastDto.create_table(wait=True, billing_mode=AppSettings.dynamodb_billing_mode)
        if not WeatherHourlyForecastDto.exists():
            WeatherHourlyForecastDto.create_table(wait=True, billing_mode=AppSettings.dynamodb_billing_mode)

    def get_forecasts(
        self, area_id: str | None = None, date: date | None = None, limit: int | None = None
    ) -> list[JmaForecast]:
        if area_id:
            range_key_condition = WeatherForecastDto.sk.startswith(date.strftime("%Y-%m-%d")) if date else None
            dtos = WeatherForecastDto.query(
                hash_key=area_id, range_key_condition=range_key_condition, scan_index_forward=False, limit=limit
            )
        else:
            dtos = WeatherForecastDto.scan(limit=limit)
        return [to_entity(dto) for dto in dtos]

    def get_hourly_forecasts(
        self, area_id: str | None = None, date: date | None = None, limit: int | None = None
    ) -> list[JmaHourlyForecast]:
        if area_id:
            range_key_condition = WeatherHourlyForecastDto.sk.startswith(date.strftime("%Y-%m-%d")) if date else None
            dtos = WeatherHourlyForecastDto.query(
                hash_key=area_id, range_key_condition=range_key_condition, scan_index_forward=False, limit=limit
            )
        else:
            dtos = WeatherHourlyForecastDto.scan(limit=limit)
        return [to_hourly_entity(dto) for dto in dtos]

    def get_latest_hourly_forecasts(
        self, area_id: str | None = None, limit: int | None = None
    ) -> list[JmaHourlyForecast]:
        if area_id:
            range_key_condition = WeatherHourlyForecastDto.report_date_time >= datetime.now(UTC) - timedelta(hours=24)
            dtos = WeatherHourlyForecastDto.report_date_index.query(
                hash_key=area_id, range_key_condition=range_key_condition, scan_index_forward=False, limit=limit
            )
        else:
            dtos = WeatherHourlyForecastDto.scan(limit=limit)
        return [to_hourly_entity(dto) for dto in dtos]

    def get_current_hourly_forecast(self, area_id: str) -> JmaHourlyForecast:
        now = datetime.now(ZoneInfo("Asia/Tokyo"))
        total_hour = now.hour + now.minute / 60
        rounded_hour = int(round(total_hour / 3) * 3) % 24

        day_adjust = 1 if rounded_hour == 0 and now.hour >= 21 else 0
        new_date = now.date() + timedelta(days=day_adjust)
        date = datetime.combine(new_date, datetime.min.time()).replace(hour=rounded_hour)

        range_key_condition = WeatherHourlyForecastDto.sk.startswith(date.strftime("%Y-%m-%d %H"))
        dtos = WeatherHourlyForecastDto.query(
            hash_key=area_id, range_key_condition=range_key_condition, scan_index_forward=False, limit=1
        )
        return [to_hourly_entity(dto) for dto in dtos][0]

    def save(self, data: JmaForecast | JmaHourlyForecast):
        dto: WeatherForecastDto | WeatherHourlyForecastDto

        if isinstance(data, JmaForecast):
            dto = to_dto(data)
            dto.expires_at = datetime.now(UTC) + timedelta(days=AppSettings.weather_forecast_ttl_days)
        elif isinstance(data, JmaHourlyForecast):
            dto = to_hourly_dto(data)
            dto.expires_at = datetime.now(UTC) + timedelta(days=AppSettings.weather_hourly_forecast_ttl_days)

        dto.created_at = datetime.now()
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
