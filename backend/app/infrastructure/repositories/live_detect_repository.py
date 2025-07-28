from app.core.settings import AppSettings
from app.domain.entities.live_detect_data.entity import LiveDetectData
from app.domain.repositories.live_detect_repository import ILiveDetectRepository
from app.infrastructure.dto.dynamodb.live_detect_data.model import LiveDetectDataDto
from app.infrastructure.mappers.live_detect_data_mapper import to_dto, to_entity


class LiveDetectRepository(ILiveDetectRepository):
    def __init__(self):
        if not LiveDetectDataDto.exists():
            LiveDetectDataDto.create_table(wait=True, billing_mode=AppSettings.dynamodb_billing_mode)

    def save(self, data: LiveDetectData):
        dto = to_dto(data)
        dto.save()

    def get_latest_data(self, channel_id: str) -> LiveDetectData | None:
        dtos = LiveDetectDataDto.query(hash_key=channel_id, scan_index_forward=False, limit=1)
        dto = next(dtos, None)
        return to_entity(dto) if dto else None

    def get_latest_detections(self, channel_id: str, limit: int) -> list[LiveDetectData]:
        dtos = LiveDetectDataDto.query(hash_key=channel_id, scan_index_forward=False, limit=limit)
        return [to_entity(dto) for dto in dtos]
