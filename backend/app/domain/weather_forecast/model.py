from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.models import Model

from domain.weather_forecast.forecast_data import ForecastData


class WeatherForecast(Model):
    class Meta:
        table_name = "WeatherForecast"

    areaCode = UnicodeAttribute(attr_name="PK", hash_key=True)
    dateWithReport = UnicodeAttribute(attr_name="SK", range_key=True)
    data = ForecastData(attr_name="Data")
    created_at = UTCDateTimeAttribute(attr_name="CreatedAt")
