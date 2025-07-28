import boto3
from dependency_injector import containers, providers

from app.core.settings import Settings
from app.infrastructure.repositories.jma_repository import JmaRepository
from app.infrastructure.repositories.live_channel_repository import LiveChannelRepository
from app.infrastructure.repositories.live_detect_repository import LiveDetectRepository
from app.infrastructure.repositories.live_stream_repository import LiveStreamRepository
from app.infrastructure.repositories.ses_repository import SESRepository
from app.infrastructure.repositories.sqs_repository import SQSRepository
from app.infrastructure.repositories.storage_repository import StorageRepository
from app.infrastructure.repositories.weather_forecast_repository import WeatherForecastRepository
from app.usecases.services.weather_forecast_service import WeatherForecastService


class Container(containers.DeclarativeContainer):
    config = providers.Configuration(pydantic_settings=[Settings()])

    session = providers.Resource(
        boto3.session.Session,
        aws_access_key_id=config.aws_access_key_id if config.aws_access_key_id else None,
        aws_secret_access_key=config.aws_secret_access_key if config.aws_secret_access_key else None,
        region_name=config.region_name,
    )

    weather_forecast_repository = providers.Factory(WeatherForecastRepository)
    jma_repository = providers.Factory(JmaRepository)
    live_channel_repository = providers.Factory(LiveChannelRepository)
    sqs_repository = providers.Factory(SQSRepository, session=session)
    ses_repository = providers.Factory(SESRepository, session=session)
    live_stream_repository = providers.Factory(LiveStreamRepository)
    live_detect_repository = providers.Factory(LiveDetectRepository)
    storage_repository = providers.Factory(StorageRepository, session=session)

    weather_forecast_service = providers.Factory(
        WeatherForecastService,
        weather_forecast_repository=weather_forecast_repository,
        jma_repository=jma_repository,
        live_channel_repository=live_channel_repository,
        live_detect_repository=live_detect_repository,
    )
