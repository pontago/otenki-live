from datetime import date, datetime

from pydantic import BaseModel

from app.domain.entities.jma_forecast.pop_data import PopData


class JmaForecast(BaseModel):
    report_date_time: datetime
    date_time: date
    area_code: str
    area_name: str
    weather_code: int
    wind: str | None
    wave: str | None
    pops: list[PopData]
    temp_min: int | None
    temp_max: int | None
