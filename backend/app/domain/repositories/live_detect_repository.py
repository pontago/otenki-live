from abc import ABC, abstractmethod

from app.domain.entities.live_detect_data.entity import LiveDetectData


class ILiveDetectRepository(ABC):
    @abstractmethod
    def save(self, data: LiveDetectData):
        raise NotImplementedError
