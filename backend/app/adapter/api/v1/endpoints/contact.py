import traceback

from fastapi import APIRouter
from loguru import logger

from app.adapter.api.exceptions import InternalServerError
from app.adapter.api.v1.schemas.base import ResponseStatus
from app.adapter.api.v1.schemas.contact import ContactInput, ContactResponse
from app.core.settings import AppSettings
from app.infrastructure.exceptions import RecaptchaVerificationError
from app.usecases.contact.contact_interactor import ContactInteractor

router = APIRouter(prefix="/contact", tags=[AppSettings.api_v1_prefix, "contact"])


@router.post("", response_model=ContactResponse)
async def post(contact: ContactInput):
    usecase = ContactInteractor()
    try:
        message_ids = usecase.execute(contact)
        if len(message_ids) == 0:
            raise InternalServerError()

        return ContactResponse(status=ResponseStatus.SUCCESS, message="")
    except RecaptchaVerificationError:
        return ContactResponse(status=ResponseStatus.ERROR, message="reCAPTCHAの検証に失敗しました")
    except Exception as e:
        logger.error(f"Error: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise InternalServerError()
