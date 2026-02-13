from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger
from mangum import Mangum

from app.adapter.api.v1.endpoints import area, contact, forecast, live_channel
from app.adapter.api.v1.schemas.base import ResponseStatus
from app.core.di.container import Container
from app.core.settings import AppSettings
from app.core.translations.translation import translate

container = Container()
container.wire(modules=[__name__, forecast, contact, live_channel, area])


app = FastAPI(title=AppSettings.project_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=AppSettings.cors.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    try:
        translated_errors = translate(list(exc.errors()))
    except Exception as e:
        logger.error(e)
        translated_errors = list(exc.errors())

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={"detail": translated_errors},
    )


@app.get("/")
async def root():
    return {"status": ResponseStatus.SUCCESS}


app.include_router(forecast.router, prefix=AppSettings.api_v1_prefix)
app.include_router(contact.router, prefix=AppSettings.api_v1_prefix)
app.include_router(live_channel.router, prefix=AppSettings.api_v1_prefix)
app.include_router(area.router, prefix=AppSettings.api_v1_prefix)

handler = Mangum(app)
