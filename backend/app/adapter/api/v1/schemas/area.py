from pydantic import BaseModel

from app.adapter.api.v1.schemas.base import BaseResponse


class Area(BaseModel):
    area_code: str
    area_name: str
    region_code: str
    region_name: str


class AreasResponse(BaseResponse):
    data: list[Area]
