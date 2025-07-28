from pydantic import BaseModel


class ForecastTelop(BaseModel):
    weather_code: int
    name: str
