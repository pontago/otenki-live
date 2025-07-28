from abc import ABC, abstractmethod

from app.domain.entities.live_detect_data.entity import LiveDetectData


class ILiveDetectRepository(ABC):
    @abstractmethod
    def save(self, data: LiveDetectData):
        raise NotImplementedError

    @abstractmethod
    def get_latest_data(self, channel_id: str) -> LiveDetectData | None:
        raise NotImplementedError

    @abstractmethod
    def get_latest_detections(self, channel_id: str, limit: int) -> list[LiveDetectData]:
        raise NotImplementedError
