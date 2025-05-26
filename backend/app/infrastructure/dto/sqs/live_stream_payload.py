from datetime import datetime

from pydantic import BaseModel


class LiveStreamPayload(BaseModel):
    channel_id: str
    processed_at: datetime
