from zoneinfo import ZoneInfo

from app.domain.entities.live_detect_data.entity import LiveDetectData
from app.infrastructure.dto.dynamodb.live_detect_data.model import LiveDetectDataDto


def to_entity(dto: LiveDetectDataDto) -> LiveDetectData:
    return LiveDetectData(
        channel_id=dto.channel_id,
        person=int(dto.person),
        umbrella=int(dto.umbrella),
        tshirt=int(dto.tshirt),
        jacket=int(dto.jacket),
        long_sleeve=int(dto.long_sleeve),
        outer=int(dto.outer),
        created_at=dto.created_at.astimezone(ZoneInfo("Asia/Tokyo")),
    )


def to_dto(entity: LiveDetectData) -> LiveDetectDataDto:
    return LiveDetectDataDto(
        pk=entity.channel_id,
        sk=entity.created_at,
        person=entity.person,
        umbrella=entity.umbrella,
        tshirt=entity.tshirt,
        jacket=entity.jacket,
        long_sleeve=entity.long_sleeve,
        outer=entity.outer,
    )
