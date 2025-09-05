import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_nested_delimiter="_", env_nested_max_split=1, extra="ignore")

    seed_path: str = str(Path(Path(__file__).parents[1], "infrastructure/seed/"))

    project_name: str = "OtenkiLive"
    env: str = os.environ.get("ENV", "dev")
    env_suffix: str = "" if env == "prod" else f"-{env}"

    cors: str = "http://localhost:3000"
    api_v1_prefix: str = "/api/v1"

    """
    AWS Settings
    """
    aws_region: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    aws_session_token: str | None = None
    endpoint_url: str | None = None

    """
    DynamoDB Settings
    """
    dynamodb_billing_mode: str | None = "PAY_PER_REQUEST"
    dynamodb_tags: dict[str, str] = {"Environment": env, "Project": "otenki-live"}

    weather_forecast_ttl_days: int = 7
    weather_hourly_forecast_ttl_days: int = 7

    """
    SES Settings
    """
    contact_from_address: str = "GREENSTUDIO <app@greenstudio.jp>"

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

    """
    Recaptcha Settings
    """
    recaptcha_site_key: str | None = None
    recaptcha_action: str = "contact"

    """
    GCP Settings
    """
    gcp_project_id: str | None = None
    gcp_project_number: str | None = None
    gcp_service_account_email: str | None = None
    gcp_pool_id: str | None = None
    gcp_provider_id: str | None = None


class APIConfig:
    jma_api_base_url: str = "https://www.jma.go.jp/bosai/"
    jma_forecast_regions: list[str] = [
        "sapporo",
        "miyagi",
        "tokyo",
        "niigata",
        "aichi",
        "osaka",
        "hiroshima",
        "kochi",
        "fukuoka",
        "okinawa",
    ]


AppSettings = (
    Settings(_env_file=f".env.{os.environ.get('ENV', 'dev')}") if os.environ.get("ENV") != "prod" else Settings()  # type: ignore
)
AppAPIConfig = APIConfig()
