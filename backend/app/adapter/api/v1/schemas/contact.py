from pydantic import BaseModel, EmailStr, Field

from app.adapter.api.v1.schemas.base import ResponseStatus


class ContactInput(BaseModel):
    name: str = Field(max_length=100)
    email: EmailStr
    message: str = Field(max_length=10000)


class ContactResponse(BaseModel):
    status: ResponseStatus
