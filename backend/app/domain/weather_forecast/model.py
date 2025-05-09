from domain.pynamodb_model import PynamoDBModel
from domain.weather_forecast.forecast_data import ForecastData
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute


class WeatherForecast(PynamoDBModel):
    class Meta(PynamoDBModel.Meta):
        table_name = "WeatherForecast"

    pk = UnicodeAttribute(attr_name="PK", hash_key=True)
    sk = UnicodeAttribute(attr_name="SK", range_key=True)
    data = ForecastData(attr_name="Data")
    created_at = UTCDateTimeAttribute(attr_name="CreatedAt")
