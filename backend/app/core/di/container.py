from core.settings import Settings
from dependency_injector import containers, providers
from infrastructure.repositories.jma.repository import JmaRepository
from infrastructure.repositories.weather_forecast.repository import WeatherForecastRepository


class Container(containers.DeclarativeContainer):
    config = providers.Configuration(pydantic_settings=[Settings()])

    weather_forecast_repository = providers.Factory(WeatherForecastRepository)
    jma_repository = providers.Factory(providers.Singleton(JmaRepository))
