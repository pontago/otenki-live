from zoneinfo import ZoneInfo

from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast
from app.infrastructure.dto.dynamodb.weather_hourly_forecast.model import WeatherHourlyForecastDto


def to_entity(dto: WeatherHourlyForecastDto) -> JmaHourlyForecast:
    return JmaHourlyForecast.model_validate(
        {
            "report_date_time": dto.report_date_time.astimezone(ZoneInfo("Asia/Tokyo"))
            if dto.report_date_time
            else None,
            "date_time": dto.forecast_date_time.astimezone(ZoneInfo("Asia/Tokyo")) if dto.forecast_date_time else None,
            "area_id": dto.area_id,
            "weather_code": dto.weather_code,
            "temp": dto.temp,
            "temp_min": dto.temp_min,
            "temp_max": dto.temp_max,
        }
    )


def to_dto(entity: JmaHourlyForecast) -> WeatherHourlyForecastDto:
    return WeatherHourlyForecastDto(
        pk=entity.area_id,
        sk=f"{entity.date_time}#{entity.report_date_time}",
        report_date_time=entity.report_date_time,
        weather_code=entity.weather_code,
        temp=entity.temp,
        temp_min=entity.temp_min,
        temp_max=entity.temp_max,
    )
