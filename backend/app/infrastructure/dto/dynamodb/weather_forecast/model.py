from datetime import date, datetime

from pynamodb.attributes import TTLAttribute, UnicodeAttribute, UTCDateTimeAttribute

from app.infrastructure.dto.dynamodb.pynamodb_model import PynamoDBModel
from app.infrastructure.dto.dynamodb.weather_forecast.forecast_data import ForecastData


class WeatherForecastDto(PynamoDBModel):
    class Meta(PynamoDBModel.Meta):
        table_name = "WeatherForecast"

    pk = UnicodeAttribute(hash_key=True)
    sk = UnicodeAttribute(range_key=True)
    data = ForecastData()
    created_at = UTCDateTimeAttribute()
    expire_at = TTLAttribute()

    @property
    def area_code(self) -> str:
        return self.pk

    @property
    def forecast_date_time(self) -> date | None:
        if self.sk and "#" in self.sk:
            return datetime.fromisoformat(self.sk.split("#")[0]).date()
        return None

    @property
    def report_date_time(self) -> datetime | None:
        if self.sk and "#" in self.sk:
            return datetime.fromisoformat(self.sk.split("#")[1])
        return None
