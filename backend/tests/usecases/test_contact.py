import pytest

from app.adapter.api.v1.schemas.contact import ContactInput
from app.core.di.container import Container
from app.usecases.contact.contact_interactor import ContactInteractor


@pytest.fixture
def usecase(container: Container):
    container.wire(modules=[__name__])
    usecase = ContactInteractor()
    return usecase


def test_contact(usecase):
    message_ids = usecase.execute(ContactInput(name="test", email="test@test.com", message="test"))
    assert message_ids
    assert len(message_ids) == 2
