from datetime import datetime

from pydantic import BaseModel


class JmaHourlyForecast(BaseModel):
    report_date_time: datetime
    date_time: datetime
    area_id: str
    weather_code: int
    temp: int
    temp_min: int | None
    temp_max: int | None

    @classmethod
    def to_weather_code(cls, weather_name: str) -> int:
        if weather_name == "晴れ":
            return 100
        elif weather_name == "くもり":
            return 200
        elif weather_name == "雨":
            return 300
        elif weather_name == "雪":
            return 400
        elif weather_name == "雨または雪":
            return 329
        return -1
