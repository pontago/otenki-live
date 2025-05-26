import boto3
from dependency_injector import containers, providers

from app.core.settings import Settings
from app.infrastructure.repositories.jma_repository import JmaRepository
from app.infrastructure.repositories.live_channel_repository import LiveChannelRepository
from app.infrastructure.repositories.sqs_repository import SQSRepository
from app.infrastructure.repositories.weather_forecast_repository import WeatherForecastRepository


class Container(containers.DeclarativeContainer):
    config = providers.Configuration(pydantic_settings=[Settings()])

    session = providers.Resource(
        boto3.session.Session,
        aws_access_key_id=config.aws_access_key_id,
        aws_secret_access_key=config.aws_secret_access_key,
        region_name=config.region_name,
    )

    weather_forecast_repository = providers.Factory(WeatherForecastRepository)
    jma_repository = providers.Factory(JmaRepository)
    live_channel_repository = providers.Factory(LiveChannelRepository)
    sqs_repository = providers.Factory(SQSRepository, session=session)
