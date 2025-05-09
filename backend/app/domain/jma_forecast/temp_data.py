from dataclasses import dataclass
from datetime import datetime


@dataclass
class TempData:
    date_time: datetime
    max: int
    min: int
