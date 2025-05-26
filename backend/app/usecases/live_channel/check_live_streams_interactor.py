from dependency_injector.wiring import Provide, inject

from app.core.di.container import Container
from app.core.settings import AppSettings
from app.domain.repositories.live_channel_repository import ILiveChannelRepository
from app.domain.repositories.sqs_repository import ISQSRepository
from app.infrastructure.dto.sqs.live_stream_payload import LiveStreamPayload


@inject
class CheckLiveStreamsInteractor:
    def __init__(
        self,
        live_channel_repository: ILiveChannelRepository = Provide[Container.live_channel_repository],
        sqs_repository: ISQSRepository = Provide[Container.sqs_repository],
    ):
        self.live_channel_repository = live_channel_repository
        self.sqs_repository = sqs_repository

    def execute(self) -> list[str] | None:
        channels = self.live_channel_repository.get_active_channels()

        if not channels:
            return None

        message_ids: list[str] = []
        for channel in channels:
            payload = LiveStreamPayload(channel_id=channel.channel_id, processed_at=channel.processed_at)
            response = self.sqs_repository.send_message(AppSettings.live_streams_queue_name, payload.model_dump_json())

            if response:
                message_ids.append(response)

        return message_ids
