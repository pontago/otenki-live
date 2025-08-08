from dependency_injector.wiring import Provide, inject

from app.adapter.api.v1.schemas.area import Area, AreasResponse
from app.adapter.api.v1.schemas.base import ResponseStatus
from app.core.di.container import Container
from app.domain.repositories.jma_repository import IJmaRepository


@inject
class ListAreaInteractor:
    def __init__(
        self,
        jma_repository: IJmaRepository = Provide[Container.jma_repository],
    ):
        self.jma_repository = jma_repository

    def execute(self) -> AreasResponse:
        areas = self.jma_repository.get_forecast_areas()
        return AreasResponse(
            status=ResponseStatus.SUCCESS,
            meta={"count": len(areas)},
            data=[
                Area(
                    **area.model_dump(),
                )
                for area in areas
            ],
        )
