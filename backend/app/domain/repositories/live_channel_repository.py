from abc import ABC, abstractmethod

from app.domain.entities.live_channel.entity import LiveChannel
from app.domain.entities.live_channel.live_channel_status import LiveChannelStatus


class ILiveChannelRepository(ABC):
    @abstractmethod
    def seed_loader(self):
        raise NotImplementedError

    @abstractmethod
    def get_active_channels(self) -> list[LiveChannel]:
        raise NotImplementedError

    @abstractmethod
    def save(self, data: LiveChannel):
        raise NotImplementedError

    @abstractmethod
    def get_channels(self, channel_ids: list[str], status: LiveChannelStatus) -> list[LiveChannel]:
        raise NotImplementedError

    @abstractmethod
    def update_status(self, data: LiveChannel | list[LiveChannel]):
        raise NotImplementedError

    @abstractmethod
    def get_active_channels_by_area(self, area_code: str) -> list[LiveChannel]:
        raise NotImplementedError
