import pytest
from fastapi.testclient import TestClient

from app.adapter.api.main import app
from app.adapter.api.v1.schemas.base import ResponseStatus
from app.core.settings import AppSettings
from app.infrastructure.repositories.live_channel_repository import LiveChannelRepository


@pytest.fixture
def repository():
    repository = LiveChannelRepository()
    repository.seed_loader()
    return repository


@pytest.fixture
def client(repository: LiveChannelRepository):
    return TestClient(app)


def test_get_live_channels(client: TestClient):
    response = client.get(f"{AppSettings.api_v1_prefix}/live-channel")
    assert response.status_code == 200

    json = response.json()
    assert json.get("status") == ResponseStatus.SUCCESS.value
    assert len(json.get("data")) > 0
