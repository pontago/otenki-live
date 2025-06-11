from datetime import UTC, datetime

import pytest

from app.domain.entities.live_channel.entity import LiveChannel
from app.domain.entities.live_channel.live_channel_status import LiveChannelStatus
from app.infrastructure.dto.dynamodb.live_channel.model import LiveChannelDto
from app.infrastructure.repositories.live_channel_repository import LiveChannelRepository


@pytest.fixture
def repository():
    return LiveChannelRepository()


@pytest.fixture
def mock_channels(repository: LiveChannelRepository):
    channels = [
        LiveChannel(
            channel_id="UCBFDJXGCOdMjVtg2AnReoXA",
            is_active=False,
            area_code="",
            name="歌舞伎町 ライブ ちゃんねる 2『 Kabukicho Live Channel II 』",
            status=LiveChannelStatus.NONE,
            processed_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        ),
        LiveChannel(
            channel_id="UCCLnJzwda_Kcdkok3et7n0A",
            is_active=True,
            area_code="",
            name="歌舞伎町 ライブ ちゃんねる『 Kabukicho Live Channel 』",
            status=LiveChannelStatus.NONE,
            processed_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        ),
    ]
    return channels


def test_save(repository, mock_channels):
    for mock_channel in mock_channels:
        repository.save(mock_channel)

    channels = list(LiveChannelDto.scan())

    assert channels
    assert len(channels) == 2
    assert filter(lambda x: x.pk == mock_channels[0].channel_id, channels)


def test_get_active_channels(repository, mock_channels):
    for mock_channel in mock_channels:
        repository.save(mock_channel)

    channels = repository.get_active_channels()

    assert channels is not None
    assert len(channels) == 1
    assert channels[0].channel_id == mock_channels[1].channel_id


def test_get_channels(repository, mock_channels):
    for mock_channel in mock_channels:
        repository.save(mock_channel)

    channel_ids = [channel.channel_id for channel in mock_channels]
    channels = repository.get_channels(channel_ids, LiveChannelStatus.NONE)

    assert channels is not None
    assert len(channels) == 2


def test_update_status(repository, mock_channels):
    for mock_channel in mock_channels:
        repository.save(mock_channel)

    mock_channels[0].inProcessing()
    repository.update_status(mock_channels[0])

    updated_channel = LiveChannelDto.get(mock_channels[0].channel_id)
    assert updated_channel.status == LiveChannelStatus.PROCESSING.value
