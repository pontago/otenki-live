from app.core.exceptions import AppError


class InfraError(AppError):
    pass


class RequestError(InfraError):
    pass


class ResponseInvalidError(InfraError):
    pass


class SQSGetQueueError(InfraError):
    pass


class SQSSendMessageError(InfraError):
    pass
