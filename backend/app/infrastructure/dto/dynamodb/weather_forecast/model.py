from datetime import date, datetime

from pynamodb.attributes import TTLAttribute, UnicodeAttribute, UTCDateTimeAttribute

from app.core.settings import AppSettings
from app.infrastructure.dto.dynamodb.pynamodb_model import PynamoDBModel
from app.infrastructure.dto.dynamodb.weather_forecast.forecast_data import ForecastData


class WeatherForecastDto(PynamoDBModel):
    class Meta(PynamoDBModel.Meta):
        table_name = "WeatherForecast" + AppSettings.env_suffix

    pk = UnicodeAttribute(hash_key=True)  # 地域コード
    sk = UnicodeAttribute(range_key=True)  # 予報日時#レポート日時
    data = ForecastData()
    created_at = UTCDateTimeAttribute()
    expires_at = TTLAttribute()

    @property
    def area_id(self) -> str:
        return self.pk

    @property
    def forecast_date(self) -> date | None:
        if self.sk and "#" in self.sk:
            return datetime.fromisoformat(self.sk.split("#")[0]).date()
        return None

    @property
    def report_date_time(self) -> datetime | None:
        if self.sk and "#" in self.sk:
            return datetime.fromisoformat(self.sk.split("#")[1])
        return None
