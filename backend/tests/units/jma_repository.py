import pytest
from core.di.container import Container


@pytest.fixture
def container():
    container = Container()
    container.wire(modules=[__name__])
    return container


def test_jma_repository(container):
    repository = container.jma_repository()
    print(repository)
    repository.get_weekly_forecast()
