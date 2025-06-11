from pynamodb.attributes import ListAttribute, MapAttribute, NumberAttribute, UnicodeAttribute

from app.infrastructure.dto.dynamodb.weather_forecast.forecast_pop_data import ForecastPopData


class ForecastData(MapAttribute):
    weather_code = NumberAttribute()
    wind = UnicodeAttribute(null=True)
    wave = UnicodeAttribute(null=True)
    pops = ListAttribute(of=ForecastPopData)
    temp_min = NumberAttribute(null=True)
    temp_max = NumberAttribute(null=True)
