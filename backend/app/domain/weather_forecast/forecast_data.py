from pynamodb.attributes import ListAttribute, MapAttribute, UnicodeAttribute


class ForecastData(MapAttribute):
    weathers = ListAttribute(of=UnicodeAttribute)
    winds = ListAttribute(of=UnicodeAttribute)
    waves = ListAttribute(of=UnicodeAttribute)
    pops = ListAttribute(of=UnicodeAttribute)
    temps = ListAttribute(of=UnicodeAttribute)
