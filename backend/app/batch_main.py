import boto3
import typer
from boto3.dynamodb.conditions import Key

app = typer.Typer()


@app.command()
def main():
    dynamodb = boto3.resource(
        "dynamodb",
        region_name="ap-northeast-1",
        endpoint_url="http://localhost:8000",
        aws_access_key_id="dummy",
        aws_secret_access_key="dummy",
    )
    # dynamodb.create_table(
    #     TableName="WeatherForecast",
    #     KeySchema=[{"AttributeName": "area", "KeyType": "HASH"}, {"AttributeName": "date", "KeyType": "RANGE"}],
    #     AttributeDefinitions=[
    #         {"AttributeName": "area", "AttributeType": "S"},
    #         {"AttributeName": "date", "AttributeType": "S"},
    #     ],
    #     ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
    # )

    table = dynamodb.Table("WeatherForecast")

    table.put_item(
        Item={
            "area": "101",
            "date": "2025-03-10#2025-04-30T12:00:00",
        },
    )
    table.put_item(
        Item={
            "area": "101",
            "date": "2025-03-11#2025-04-30T13:00:00",
        },
    )

    response = table.query(
        KeyConditionExpression=Key("area").eq("101"),
        ScanIndexForward=False,
        Limit=1,
    )
    items = response.get("Items", [])
    print(items)


@app.command()
def update_forecast():
    from batch.weather_forecast.update_forecast import update_forecast

    update_forecast()


if __name__ == "__main__":
    app()
