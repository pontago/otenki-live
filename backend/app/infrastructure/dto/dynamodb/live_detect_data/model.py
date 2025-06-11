from datetime import datetime

from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from app.core.settings import AppSettings
from app.infrastructure.dto.dynamodb.pynamodb_model import PynamoDBModel


class LiveDetectDataDto(PynamoDBModel):
    class Meta(PynamoDBModel.Meta):
        table_name = "LiveDetectData" + AppSettings.env_suffix

    pk = UnicodeAttribute(hash_key=True)
    sk = UTCDateTimeAttribute(range_key=True)
    person = NumberAttribute(default=0)
    umbrella = NumberAttribute(default=0)
    tshirt = NumberAttribute(default=0)
    jacket = NumberAttribute(default=0)
    long_sleeve = NumberAttribute(default=0)
    outer = NumberAttribute(default=0)

    @property
    def channel_id(self) -> str:
        return self.pk

    @property
    def created_at(self) -> datetime:
        return self.sk
