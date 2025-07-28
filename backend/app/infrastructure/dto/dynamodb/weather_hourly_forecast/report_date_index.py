from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex

from app.infrastructure.dto.dynamodb.pynamodb_model import PynamoDBModel


class ReportDateIndex(GlobalSecondaryIndex):
    class Meta(PynamoDBModel.Meta):
        index_name = "ReportDateIndex"
        projection = AllProjection()

    pk = UnicodeAttribute(hash_key=True)
    report_date_time = UTCDateTimeAttribute(range_key=True)
