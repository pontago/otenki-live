from fastapi import APIRouter
from loguru import logger

from app.adapter.api.exceptions import InternalServerError, NotFoundError
from app.adapter.api.v1.schemas.forecast import RegionalWeatherResponse, WeatherResponse, WeathersResponse
from app.core.settings import AppSettings
from app.infrastructure.exceptions import AreaNotFoundError
from app.usecases.exceptions import WeatherForecastNotFoundError
from app.usecases.weather_forecast.detailed_forecast_interactor import DetailedForecastInteractor
from app.usecases.weather_forecast.prefecture_forecast_interactor import PrefectureForecastInteractor
from app.usecases.weather_forecast.regional_forecast_interactor import RegionalForecastInteractor

router = APIRouter(prefix="/forecast", tags=[AppSettings.api_v1_prefix, "forecasts"])


@router.get("/", response_model=RegionalWeatherResponse)
async def list_regional_forecasts():
    usecase = RegionalForecastInteractor()
    try:
        return await usecase.execute()
    except (WeatherForecastNotFoundError, AreaNotFoundError):
        raise InternalServerError()
    except Exception as e:
        logger.error(f"Error: {e}")
        raise InternalServerError()


@router.get("/{region_code}", response_model=WeathersResponse)
async def list_prefecture_forecasts(region_code: str):
    usecase = PrefectureForecastInteractor()
    try:
        return await usecase.execute(region_code)
    except (WeatherForecastNotFoundError, AreaNotFoundError):
        raise NotFoundError()
    except Exception as e:
        logger.error(f"Error: {e}")
        raise InternalServerError()


@router.get("/{region_code}/{area_code}", response_model=WeatherResponse)
async def get_detailed_forecast(region_code: str, area_code: str):
    usecase = DetailedForecastInteractor()
    try:
        return await usecase.execute(area_code)
    except (WeatherForecastNotFoundError, AreaNotFoundError):
        raise NotFoundError()
    except Exception as e:
        logger.error(f"Error: {e}")
        raise InternalServerError()
