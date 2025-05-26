from pynamodb.attributes import NumberAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex

from app.infrastructure.dto.dynamodb.pynamodb_model import PynamoDBModel


class ActiveIndex(GlobalSecondaryIndex):
    class Meta(PynamoDBModel.Meta):
        index_name = "ActiveIndex"
        projection = AllProjection()

    is_active = NumberAttribute(hash_key=True)
