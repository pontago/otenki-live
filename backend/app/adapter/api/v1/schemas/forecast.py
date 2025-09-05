from datetime import date, datetime

from pydantic import BaseModel

from app.adapter.api.v1.schemas.base import BaseResponse
from app.adapter.api.v1.schemas.live_channel import LiveChannel, LiveDetectData


class PopData(BaseModel):
    date_time: datetime
    pop: int


class WeatherForecast(BaseModel):
    date: date
    area_id: str
    area_name: str
    area_code: str
    weather_code: int
    weather_name: str
    wind: str | None = None
    wave: str | None = None
    pops: list[PopData]
    temp: int | None = None
    temp_min: int | None = None
    temp_max: int | None = None
    live_channel: LiveChannel | None = None
    live_detect_data: LiveDetectData | None = None


class RegionalWeather(BaseModel):
    region_code: str
    region_name: str
    weather_forecast: WeatherForecast


class HourlyWeatherForecast(BaseModel):
    date_time: datetime
    weather_code: int
    weather_name: str
    temp: int


class DetailedWeather(BaseModel):
    current: WeatherForecast
    hourly: list[HourlyWeatherForecast]
    daily: list[WeatherForecast]
    object_detection: list[LiveDetectData]


class RegionalWeatherResponse(BaseResponse):
    data: list[RegionalWeather]


class WeathersResponse(BaseResponse):
    data: list[WeatherForecast]


class WeatherResponse(BaseResponse):
    data: DetailedWeather
