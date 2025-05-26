from datetime import datetime

from pydantic import BaseModel


class PopData(BaseModel):
    date_time: datetime
    pop: int
