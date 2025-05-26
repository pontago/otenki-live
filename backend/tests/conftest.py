import os

os.environ["ENV"] = "test"

import boto3
import pytest
from moto import mock_aws

from app.core.di.container import Container
from app.infrastructure.dto.dynamodb.live_channel.model import LiveChannelDto
from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto


@pytest.fixture(scope="session", autouse=True)
def setup():
    # AppSettings.dynamodb_endpoint_url = ""
    pass
    # AppSettings = Settings(_env_file=".env.test")  # type: ignore
    # AppSettings = Settings(_env_file=".env.test")  # type: ignore
    # print(AppSettings.dict())
    # print(AppSettings.dynamodb_endpoint_url)


@mock_aws
@pytest.fixture(scope="session", autouse=True)
def mock_dynamodb():
    from app.core.settings import AppSettings

    mock = mock_aws()
    mock.start()

    if not WeatherForecastDto.exists():
        WeatherForecastDto.create_table(wait=True)

    if not LiveChannelDto.exists():
        LiveChannelDto.create_table(wait=True)

    sqs = boto3.client("sqs", region_name=AppSettings.region_name)
    sqs.create_queue(QueueName=AppSettings.live_streams_queue_name)

    yield

    mock.stop()


@pytest.fixture
def container():
    container = Container()
    # container.config.from_pydantic(Settings(_env_file=".env.test"))  # type: ignore
    # container.wire(modules=[__name__])
    # print(container.config.dynamodb_endpoint_url())
    # print(AppSettings.endpoint_url)
    return container
