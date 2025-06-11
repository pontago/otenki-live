import pytest

from app.infrastructure.exceptions import LiveStreamGetInfoError
from app.infrastructure.repositories.live_stream_repository import LiveStreamRepository


@pytest.fixture
def mock_channel_ids():
    channel_ids = [
        "UCBFDJXGCOdMjVtg2AnReoXA",
        # "UCCLnJzwda_Kcdkok3et7n0A",
    ]
    return channel_ids


@pytest.fixture
def repository():
    return LiveStreamRepository()


def test_get_latest_image(repository, mock_channel_ids):
    with pytest.raises(LiveStreamGetInfoError):
        repository.get_latest_image("test")

    image = repository.get_latest_image(mock_channel_ids[0])
    assert image
