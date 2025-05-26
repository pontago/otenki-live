import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_nested_delimiter="_", env_nested_max_split=1)

    seed_path: str = str(Path(Path(__file__).parents[1], "infrastructure/seed/"))

    region_name: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None

    """
    DynamoDB Settings
    """
    dynamodb_endpoint_url: str | None = None
    dynamodb_billing_mode: str | None = None

    weather_forecast_ttl_days: int = 30

    """
    SQS Queue Settings
    """
    live_streams_queue_name: str = (
        "otenki-live-queue-live-streams" + "" if os.environ.get("ENV", "prod") else f"-{os.environ.get('ENV')}"
    )


class APIConfig:
    jma_api_base_url: str = "https://www.jma.go.jp/bosai/"


AppSettings = Settings(_env_file=".env.test") if os.environ.get("ENV", "dev") == "test" else Settings()  # type: ignore
AppAPIConfig = APIConfig()


# @lru_cache
# def AppSettings() -> Settings:
#     print(os.environ.get("ENV", "dev"))
#     return
