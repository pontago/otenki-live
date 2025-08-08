from fastapi import APIRouter
from loguru import logger

from app.adapter.api.exceptions import InternalServerError
from app.adapter.api.v1.schemas.area import AreasResponse
from app.core.settings import AppSettings
from app.infrastructure.exceptions import AreaNotFoundError
from app.usecases.area.list_area_interactor import ListAreaInteractor
from app.usecases.exceptions import WeatherForecastNotFoundError

router = APIRouter(prefix="/area", tags=[AppSettings.api_v1_prefix, "areas"])


@router.get("/", response_model=AreasResponse)
async def list_areas():
    usecase = ListAreaInteractor()
    try:
        return usecase.execute()
    except (WeatherForecastNotFoundError, AreaNotFoundError):
        raise InternalServerError()
    except Exception as e:
        logger.error(f"Error: {e}")
        raise InternalServerError()
