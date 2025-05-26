from datetime import UTC, datetime
from typing import Any

from pynamodb.expressions.condition import Condition
from pynamodb.models import Model

from app.core.settings import AppSettings


class PynamoDBModel(Model):
    class Meta:
        region = AppSettings.region_name
        host = AppSettings.dynamodb_endpoint_url
        aws_access_key_id = AppSettings.aws_access_key_id
        aws_secret_access_key = AppSettings.aws_secret_access_key
        billing_mode = AppSettings.dynamodb_billing_mode

    def save(self, condition: Condition | None = None, *, add_version_condition: bool = True) -> dict[str, Any]:
        attrs = self.get_attributes()
        if attrs.get("updated_at"):
            self.updated_at = datetime.now(UTC)
        return super().save(condition=condition, add_version_condition=add_version_condition)
