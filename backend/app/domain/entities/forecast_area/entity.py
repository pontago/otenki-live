from pydantic import BaseModel


class ForecastArea(BaseModel):
    area_id: str
    area_code: str
    area_name: str
    area_spot_id: str
    week_id: str
    region_code: str
    region_name: str
    amedas_code: str
