from fastapi import APIRouter
from loguru import logger

from app.adapter.api.exceptions import InternalServerError
from app.adapter.api.v1.schemas.live_channel import LiveChannelsResponse
from app.core.settings import AppSettings
from app.usecases.live_channel.active_live_channel_interactor import ActiveLiveChannelInteractor

router = APIRouter(prefix="/live-channel", tags=[AppSettings.api_v1_prefix, "live-channels"])


@router.get("", response_model=LiveChannelsResponse)
async def list_live_channels():
    usecase = ActiveLiveChannelInteractor()
    try:
        return usecase.execute()
    except Exception as e:
        logger.error(f"Error: {e}")
        raise InternalServerError()
