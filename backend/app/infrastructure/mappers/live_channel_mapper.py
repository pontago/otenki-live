from zoneinfo import ZoneInfo

from app.domain.entities.live_channel.entity import LiveChannel
from app.domain.entities.live_channel.live_channel_status import LiveChannelStatus
from app.infrastructure.dto.dynamodb.live_channel.model import LiveChannelDto


def to_entity(dto: LiveChannelDto) -> LiveChannel:
    return LiveChannel(
        channel_id=dto.channel_id,
        is_active=bool(dto.is_active),
        area_code=dto.area_code,
        name=dto.name,
        status=LiveChannelStatus(int(dto.status)),
        processed_at=dto.processed_at.astimezone(ZoneInfo("Asia/Tokyo")),
        updated_at=dto.updated_at.astimezone(ZoneInfo("Asia/Tokyo")),
    )


def to_dto(entity: LiveChannel) -> LiveChannelDto:
    return LiveChannelDto(
        pk=entity.channel_id,
        is_active=int(entity.is_active),
        area_code=entity.area_code,
        name=entity.name,
        status=entity.status.value,
        processed_at=entity.processed_at,
    )
