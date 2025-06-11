from datetime import UTC

from app.domain.entities.jma_forecast.entity import JmaForecast
from app.infrastructure.dto.dynamodb.weather_forecast.forecast_data import ForecastData, ForecastPopData
from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto


def to_entity(dto: WeatherForecastDto) -> JmaForecast:
    return JmaForecast(
        **{
            "report_date_time": dto.report_date_time,
            "date_time": dto.forecast_date,
            "area_code": dto.area_code,
            "area_name": "",
            "weather_code": dto.data.weather_code,
            "wind": dto.data.wind,
            "wave": dto.data.wave,
            "pops": [pop_data.to_simple_dict() for pop_data in dto.data.pops],
            "temp_min": dto.data.temp_min,
            "temp_max": dto.data.temp_max,
        }
    )


def to_dto(entity: JmaForecast) -> WeatherForecastDto:
    return WeatherForecastDto(
        pk=entity.area_code,
        sk=f"{entity.date_time}#{entity.report_date_time}",
        data=ForecastData(
            weather_code=entity.weather_code,
            wind=entity.wind,
            wave=entity.wave,
            pops=[ForecastPopData(date_time=d.date_time.astimezone(UTC), pop=d.pop) for d in entity.pops],
            temp_min=entity.temp_min,
            temp_max=entity.temp_max,
        ),
    )
