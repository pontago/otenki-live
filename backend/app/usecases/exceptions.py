from app.core.exceptions import AppError


class UsecaseError(AppError):
    pass


class WeatherForecastNotFoundError(UsecaseError):
    pass
