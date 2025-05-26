from pynamodb.attributes import NumberAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex

from app.infrastructure.dto.dynamodb.pynamodb_model import PynamoDBModel


class StatusIndex(GlobalSecondaryIndex):
    class Meta(PynamoDBModel.Meta):
        index_name = "StatusIndex"
        projection = AllProjection()

    status = NumberAttribute(hash_key=True)
