from dataclasses import dataclass
from datetime import datetime

from domain.jma_forecast.pop_data import PopData
from domain.jma_forecast.temp_data import TempData
from domain.jma_forecast.weather_data import WeatherData


@dataclass
class JmaForecast:
    report_date_time: datetime
    area_code: str
    area_name: str
    weathers: list[WeatherData]
    pops: list[PopData]
    temps: TempData
