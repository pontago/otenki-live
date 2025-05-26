from typing import Any

from aws_lambda_typing.context import Context
from loguru import logger

from app.core.di.container import Container
from app.core.settings import AppSettings
from app.usecases.weather_forecast.update_forecast_interactor import UpdateForecastInteractor

container = Container()
container.wire(modules=[__name__])


def lambda_handler(event: dict[str, Any], context: Context | None):
    usecase = UpdateForecastInteractor()
    update_count = usecase.execute()
    logger.info(f"Updated {update_count} forecasts.")


if __name__ == "__main__":
    # lambda_handler({}, None)
    # print(timeit("lambda_handler({}, None)", number=1, globals=globals()))
    print(AppSettings.model_dump())
