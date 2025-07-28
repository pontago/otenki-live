from abc import ABC, abstractmethod

from app.domain.entities.live_channel.entity import LiveChannel


class ILiveStreamRepository(ABC):
    @abstractmethod
    def get_latest_image(self, live_channel: LiveChannel) -> bytes:
        raise NotImplementedError
