from pynamodb.models import Model

from app.core.settings import AppSettings


class PynamoDBModel(Model):
    class Meta:
        region = AppSettings.region_name
        host = AppSettings.endpoint_url
        aws_access_key_id = AppSettings.aws_access_key_id
        aws_secret_access_key = AppSettings.aws_secret_access_key
        aws_session_token = AppSettings.aws_session_token
        billing_mode = AppSettings.dynamodb_billing_mode
        tags = AppSettings.dynamodb_tags
