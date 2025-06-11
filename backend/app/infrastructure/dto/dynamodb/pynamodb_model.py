from pynamodb.models import Model

from app.core.settings import AppSettings


class PynamoDBModel(Model):
    class Meta:
        region = AppSettings.region_name
        host = AppSettings.endpoint_url
        # aws_access_key_id = AppSettings.aws_access_key_id
        # aws_secret_access_key = AppSettings.aws_secret_access_key
        billing_mode = AppSettings.dynamodb_billing_mode
        tags = AppSettings.dynamodb_tags

    # updated_at = UTCDateTimeAttribute()

    # def update(
    #     self, actions: list[Action], condition: Condition | None = None, *, add_version_condition: bool = True
    # ) -> Any:
    #     if actions is None:
    #         actions = []

    #     if not getattr(self, "updated_at", None):
    #         actions.append(self.updated_at.set(datetime.now(UTC)))  # type: ignore

    #     return super().update(actions=actions, condition=condition, add_version_condition=add_version_condition)

    # def save(self, condition: Condition | None = None, *, add_version_condition: bool = True) -> dict[str, Any]:
    #     if not getattr(self, "updated_at", None):
    #         self.updated_at = datetime.now(UTC)
    #     return super().save(condition=condition, add_version_condition=add_version_condition)
