from datetime import datetime

from pynamodb.attributes import NumberAttribute, TTLAttribute, UnicodeAttribute, UTCDateTimeAttribute

from app.core.settings import AppSettings
from app.infrastructure.dto.dynamodb.pynamodb_model import PynamoDBModel
from app.infrastructure.dto.dynamodb.weather_hourly_forecast.report_date_index import ReportDateIndex


class WeatherHourlyForecastDto(PynamoDBModel):
    class Meta(PynamoDBModel.Meta):
        table_name = "WeatherHourlyForecast" + AppSettings.env_suffix

    pk = UnicodeAttribute(hash_key=True)  # 地域コード
    sk = UnicodeAttribute(range_key=True)  # 予報日時#レポート日時
    report_date_time = UTCDateTimeAttribute()
    weather_code = NumberAttribute()
    temp = NumberAttribute()
    temp_min = NumberAttribute(null=True)
    temp_max = NumberAttribute(null=True)
    created_at = UTCDateTimeAttribute()
    expires_at = TTLAttribute()

    report_date_index = ReportDateIndex()

    @property
    def area_id(self) -> str:
        return self.pk

    @property
    def forecast_date_time(self) -> datetime | None:
        if self.sk and "#" in self.sk:
            return datetime.fromisoformat(self.sk.split("#")[0])
        return None
