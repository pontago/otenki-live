import boto3
from loguru import logger

from app.core.settings import AppSettings
from app.domain.repositories.sqs_repository import ISQSRepository
from app.infrastructure.exceptions import SQSGetQueueError, SQSSendMessageError


class SQSRepository(ISQSRepository):
    def __init__(self, session: boto3.Session):
        self.session = session
        self.sqs = self.session.client("sqs", endpoint_url=AppSettings.endpoint_url)

    def send_message(self, queue_name: str, body: str) -> str:
        try:
            sqs_queue = self.sqs.get_queue_url(QueueName=queue_name)
        except self.sqs.exceptions.QueueDoesNotExist as e:
            logger.error(f"Queue does not exist.[{queue_name}]")
            raise SQSGetQueueError from e

        try:
            response = self.sqs.send_message(
                QueueUrl=sqs_queue["QueueUrl"],
                MessageBody=body,
                # MessageDeduplicationId=hashlib.sha256(body.encode("utf-8")).hexdigest(),
            )
        except Exception as e:
            logger.error(f"Failed to SQS send message: {e}")
            raise SQSSendMessageError from e

        return response["MessageId"]
