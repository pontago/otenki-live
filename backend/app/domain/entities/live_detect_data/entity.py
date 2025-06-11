from datetime import datetime

from app.domain.entities.live_detect_data.detect_object import DetectObject


class LiveDetectData(DetectObject):
    channel_id: str
    created_at: datetime
