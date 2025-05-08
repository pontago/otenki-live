from pydantic_settings import BaseSettings, SettingsConfigDict


class DynamoDBSettings(BaseSettings):
    endpoint_url: str
    region_name: str
    aws_access_key_id: str
    aws_secret_access_key: str


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_nested_delimiter="_", env_nested_max_split=1)

    dynamodb: DynamoDBSettings
