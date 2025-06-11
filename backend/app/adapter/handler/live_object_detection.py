from urllib import response
from aws_lambda_typing.context import Context
from aws_lambda_typing.events import SQSEvent
from pydantic import ValidationError

from app.core.di.container import Container
from app.infrastructure.dto.sqs.live_stream_payload import LiveStreamPayload
from app.usecases.live_channel.object_detection_interactor import ObjectDetectionInteractor

container = Container()
container.wire(modules=[__name__])


def lambda_handler(event: SQSEvent, context: Context | None = None):
    try:
        payloads = [
            LiveStreamPayload.model_validate_json(record["body"]) for record in event["Records"] if "body" in record
        ]
    except ValidationError as e:
        raise ValueError(f"Invalid payload: {e}")

    usecase = ObjectDetectionInteractor()
    processed = usecase.execute(payloads)

    response = None
    if processed:
        channel_ids = [channel for channel in processed]
        response = {
            "statusCode": 200,
            "body": f"Processed channels: {channel_ids}."
        }
    else:
        response = {
            "statusCode": 500,
            "body": "No channels processed or an error occurred."
        }
    return response


if __name__ == "__main__":
    lambda_handler(
        {
            "Records": [
                {
                    "messageId": "1",
                    "receiptHandle": "abc123",
                    "body": '{"channel_id": "UCCLnJzwda_Kcdkok3et7n0A", "processed_at": "2023-10-01T12:00:00Z"}',
                    "attributes": {},
                    "messageAttributes": {},
                    "md5OfBody": "d41d8cd98f00b204e9800998ecf8427e",
                    "eventSource": "aws:sqs",
                    "eventSourceARN": "arn:aws:sqs:us-east-1:123456789012:MyQueue",
                    "awsRegion": "us-east-1",
                }
            ]
        },
    )
    # logger.debug(timeit("lambda_handler()", number=1, globals=globals()))
