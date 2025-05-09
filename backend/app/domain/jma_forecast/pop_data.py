from dataclasses import dataclass
from datetime import datetime


@dataclass
class PopData:
    date_time: datetime
    pop: int
