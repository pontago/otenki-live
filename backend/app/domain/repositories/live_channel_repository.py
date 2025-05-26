from abc import ABC, abstractmethod

from app.infrastructure.dto.dynamodb.live_channel.model import LiveChannelDto


class ILiveChannelRepository(ABC):
    @abstractmethod
    def seed_loader(self):
        raise NotImplementedError

    @abstractmethod
    def get_active_channels(self) -> list[LiveChannelDto]:
        raise NotImplementedError

    @abstractmethod
    def add_channel(self, live_channel: LiveChannelDto):
        raise NotImplementedError
