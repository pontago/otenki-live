from datetime import datetime

from pydantic import BaseModel


class JmaHourlyForecast(BaseModel):
    report_date_time: datetime
    date_time: datetime
    area_code: str
    area_name: str
    weather_code: int
    temp: int
    temp_min: int | None
    temp_max: int | None
