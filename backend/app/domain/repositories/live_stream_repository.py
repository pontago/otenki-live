from abc import ABC, abstractmethod


class ILiveStreamRepository(ABC):
    @abstractmethod
    def get_latest_image(self, channel_id: str) -> bytes:
        raise NotImplementedError
