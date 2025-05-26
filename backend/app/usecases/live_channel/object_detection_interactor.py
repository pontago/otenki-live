from dependency_injector.wiring import Provide, inject

from app.core.di.container import Container
from app.domain.repositories.live_channel_repository import ILiveChannelRepository
from app.domain.repositories.sqs_repository import ISQSRepository
from app.infrastructure.dto.sqs.live_stream_payload import LiveStreamPayload


@inject
class ObjectDetectionInteractor:
    def __init__(
        self,
        live_channel_repository: ILiveChannelRepository = Provide[Container.live_channel_repository],
        sqs_repository: ISQSRepository = Provide[Container.sqs_repository],
    ):
        self.live_channel_repository = live_channel_repository
        self.sqs_repository = sqs_repository

    def execute(self, payloads: list[LiveStreamPayload]) -> list[str] | None:
        return None
