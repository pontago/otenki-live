from pynamodb.attributes import NumberAttribute, UnicodeAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex

from app.infrastructure.dto.dynamodb.pynamodb_model import PynamoDBModel


class AreaIndex(GlobalSecondaryIndex):
    class Meta(PynamoDBModel.Meta):
        index_name = "AreaIndex"
        projection = AllProjection()

    area_code = UnicodeAttribute(hash_key=True)
    is_active = NumberAttribute(range_key=True)
