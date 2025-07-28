from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from app.core.settings import AppSettings
from app.infrastructure.dto.dynamodb.live_channel.active_index import ActiveIndex
from app.infrastructure.dto.dynamodb.live_channel.area_index import AreaIndex
from app.infrastructure.dto.dynamodb.live_channel.status_index import StatusIndex
from app.infrastructure.dto.dynamodb.pynamodb_model import PynamoDBModel


class LiveChannelDto(PynamoDBModel):
    class Meta(PynamoDBModel.Meta):
        table_name = "LiveChannel" + AppSettings.env_suffix

    pk = UnicodeAttribute(hash_key=True)
    is_active = NumberAttribute()
    area_code = UnicodeAttribute()
    name = UnicodeAttribute()
    status = NumberAttribute()
    processed_at = UTCDateTimeAttribute()
    updated_at = UTCDateTimeAttribute()

    active_index = ActiveIndex()
    status_index = StatusIndex()
    area_index = AreaIndex()

    @property
    def channel_id(self) -> str:
        return self.pk
