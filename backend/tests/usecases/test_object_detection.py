from datetime import UTC, datetime

import pytest

from app.core.di.container import Container
from app.infrastructure.dto.dynamodb.live_detect_data.model import LiveDetectDataDto
from app.infrastructure.dto.sqs.live_stream_payload import LiveStreamPayload
from app.usecases.live_channel.object_detection_interactor import ObjectDetectionInteractor


@pytest.fixture
def mock_payloads():
    payloads = [
        LiveStreamPayload(channel_id="UCCLnJzwda_Kcdkok3et7n0A", processed_at=datetime.now(UTC)),
    ]
    return payloads


@pytest.fixture
def usecase(container: Container):
    container.wire(modules=[__name__])
    usecase = ObjectDetectionInteractor()
    usecase.live_channel_repository.seed_loader()
    return usecase


def test_object_detection(usecase: ObjectDetectionInteractor, mock_payloads):
    usecase.execute(mock_payloads)

    detects = list(LiveDetectDataDto.scan())

    assert detects
    assert len(detects) == 1
