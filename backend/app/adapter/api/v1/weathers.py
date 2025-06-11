from fastapi import APIRouter

from app.core.settings import AppSettings

router = APIRouter(prefix="/weathers", tags=[AppSettings.api_v1_prefix, "weathers"])


@router.get("/")
async def list_weathers():
    return {"message": "Hello World"}
