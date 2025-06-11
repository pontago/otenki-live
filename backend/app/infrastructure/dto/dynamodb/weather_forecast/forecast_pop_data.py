from pynamodb.attributes import MapAttribute, NumberAttribute, UTCDateTimeAttribute


class ForecastPopData(MapAttribute):
    date_time = UTCDateTimeAttribute()
    pop = NumberAttribute()
