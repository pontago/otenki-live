from datetime import datetime
from typing import Self

from pydantic import BaseModel

from app.domain.entities.live_channel.live_channel_status import LiveChannelStatus


class LiveChannel(BaseModel):
    channel_id: str
    is_active: bool
    area_code: str
    name: str
    status: LiveChannelStatus
    processed_at: datetime
    updated_at: datetime

    def inProcessing(self) -> Self:
        self.status = LiveChannelStatus.PROCESSING
        return self

    def inactive(self) -> Self:
        self.status = LiveChannelStatus.NONE
        return self

    def failed(self) -> Self:
        self.status = LiveChannelStatus.FAILED
        return self
