from pynamodb.attributes import ListAttribute, MapAttribute, NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute


class ForecastPopData(MapAttribute):
    date_time = UTCDateTimeAttribute()
    pop = NumberAttribute()


class ForecastData(MapAttribute):
    weather_code = NumberAttribute()
    wind = UnicodeAttribute(null=True)
    wave = UnicodeAttribute(null=True)
    pops = ListAttribute(of=ForecastPopData)
    temp_min = NumberAttribute(null=True)
    temp_max = NumberAttribute(null=True)
