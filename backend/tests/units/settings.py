import pytest
from core.di.container import Container
from core.settings import Settings


@pytest.fixture
def container():
    container = Container()
    container.wire(modules=[__name__])
    return container


def test_settings(container: Container):
    print(Settings().model_dump())
    assert container.config.dynamodb.endpoint_url
