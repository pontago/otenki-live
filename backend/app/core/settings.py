import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env.dev", env_nested_delimiter="_", env_nested_max_split=1)

    seed_path: str = str(Path(Path(__file__).parents[1], "infrastructure/seed/"))

    project_name: str = "OtenkiLive"
    env: str = "dev"
    env_suffix: str = "" if env == "prod" else f"-{env}"

    api_v1_prefix: str = "/api/v1"

    """
    AWS Settings
    """
    region_name: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    endpoint_url: str | None = None

    """
    DynamoDB Settings
    """
    dynamodb_billing_mode: str | None = "PAY_PER_REQUEST"
    dynamodb_tags: dict[str, str] = {"Environment": env, "Project": "otenki-live"}

    weather_forecast_ttl_days: int = 30

    """
    SQS Queue Settings
    """
    live_streams_queue_name: str = "otenki-live-queue-live-streams" + env_suffix

    """
    Storage Settings
    """
    bucket_name: str = "otenki-live-backend" + env_suffix
    storage_dir: str = "/tmp"
    youtube_cookies_path: str | None = None

    """
    ML Settings
    """
    classification_model_weights_path: str | None = None
    detection_model_weights_path: str | None = None
    clothing_model_weights_path: str | None = None
    clothing_classes: list[str] = ["jacket", "long_sleeve", "outer", "tshirt"]
    clothing_confidence_thresholds: float = 0.6


class APIConfig:
    jma_api_base_url: str = "https://www.jma.go.jp/bosai/"


AppSettings = (
    Settings(_env_file=f".env.{os.environ.get('ENV', 'dev')}") if os.environ.get("ENV") != "prod" else Settings()  # type: ignore
)
AppAPIConfig = APIConfig()

# print(os.environ.get("ENV", "dev"))
# print(AppSettings.endpoint_url)
# print(AppSettings.model_dump_json)

# @lru_cache
# def AppSettings() -> Settings:
#     print(os.environ.get("ENV"))
#     if os.environ.get("ENV", "dev") == "test":
#         return Settings(_env_file=".env.test")  # type: ignore
#     return Settings()
