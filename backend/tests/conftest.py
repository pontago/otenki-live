import os
from pathlib import Path

os.environ["ENV"] = "test"

import boto3
import pytest
from moto import mock_aws

from app.core.di.container import Container
from app.core.settings import AppSettings


@pytest.fixture(scope="session", autouse=True)
def setup():
    pass
    # AppSettings.dynamodb_endpoint_url = ""
    # AppSettings = Settings(_env_file=".env.test")  # type: ignore
    # AppSettings = Settings(_env_file=".env.test")  # type: ignore
    # print(AppSettings.dict())
    # print(AppSettings.dynamodb_endpoint_url)


@mock_aws
@pytest.fixture(scope="session", autouse=True)
def mock_dynamodb():
    from app.infrastructure.dto.dynamodb.live_channel.model import LiveChannelDto
    from app.infrastructure.dto.dynamodb.live_detect_data.model import LiveDetectDataDto
    from app.infrastructure.dto.dynamodb.weather_forecast.model import WeatherForecastDto

    mock = mock_aws()
    mock.start()

    if not WeatherForecastDto.exists():
        WeatherForecastDto.create_table(wait=True)

    if not LiveChannelDto.exists():
        LiveChannelDto.create_table(wait=True)

    if not LiveDetectDataDto.exists():
        LiveDetectDataDto.create_table(wait=True)

    sqs = boto3.client("sqs", region_name=AppSettings.region_name)
    sqs.create_queue(QueueName=AppSettings.live_streams_queue_name)

    s3 = boto3.client("s3", region_name=AppSettings.region_name)
    s3.create_bucket(Bucket=AppSettings.bucket_name)

    # assert AppSettings.classification_model_weights_path is not None
    assert AppSettings.detection_model_weights_path is not None
    assert AppSettings.clothing_model_weights_path is not None
    assert AppSettings.youtube_cookies_path is not None

    base_path = Path.cwd() / Path("tests/data")
    detection_model_path = base_path / AppSettings.detection_model_weights_path
    clothing_model_path = base_path / AppSettings.clothing_model_weights_path

    if AppSettings.classification_model_weights_path:
        classification_model_path = base_path / AppSettings.classification_model_weights_path
        s3.upload_file(
            Filename=str(classification_model_path),
            Bucket=AppSettings.bucket_name,
            Key=AppSettings.classification_model_weights_path,
        )

    s3.upload_file(
        Filename=str(detection_model_path), Bucket=AppSettings.bucket_name, Key=AppSettings.detection_model_weights_path
    )
    s3.upload_file(
        Filename=str(clothing_model_path), Bucket=AppSettings.bucket_name, Key=AppSettings.clothing_model_weights_path
    )

    youtube_cookies_path = base_path / AppSettings.youtube_cookies_path
    s3.upload_file(
        Filename=str(youtube_cookies_path),
        Bucket=AppSettings.bucket_name,
        Key=AppSettings.youtube_cookies_path,
    )

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
