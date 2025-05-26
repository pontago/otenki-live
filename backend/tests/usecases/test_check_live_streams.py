import pytest

from app.core.di.container import Container
from app.usecases.live_channel.check_live_streams_interactor import CheckLiveStreamsInteractor


@pytest.fixture
def usecase(container: Container):
    container.wire(modules=[__name__])
    usecase = CheckLiveStreamsInteractor()
    return usecase


def test_check_live_streams(usecase):
    messageIds = usecase.execute()

    assert messageIds
    assert len(messageIds) > 0
