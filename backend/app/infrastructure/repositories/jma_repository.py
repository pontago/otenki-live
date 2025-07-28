from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import requests
import yaml
from loguru import logger

from app.core.settings import AppAPIConfig, AppSettings
from app.domain.entities.forecast_area.entity import ForecastArea
from app.domain.entities.forecast_telop.entity import ForecastTelop
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_forecast.pop_data import PopData
from app.domain.entities.jma_hourly_forecast.entity import JmaHourlyForecast
from app.domain.repositories.jma_repository import IJmaRepository
from app.infrastructure.exceptions import AreaNotFoundError, RequestError, ResponseInvalidError


class JmaRepository(IJmaRepository):
    def __init__(self):
        self.seed_loader()

    def seed_loader(self):
        forecast_area_yaml = yaml.safe_load(Path(AppSettings.seed_path, "forecast_area.yaml").read_text())
        self.forecast_areas = [ForecastArea(**item) for item in forecast_area_yaml]

        forecast_telop_yaml = yaml.safe_load(Path(AppSettings.seed_path, "forecast_telop.yaml").read_text())
        self.forecast_telops = [ForecastTelop(**item) for item in forecast_telop_yaml]

    def get_forecast_areas(self) -> list[ForecastArea]:
        return self.forecast_areas

    def get_forecast_regions(self) -> list[ForecastArea]:
        return [area for area in self.forecast_areas if area.area_code in AppAPIConfig.jma_forecast_regions]

    def get_area_with_week_id(self, week_id: str) -> ForecastArea:
        forecast_area = next((area for area in self.forecast_areas if area.week_id == week_id), None)
        if not forecast_area:
            raise AreaNotFoundError
        return forecast_area

    def get_forecast_areas_with_region_code(self, region_code: str) -> list[ForecastArea]:
        return [area for area in self.forecast_areas if area.region_code == region_code]

    def get_forecast_area_with_region_code(self, region_code: str) -> ForecastArea:
        forecast_area = next((area for area in self.forecast_areas if area.region_code == region_code), None)
        if not forecast_area:
            raise AreaNotFoundError
        return forecast_area

    def get_forecast_area_with_area_code(self, area_code: str) -> ForecastArea:
        forecast_area = next((area for area in self.forecast_areas if area.area_code == area_code), None)
        if not forecast_area:
            raise AreaNotFoundError
        return forecast_area

    def get_weather_name(self, weather_code: int) -> str:
        return next((telop.name for telop in self.forecast_telops if telop.weather_code == weather_code), "")

    def get_weekly_forecast(self) -> list[JmaForecast]:
        results: list[JmaForecast] = []

        try:
            url = urljoin(base=AppAPIConfig.jma_api_base_url, url="forecast/data/forecast/010000.json")
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get weekly forecast: {e}.")
            raise RequestError

        try:
            json = response.json()
            for forecast in json:
                """
                直近3日の予報
                """
                weather_time_defines = forecast["srf"]["timeSeries"][0]["timeDefines"]
                pop_time_defines = forecast["srf"]["timeSeries"][1]["timeDefines"]
                temp_data = forecast["srf"]["timeSeries"][2]

                pops: list[PopData] = []
                for index, time_define in enumerate(pop_time_defines):
                    pop_data = PopData(
                        date_time=datetime.fromisoformat(time_define),
                        pop=int(forecast["srf"]["timeSeries"][1]["areas"]["pops"][index]),
                    )
                    pops.append(pop_data)

                for index, time_define in enumerate(weather_time_defines):
                    date_time = datetime.fromisoformat(time_define)
                    waves = forecast["srf"]["timeSeries"][0]["areas"].get("waves")
                    pops_for_day = [pop for pop in pops if pop.date_time.date() == date_time.date()]
                    temps_for_day = [
                        temp
                        for time, temp in zip(temp_data["timeDefines"], temp_data["areas"]["temps"], strict=True)
                        if datetime.fromisoformat(time).date() == date_time.date()
                    ]

                    jma_forecast = JmaForecast(
                        report_date_time=forecast["srf"]["reportDatetime"],
                        date_time=date_time.date(),
                        area_id=forecast["officeCode"],
                        weather_code=int(forecast["srf"]["timeSeries"][0]["areas"]["weatherCodes"][index]),
                        wind=forecast["srf"]["timeSeries"][0]["areas"]["winds"][index],
                        wave=waves[index] if waves else None,
                        pops=pops_for_day,
                        temp_min=int(temps_for_day[0]) if temps_for_day else None,
                        temp_max=int(temps_for_day[1]) if temps_for_day else None,
                    )
                    results.append(jma_forecast)

                """
                週間予報
                """
                weekly_weather_time_defines = forecast["week"]["timeSeries"][0]["timeDefines"]
                weekly_weather_codes = forecast["week"]["timeSeries"][0]["areas"]["weatherCodes"]
                weekly_weather_pops = forecast["week"]["timeSeries"][0]["areas"]["pops"]
                weekly_weather_temps_min = forecast["week"]["timeSeries"][1]["areas"]["tempsMin"]
                weekly_weather_temps_max = forecast["week"]["timeSeries"][1]["areas"]["tempsMax"]

                weekly_weather_time_defines.pop(0)
                weekly_weather_codes.pop(0)
                weekly_weather_pops.pop(0)
                weekly_weather_temps_min.pop(0)
                weekly_weather_temps_max.pop(0)
                for index, time_define in enumerate(weekly_weather_time_defines):
                    date_time = datetime.fromisoformat(time_define)
                    pops = (
                        [PopData(date_time=date_time, pop=int(weekly_weather_pops[index]))]
                        if weekly_weather_pops[index]
                        else []
                    )
                    temps_min = int(weekly_weather_temps_min[index]) if weekly_weather_temps_min[index] else None
                    temps_max = int(weekly_weather_temps_max[index]) if weekly_weather_temps_max[index] else None
                    jma_forecast = JmaForecast(
                        report_date_time=forecast["week"]["reportDatetime"],
                        date_time=date_time.date(),
                        area_id=forecast["officeCode"],
                        weather_code=int(weekly_weather_codes[index]),
                        wind=None,
                        wave=None,
                        pops=pops,
                        temp_min=temps_min,
                        temp_max=temps_max,
                    )
                    results.append(jma_forecast)
        except KeyError as e:
            logger.error(f"JMA API response is invalid: {e}.")
            raise ResponseInvalidError from e
        except Exception as e:
            logger.error(f"Failed to weekly forecast response: {e}.")
            raise

        return results

    def get_hourly_forecast(self, forecast_area: ForecastArea) -> list[JmaHourlyForecast]:
        results: list[JmaHourlyForecast] = []

        try:
            url = urljoin(
                base=AppAPIConfig.jma_api_base_url, url=f"jmatile/data/wdist/VPFD/{forecast_area.area_id}.json"
            )
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get hourly forecast: {e}.")
            raise RequestError

        try:
            json = response.json()

            forecast_weathers = json["areaTimeSeries"]
            forecast_temps = json["pointTimeSeries"]

            report_date_time = json["reportDateTime"]
            weather_time_defines = forecast_weathers["timeDefines"]

            for index, time_define in enumerate(weather_time_defines):
                date_time = datetime.fromisoformat(time_define["dateTime"])

                weather = forecast_weathers["weather"][index]
                weather_code = JmaHourlyForecast.to_weather_code(weather)

                temp = forecast_temps["temperature"][index]
                temp_min = forecast_temps["minTemperature"][index]
                temp_max = forecast_temps["maxTemperature"][index]

                jma_forecast = JmaHourlyForecast(
                    report_date_time=report_date_time,
                    date_time=date_time,
                    area_id=forecast_area.area_id,
                    weather_code=weather_code,
                    temp=int(temp),
                    temp_min=int(temp_min) if temp_min != "" else None,
                    temp_max=int(temp_max) if temp_max != "" else None,
                )
                results.append(jma_forecast)
        except Exception as e:
            logger.error(f"Failed to hourly forecast response: {e}.")
            raise

        return results

    def get_forecast(self, forecast_area: ForecastArea) -> list[JmaForecast]:
        results: list[JmaForecast] = []

        try:
            url = urljoin(
                base=AppAPIConfig.jma_api_base_url, url=f"forecast/data/forecast/{forecast_area.week_id}.json"
            )
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get forecast for week id {forecast_area.week_id}: {e}.")
            raise RequestError

        try:
            json = response.json()

            results += self._parse_recently_forecasts(forecast_area, json)
            results += self._parse_weekly_forecasts(forecast_area, json)
        except KeyError as e:
            logger.error(f"JMA API response is invalid: {e}.")
            raise ResponseInvalidError from e
        except Exception as e:
            logger.error(f"Failed to forecast response for area code {forecast_area.area_code}: {e}.")
            raise

        return results

    def _parse_recently_forecasts(self, forecast_area: ForecastArea, json: Any) -> list[JmaForecast]:
        results: list[JmaForecast] = []

        """
        直近2日の予報
        """
        forecast_2days = json[0]["timeSeries"][0]
        forecast_pops = json[0]["timeSeries"][1]
        forecast_temps = json[0]["timeSeries"][2]
        weather_area = next(
            (area for area in forecast_2days["areas"] if area["area"]["code"] == forecast_area.area_id), None
        )
        weather_area_pops = next(
            (area for area in forecast_pops["areas"] if area["area"]["code"] == forecast_area.area_id), None
        )
        weather_area_temps = next(
            (area for area in forecast_temps["areas"] if area["area"]["code"] == forecast_area.area_spot_id), None
        )

        if not weather_area:
            logger.error(f"Weather area not found for area id {forecast_area.area_id}.")
            raise ResponseInvalidError

        if not weather_area_pops:
            logger.error(f"Weather area pops not found for area id {forecast_area.area_id}.")
            raise ResponseInvalidError

        if not weather_area_temps:
            logger.error(f"Weather area temps not found for area id {forecast_area.area_id}.")
            raise ResponseInvalidError

        report_date_time = json[0]["reportDatetime"]
        weather_time_defines = forecast_2days["timeDefines"]

        weather_pops: list[PopData] = []
        for index, time_define in enumerate(forecast_pops["timeDefines"]):
            pop_data = PopData(
                date_time=datetime.fromisoformat(time_define),
                pop=int(weather_area_pops["pops"][index]),
            )
            weather_pops.append(pop_data)

        for index, time_define in enumerate(weather_time_defines):
            date_time = datetime.fromisoformat(time_define)
            pops = [item for item in weather_pops if item.date_time.date() == date_time.date()] if weather_pops else []

            if len(pops) == 0:
                continue

            temps = [
                int(weather_area_temps["temps"][index])
                for index, time_define in enumerate(forecast_temps["timeDefines"])
                if datetime.fromisoformat(time_define).date() == date_time.date()
            ]

            if temps and len(temps) == 2:
                temp_min = min(temps)
                temp_max = max(temps)
            else:
                temp_min = None
                temp_max = None

            winds = weather_area.get("winds")
            waves = weather_area.get("waves")
            jma_forecast = JmaForecast(
                report_date_time=report_date_time,
                date_time=date_time.date(),
                area_id=forecast_area.area_id,
                weather_code=int(weather_area["weatherCodes"][index]),
                wind=winds[index] if winds and len(winds) >= index else None,
                wave=waves[index] if waves and len(waves) >= index else None,
                pops=pops,
                temp_min=temp_min,
                temp_max=temp_max,
            )
            results.append(jma_forecast)

        return results

    def _parse_weekly_forecasts(self, forecast_area: ForecastArea, json: Any) -> list[JmaForecast]:
        results: list[JmaForecast] = []

        forecast_weekly = json[1]["timeSeries"][0]
        forecast_temps = json[1]["timeSeries"][1]
        weather_area = forecast_weekly["areas"][0]
        weather_area_temps = forecast_temps["areas"][0]

        report_date_time = json[1]["reportDatetime"]
        weather_time_defines = forecast_weekly["timeDefines"]

        for index, time_define in enumerate(weather_time_defines):
            if index == 0:
                continue

            date_time = datetime.fromisoformat(time_define)
            weather_code = int(weather_area["weatherCodes"][index])
            pop = int(weather_area["pops"][index])

            temp_min = int(weather_area_temps["tempsMin"][index])
            temp_max = int(weather_area_temps["tempsMax"][index])

            jma_forecast = JmaForecast(
                report_date_time=report_date_time,
                date_time=date_time.date(),
                area_id=forecast_area.area_id,
                weather_code=weather_code,
                wind=None,
                wave=None,
                pops=[PopData(date_time=date_time, pop=pop)],
                temp_min=temp_min,
                temp_max=temp_max,
            )
            results.append(jma_forecast)
        return results
