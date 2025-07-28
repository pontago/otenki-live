from datetime import datetime

from pydantic import BaseModel

from app.adapter.api.v1.schemas.base import BaseResponse


class LiveChannel(BaseModel):
    name: str
    url: str


class LiveDetectData(BaseModel):
    date_time: datetime
    person: int
    umbrella: int
    tshirt: int
    long_sleeve: int


class LiveChannelsResponse(BaseResponse):
    data: list[LiveChannel]
