from timeit import timeit
from typing import Any

from aws_lambda_typing.context import Context
from loguru import logger

from app.core.di.container import Container
from app.usecases.weather_forecast.update_forecast_interactor import UpdateForecastInteractor

container = Container()
container.wire(modules=[__name__])


def lambda_handler(event: dict[str, Any], context: Context):
    usecase = UpdateForecastInteractor()
    update_count = usecase.execute()

    message = f"Updated {update_count} forecasts."
    logger.success(message)

    return {"statusCode": 200, "body": message}


if __name__ == "__main__":
    logger.debug(timeit("lambda_handler({}, None)", number=1, globals=globals()))
