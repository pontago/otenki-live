import pytest

from app.adapter.api.v1.schemas.base import ResponseStatus
from app.core.di.container import Container
from app.usecases.area.list_area_interactor import ListAreaInteractor


@pytest.fixture
def usecase(container: Container):
    container.wire(modules=[__name__])
    usecase = ListAreaInteractor()
    return usecase


def test_execute(usecase):
    areas = usecase.execute()
    assert areas.status == ResponseStatus.SUCCESS
    assert areas.meta["count"] == 47
    assert len(areas.data) == 47
