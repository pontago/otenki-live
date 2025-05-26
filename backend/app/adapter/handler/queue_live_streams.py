from timeit import timeit
from typing import Any

from aws_lambda_typing.context import Context
from loguru import logger

from app.core.di.container import Container
from app.usecases.live_channel.check_live_streams_interactor import CheckLiveStreamsInteractor

container = Container()
container.wire(modules=[__name__])


def lambda_handler(event: dict[str, Any], context: Context | None):
    usecase = CheckLiveStreamsInteractor()
    message_ids = usecase.execute()

    if message_ids:
        logger.info(f"Queue message ids: {message_ids}")
    else:
        logger.warning("No active channels.")


if __name__ == "__main__":
    # lambda_handler({}, None)
    print(timeit("lambda_handler({}, None)", number=1, globals=globals()))
