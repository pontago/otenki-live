from datetime import UTC, datetime

import pytest

from app.infrastructure.dto.dynamodb.live_channel.model import LiveChannelDto
from app.infrastructure.repositories.live_channel_repository import LiveChannelRepository


@pytest.fixture
def repository():
    return LiveChannelRepository()


@pytest.fixture
def mock_channels(repository: LiveChannelRepository):
    channels = [
        LiveChannelDto(
            pk="UCBFDJXGCOdMjVtg2AnReoXA",
            is_active=int(False),
            name="歌舞伎町 ライブ ちゃんねる 2『 Kabukicho Live Channel II 』",
            area_code="",
            status=0,
            processed_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        ),
        LiveChannelDto(
            pk="UCCLnJzwda_Kcdkok3et7n0A",
            is_active=int(True),
            name="歌舞伎町 ライブ ちゃんねる『 Kabukicho Live Channel 』",
            area_code="",
            status=0,
            processed_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        ),
    ]
    return channels


def test_add_channel(repository: LiveChannelRepository, mock_channels: list[LiveChannelDto]):
    # for mock_channel in mock_channels:
    #     repository.add_channel(mock_channel)

    repository.seed_loader()

    channels = list(LiveChannelDto.scan())
    print(channels)

    assert channels
    assert len(channels) == 2
    assert filter(lambda x: x.pk == mock_channels[0].pk, channels)


def test_get_active_channels(repository: LiveChannelRepository, mock_channels: list[LiveChannelDto]):
    # for mock_channel in mock_channels:
    #     repository.add_channel(mock_channel)

    channels = repository.get_active_channels()

    assert channels is not None
    assert len(channels) == 1
    assert channels[0].pk == mock_channels[1].pk
