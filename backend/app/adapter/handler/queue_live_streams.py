from timeit import timeit
from typing import Any

from aws_lambda_typing.context import Context
from loguru import logger

from app.core.di.container import Container
from app.usecases.live_channel.check_live_streams_interactor import CheckLiveStreamsInteractor

container = Container()
container.wire(modules=[__name__])


def lambda_handler(event: dict[str, Any], context: Context):
    usecase = CheckLiveStreamsInteractor()
    message_ids = usecase.execute()

    response = None
    if message_ids:
        response = {
            "statusCode": 200,
            "body": f"Queue message ids: {message_ids}."
        }
    else:
        response = {
            "statusCode": 204,
            "body": "No active channels."
        }
    return response



if __name__ == "__main__":
    logger.debug(timeit("lambda_handler({}, None)", number=1, globals=globals()))
