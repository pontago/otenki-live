from app.core.settings import AppSettings
from app.domain.entities.live_detect_data.entity import LiveDetectData
from app.domain.repositories.live_detect_repository import ILiveDetectRepository
from app.infrastructure.dto.dynamodb.live_detect_data.model import LiveDetectDataDto
from app.infrastructure.mappers.live_detect_data_mapper import to_dto


class LiveDetectRepository(ILiveDetectRepository):
    def __init__(self):
        if not LiveDetectDataDto.exists():
            LiveDetectDataDto.create_table(wait=True, billing_mode=AppSettings.dynamodb_billing_mode)

    def save(self, data: LiveDetectData):
        dto = to_dto(data)
        dto.save()
