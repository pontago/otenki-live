from datetime import UTC, datetime
from pathlib import Path

from dependency_injector.wiring import Provide, inject
from loguru import logger

from app.core.di.container import Container
from app.core.settings import AppSettings
from app.domain.entities.live_channel.live_channel_status import LiveChannelStatus
from app.domain.entities.live_detect_data.entity import LiveDetectData
from app.domain.repositories.live_channel_repository import ILiveChannelRepository
from app.domain.repositories.live_detect_repository import ILiveDetectRepository
from app.domain.repositories.live_stream_repository import ILiveStreamRepository
from app.domain.repositories.sqs_repository import ISQSRepository
from app.domain.repositories.storage_repository import IStorageRepository
from app.domain.services.object_detection_service import ObjectDetectionService
from app.infrastructure.dto.sqs.live_stream_payload import LiveStreamPayload
from app.infrastructure.exceptions import LiveStreamNotReadyError


@inject
class ObjectDetectionInteractor:
    def __init__(
        self,
        live_channel_repository: ILiveChannelRepository = Provide[Container.live_channel_repository],
        sqs_repository: ISQSRepository = Provide[Container.sqs_repository],
        live_stream_repository: ILiveStreamRepository = Provide[Container.live_stream_repository],
        live_detect_repository: ILiveDetectRepository = Provide[Container.live_detect_repository],
        storage_repository: IStorageRepository = Provide[Container.storage_repository],
        object_detection_service: ObjectDetectionService = ObjectDetectionService(),
    ):
        self.live_channel_repository = live_channel_repository
        self.sqs_repository = sqs_repository
        self.live_stream_repository = live_stream_repository
        self.live_detect_repository = live_detect_repository
        self.storage_repository = storage_repository
        self.object_detection_service = object_detection_service

    def execute(self, payloads: list[LiveStreamPayload]):
        # if AppSettings.classification_model_weights_path is None:
        #     raise ValueError("Classification model weights path is not set")
        if AppSettings.detection_model_weights_path is None:
            raise ValueError("Detection model weights path is not set")
        if AppSettings.clothing_model_weights_path is None:
            raise ValueError("Clothing model weights path is not set")

        channels = self.live_channel_repository.get_channels(
            [payload.channel_id for payload in payloads], LiveChannelStatus.NONE
        )

        if not channels:
            logger.info(f"No channels found for object detection.[{payloads}]")
            return

        self.live_channel_repository.update_status([channel.inProcessing() for channel in channels])

        self.storage_repository.sync_model()
        self.storage_repository.download_cookies()

        detection_model_path = Path(AppSettings.storage_dir, AppSettings.detection_model_weights_path)
        clothing_model_path = Path(AppSettings.storage_dir, AppSettings.clothing_model_weights_path)
        self.object_detection_service.load_model(
            detection_model_path=str(detection_model_path), clothing_model_path=str(clothing_model_path)
        )

        for channel in channels:
            try:
                buffer = self.live_stream_repository.get_latest_image(channel)
                now = datetime.now(UTC)

                detect_object = self.object_detection_service.detect_objects(buffer)
                live_detect_data = LiveDetectData(
                    **detect_object.model_dump(), channel_id=channel.channel_id, created_at=now
                )

                self.live_detect_repository.save(live_detect_data)
                self.live_channel_repository.update_status(channel.inactive())
            except LiveStreamNotReadyError:
                self.live_channel_repository.update_status(channel.inactive())
            except Exception:
                self.live_channel_repository.update_status(channel.failed())
                raise

        return channels
