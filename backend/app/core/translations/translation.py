from pydantic_core import ErrorDetails

from app.core.translations.messages import ERROR_MESSAGES

DEFAULT_LOCALE = "ja_JP"


def translate(validation_errors: list[ErrorDetails], locale: str = DEFAULT_LOCALE) -> list[ErrorDetails]:
    new_errors: list[ErrorDetails] = []

    try:
        error_messages = ERROR_MESSAGES[locale]
    except KeyError:
        return validation_errors

    for error in validation_errors:
        message: str | None = None
        keys = [error["type"], error["msg"], error["msg"].split(":")[0]]
        for key in keys:
            if error_messages.get(key):
                message = error_messages.get(key)
                break

        if message:
            ctx = error.get("ctx")
            if ctx:
                error["msg"] = message.format(**ctx)

        if isinstance(error["input"], bytes):
            error["input"] = error["input"].decode("utf-8")

        new_errors.append(error)

    return new_errors
