from datetime import UTC, datetime
from pathlib import Path

import yaml

from app.core.settings import AppSettings
from app.domain.entities.live_channel.entity import LiveChannel
from app.domain.entities.live_channel.live_channel_status import LiveChannelStatus
from app.domain.repositories.live_channel_repository import ILiveChannelRepository
from app.infrastructure.dto.dynamodb.live_channel.model import LiveChannelDto
from app.infrastructure.mappers.live_channel_mapper import to_dto, to_entity


class LiveChannelRepository(ILiveChannelRepository):
    def __init__(self):
        if not LiveChannelDto.exists():
            LiveChannelDto.create_table(wait=True, billing_mode=AppSettings.dynamodb_billing_mode)
            self.seed_loader()

    def seed_loader(self):
        items = yaml.safe_load(Path(AppSettings.seed_path, "live_channel.yaml").read_text())

        for item in items:
            LiveChannelDto(**item).save()

    def get_active_channels(self) -> list[LiveChannel]:
        dtos = LiveChannelDto.active_index.query(int(True))
        results: list[LiveChannel] = [to_entity(dto) for dto in dtos]
        return results

    def save(self, data: LiveChannel):
        dto = to_dto(data)
        dto.updated_at = datetime.now(UTC)
        dto.save()

    def get_channels(self, channel_ids: list[str], status: LiveChannelStatus) -> list[LiveChannel]:
        dtos = LiveChannelDto.status_index.query(
            hash_key=status.value, filter_condition=LiveChannelDto.pk.is_in(*channel_ids)
        )
        results: list[LiveChannel] = [to_entity(dto) for dto in dtos]
        return results

    def update_status(self, data: LiveChannel | list[LiveChannel]):
        if isinstance(data, LiveChannel):
            data = [data]
        for channel in data:
            to_dto(channel).update(
                actions=[
                    LiveChannelDto.status.set(channel.status.value),
                    LiveChannelDto.updated_at.set(datetime.now(UTC)),
                ]
            )
