from dataclasses import dataclass
from datetime import datetime


@dataclass
class WeatherData:
    date_time: datetime
    weather: str
    wind: str
    wave: str
