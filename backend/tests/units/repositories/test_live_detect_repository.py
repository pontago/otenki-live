from datetime import UTC, datetime

import pytest

from app.domain.entities.live_detect_data.entity import LiveDetectData
from app.infrastructure.dto.dynamodb.live_detect_data.model import LiveDetectDataDto
from app.infrastructure.repositories.live_detect_repository import LiveDetectRepository


@pytest.fixture
def repository():
    return LiveDetectRepository()


@pytest.fixture
def mock_detects(repository: LiveDetectRepository):
    data = [
        LiveDetectData(
            channel_id="UCBFDJXGCOdMjVtg2AnReoXA",
            person=10,
            umbrella=5,
            tshirt=3,
            jacket=2,
            long_sleeve=1,
            outer=0,
            created_at=datetime.now(UTC),
        ),
    ]
    return data


def test_save(repository: LiveDetectRepository, mock_detects):
    for mock_detect in mock_detects:
        repository.save(mock_detect)

    data = list(LiveDetectDataDto.scan())

    assert data
    assert len(data) == 1
    assert filter(lambda x: x.pk == mock_detects[0].channel_id, data)


def test_get_latest_data(repository: LiveDetectRepository, mock_detects):
    for mock_detect in mock_detects:
        repository.save(mock_detect)

    data = repository.get_latest_data(mock_detects[0].channel_id)

    assert data
    assert data.channel_id == mock_detects[0].channel_id
