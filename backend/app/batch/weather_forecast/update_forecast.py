def update_forecast():
    from datetime import date

    from infrastructure.repositories.weather_forecast.mock_repository import MockWeatherForecastRepository
    from usecases.weather_forecast.interactor import WeatherForecastInteractor

    repository = MockWeatherForecastRepository()
    usecase = WeatherForecastInteractor(repository)

    print(usecase.get_forcast("13000000", date(2025, 3, 10)))
