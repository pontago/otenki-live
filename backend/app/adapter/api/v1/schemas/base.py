from enum import Enum
from typing import Any

from pydantic import BaseModel


class ResponseStatus(Enum):
    SUCCESS = "success"
    ERROR = "error"


class BaseResponse(BaseModel):
    status: ResponseStatus
    meta: dict[str, Any] | None = None
    data: Any


class ErrorResponse(BaseModel):
    status: ResponseStatus
    message: str
