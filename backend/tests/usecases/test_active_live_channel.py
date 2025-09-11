import pytest

from app.adapter.api.v1.schemas.base import ResponseStatus
from app.core.di.container import Container
from app.usecases.live_channel.active_live_channel_interactor import ActiveLiveChannelInteractor


@pytest.fixture
def usecase(container: Container):
    container.wire(modules=[__name__])
    usecase = ActiveLiveChannelInteractor()
    usecase.live_channel_repository.seed_loader()
    return usecase


def test_active_live_channel(usecase: ActiveLiveChannelInteractor):
    response = usecase.execute()

    assert response.status == ResponseStatus.SUCCESS
    assert len(response.data) > 0
