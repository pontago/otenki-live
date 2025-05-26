from pathlib import Path

import yaml

from app.core.settings import AppSettings
from app.domain.repositories.live_channel_repository import ILiveChannelRepository
from app.infrastructure.dto.dynamodb.live_channel.model import LiveChannelDto


class LiveChannelRepository(ILiveChannelRepository):
    def __init__(self):
        if not LiveChannelDto.exists():
            LiveChannelDto.create_table(wait=True)
            self.seed_loader()

    def seed_loader(self):
        items = yaml.safe_load(Path(AppSettings.seed_path, "live_channel.yaml").read_text())

        for item in items:
            LiveChannelDto(**item).save()

    def get_active_channels(self) -> list[LiveChannelDto]:
        return list(LiveChannelDto.active_index.query(int(True)))

    def add_channel(self, live_channel: LiveChannelDto):
        live_channel.save()
