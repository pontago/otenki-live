import asyncio
from datetime import datetime, timedelta

from app.adapter.api.v1.schemas.forecast import (
    HourlyWeatherForecast,
    LiveChannel,
    LiveDetectData,
    PopData,
    RegionalWeather,
    WeatherForecast,
)
from app.core.utils import parallel
from app.domain.entities.forecast_area.entity import ForecastArea
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast
from app.domain.repositories.jma_repository import IJmaRepository
from app.domain.repositories.live_channel_repository import ILiveChannelRepository
from app.domain.repositories.live_detect_repository import ILiveDetectRepository
from app.domain.repositories.weather_forecast_repository import IWeatherForecastRepository
from app.usecases.exceptions import WeatherForecastNotFoundError


class WeatherForecastService:
    def __init__(
        self,
        weather_forecast_repository: IWeatherForecastRepository,
        jma_repository: IJmaRepository,
        live_channel_repository: ILiveChannelRepository,
        live_detect_repository: ILiveDetectRepository,
    ):
        self.weather_forecast_repository = weather_forecast_repository
        self.jma_repository = jma_repository
        self.live_channel_repository = live_channel_repository
        self.live_detect_repository = live_detect_repository

    async def get_regional_forecasts(self) -> list[RegionalWeather]:
        forecast_areas = self.jma_repository.get_forecast_regions()
        # results = asyncio.run(self._get_regional_weathers_async(forecast_areas))
        results = await self._get_regional_weathers_async(forecast_areas)
        regional_forecasts = [result for result in results if result is not None]
        regional_forecasts.sort(key=lambda item: item.weather_forecast.area_id)
        return regional_forecasts

    async def get_forecasts(self, region_code: str) -> list[WeatherForecast]:
        forecast_areas = self.jma_repository.get_forecast_areas_with_region_code(region_code)
        results = await self._get_regional_weathers_async(forecast_areas)
        forecasts = [result.weather_forecast for result in results if result is not None]
        forecasts.sort(key=lambda item: item.area_id)
        return forecasts

    async def get_forecast(
        self, area_code: str
    ) -> tuple[WeatherForecast, list[WeatherForecast], list[HourlyWeatherForecast], list[LiveDetectData]]:
        forecast_area = self.jma_repository.get_forecast_area_with_area_code(area_code)
        (
            forecast,
            daily_forecasts,
            hourly_forecasts,
            object_detections,
        ) = await self._get_forecast_async(forecast_area)
        return forecast.weather_forecast, daily_forecasts, hourly_forecasts, object_detections

    def _get_daily_forecasts(self, forecast_area: ForecastArea) -> list[WeatherForecast]:
        results: list[WeatherForecast] = []
        now = datetime.now().date()

        for i in range(1, 6):
            forecasts = self.weather_forecast_repository.get_forecasts(
                area_id=forecast_area.area_id, date=now + timedelta(days=i), limit=1
            )
            if forecasts and len(forecasts) > 0:
                weather_forecast = self._jma_forecast_to_weather_forecast(forecast_area, forecasts)
                results.append(weather_forecast)

        return results

    def _get_hourly_forecasts(self, forecast_area: ForecastArea) -> list[HourlyWeatherForecast]:
        forecasts = self.weather_forecast_repository.get_latest_hourly_forecasts(
            area_id=forecast_area.area_id, limit=10
        )
        return [
            HourlyWeatherForecast(
                date_time=forecast.date_time,
                weather_code=forecast.weather_code,
                weather_name=self.jma_repository.get_weather_name(forecast.weather_code),
                temp=forecast.temp,
            )
            for forecast in sorted(forecasts, key=lambda item: item.date_time)
        ]

    def _get_current_hourly_forecast(self, forecast_area: ForecastArea) -> HourlyWeatherForecast:
        forecast = self.weather_forecast_repository.get_current_hourly_forecast(forecast_area.area_id)
        return HourlyWeatherForecast(
            date_time=forecast.date_time,
            weather_code=forecast.weather_code,
            weather_name=self.jma_repository.get_weather_name(forecast.weather_code),
            temp=forecast.temp,
        )

    def _get_object_detections(self, forecast_area: ForecastArea) -> list[LiveDetectData]:
        live_channels = self.live_channel_repository.get_active_channels_by_area(forecast_area.area_code)
        if len(live_channels) > 0:
            latest_live_detects = self.live_detect_repository.get_latest_detections(
                live_channels[0].channel_id, limit=10
            )
            if latest_live_detects:
                return [
                    LiveDetectData(
                        date_time=live_detect.created_at,
                        person=live_detect.person,
                        umbrella=live_detect.umbrella,
                        tshirt=live_detect.tshirt,
                        long_sleeve=live_detect.long_sleeve,
                    )
                    for live_detect in latest_live_detects
                ]
        return []

    def _get_regional_weather(self, forecast_area: ForecastArea) -> RegionalWeather:
        forecasts = self.weather_forecast_repository.get_forecasts(
            area_id=forecast_area.area_id, date=datetime.now().date(), limit=3
        )
        if len(forecasts) == 0:
            raise WeatherForecastNotFoundError

        live_channel: LiveChannel | None = None
        live_detect_data: LiveDetectData | None = None
        live_channels = self.live_channel_repository.get_active_channels_by_area(forecast_area.area_code)
        if len(live_channels) > 0:
            live_channel = LiveChannel(name=live_channels[0].name, url=live_channels[0].stream_url())
            latest_live_detect = self.live_detect_repository.get_latest_data(live_channels[0].channel_id)
            if latest_live_detect:
                live_detect_data = LiveDetectData(
                    date_time=latest_live_detect.created_at,
                    person=latest_live_detect.person,
                    umbrella=latest_live_detect.umbrella,
                    tshirt=latest_live_detect.tshirt,
                    long_sleeve=latest_live_detect.long_sleeve,
                )

        current_hourly_forecast = self.weather_forecast_repository.get_current_hourly_forecast(forecast_area.area_id)

        weather_forecast = self._jma_forecast_to_weather_forecast(forecast_area, forecasts, current_hourly_forecast)
        weather_forecast.live_channel = live_channel
        weather_forecast.live_detect_data = live_detect_data

        return RegionalWeather(
            region_code=forecast_area.region_code,
            region_name=forecast_area.region_name,
            weather_forecast=weather_forecast,
        )

    async def _get_regional_weathers_async(self, forecast_areas: list[ForecastArea]) -> list[RegionalWeather]:
        return await parallel(
            [asyncio.to_thread(self._get_regional_weather, forecast_area) for forecast_area in forecast_areas],
            concurrency=10,
        )

    async def _get_forecast_async(
        self, forecast_area: ForecastArea
    ) -> tuple[RegionalWeather, list[WeatherForecast], list[HourlyWeatherForecast], list[LiveDetectData]]:
        return await asyncio.gather(
            asyncio.to_thread(self._get_regional_weather, forecast_area),
            asyncio.to_thread(self._get_daily_forecasts, forecast_area),
            asyncio.to_thread(self._get_hourly_forecasts, forecast_area),
            asyncio.to_thread(self._get_object_detections, forecast_area),
        )

    def _jma_forecast_to_weather_forecast(
        self,
        forecast_area: ForecastArea,
        jma_forecasts: list[JmaForecast],
        current_hourly_forecast: JmaHourlyForecast | None = None,
    ) -> WeatherForecast:
        temp_mins = [forecast.temp_min for forecast in jma_forecasts if forecast.temp_min is not None]
        temp_maxs = [forecast.temp_max for forecast in jma_forecasts if forecast.temp_max is not None]

        return WeatherForecast(
            date=jma_forecasts[0].date_time,
            area_id=jma_forecasts[0].area_id,
            area_name=forecast_area.area_name,
            area_code=forecast_area.area_code,
            weather_code=jma_forecasts[0].weather_code,
            weather_name=self.jma_repository.get_weather_name(jma_forecasts[0].weather_code),
            wind=jma_forecasts[0].wind,
            wave=jma_forecasts[0].wave,
            pops=[PopData(date_time=pop.date_time, pop=pop.pop) for pop in jma_forecasts[0].pops],
            temp=current_hourly_forecast.temp if current_hourly_forecast else None,
            temp_min=min(temp_mins) if temp_mins else None,
            temp_max=max(temp_maxs) if temp_maxs else None,
        )
