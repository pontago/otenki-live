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


class SESSendmailError(InfraError):
    pass


class SESTemplateNotFoundError(InfraError):
    pass


class LiveStreamFFmpegError(InfraError):
    pass


class LiveStreamGetInfoError(InfraError):
    pass


class ModelPathNotSetError(InfraError):
    pass


class ModelDownloadError(InfraError):
    pass


class CookiePathNotSetError(InfraError):
    pass


class CookieDownloadError(InfraError):
    pass


class AreaNotFoundError(InfraError):
    pass
