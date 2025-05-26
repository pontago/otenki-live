import boto3
import pytest

from app.core.settings import AppSettings
from app.infrastructure.exceptions import SQSGetQueueError
from app.infrastructure.repositories.sqs_repository import SQSRepository


@pytest.fixture
def repository():
    session = boto3.session.Session()
    return SQSRepository(session=session)


def test_send_message(repository):
    with pytest.raises(SQSGetQueueError):
        repository.send_message("test-queue", "test")

    message_id = repository.send_message(AppSettings.live_streams_queue_name, "test")
    assert message_id
