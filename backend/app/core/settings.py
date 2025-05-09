from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_nested_delimiter="_", env_nested_max_split=1)

    region_name: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None

    dynamodb_endpoint_url: str | None = None
    dynamodb_billing_mode: str | None = None


class APIConfig:
    jma_api_base_url: str = "https://www.jma.go.jp/bosai/"


AppSettings = Settings()
AppAPIConfig = APIConfig()
