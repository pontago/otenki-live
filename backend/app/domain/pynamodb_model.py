from core.settings import AppSettings
from pynamodb.models import Model


class PynamoDBModel(Model):
    class Meta:
        region = AppSettings.region_name
        host = AppSettings.dynamodb_endpoint_url
        aws_access_key_id = AppSettings.aws_access_key_id
        aws_secret_access_key = AppSettings.aws_secret_access_key
        billing_mode = AppSettings.dynamodb_billing_mode
