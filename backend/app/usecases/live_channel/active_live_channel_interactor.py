from dependency_injector.wiring import Provide, inject

from app.adapter.api.v1.schemas.base import ResponseStatus
from app.adapter.api.v1.schemas.live_channel import LiveChannel, LiveChannelsResponse
from app.core.di.container import Container
from app.domain.repositories.live_channel_repository import ILiveChannelRepository


@inject
class ActiveLiveChannelInteractor:
    def __init__(
        self,
        live_channel_repository: ILiveChannelRepository = Provide[Container.live_channel_repository],
    ):
        self.live_channel_repository = live_channel_repository

    def execute(self) -> LiveChannelsResponse:
        channels = self.live_channel_repository.get_active_channels()
        return LiveChannelsResponse(
            status=ResponseStatus.SUCCESS,
            meta={
                "count": len(channels),
            },
            data=[LiveChannel(name=channel.name, url=channel.stream_url()) for channel in channels],
        )
