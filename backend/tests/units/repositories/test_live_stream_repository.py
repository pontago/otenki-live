from datetime import UTC, datetime

import pytest

from app.domain.entities.live_channel.entity import LiveChannel
from app.domain.entities.live_channel.live_channel_status import LiveChannelStatus
from app.infrastructure.exceptions import LiveStreamGetInfoError
from app.infrastructure.repositories.live_stream_repository import LiveStreamRepository


@pytest.fixture
def mock_channels():
    channels = [
        LiveChannel(
            channel_id="test",
            is_active=False,
            area_code="tokyo",
            name="test",
            status=LiveChannelStatus.NONE,
            processed_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        ),
        LiveChannel(
            channel_id="UCCLnJzwda_Kcdkok3et7n0A",
            is_active=True,
            area_code="tokyo",
            name="歌舞伎町 ライブ ちゃんねる『 Kabukicho Live Channel 』",
            status=LiveChannelStatus.NONE,
            processed_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        ),
    ]
    return channels


@pytest.fixture
def repository():
    return LiveStreamRepository()


def test_get_latest_image(repository, mock_channels):
    with pytest.raises(LiveStreamGetInfoError):
        repository.get_latest_image(mock_channels[0])

    image = repository.get_latest_image(mock_channels[1])
    assert image
