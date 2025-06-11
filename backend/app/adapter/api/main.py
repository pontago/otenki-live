from fastapi import FastAPI

from app.adapter.api.v1 import weathers
from app.core.settings import AppSettings

app = FastAPI(title=AppSettings.project_name)


@app.get("/")
async def root():
    return {"status": "ok"}


app.include_router(weathers.router, prefix=AppSettings.api_v1_prefix)
