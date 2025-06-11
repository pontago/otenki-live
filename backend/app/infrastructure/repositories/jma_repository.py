from datetime import datetime
from urllib.parse import urljoin

import requests
from loguru import logger

from app.core.settings import AppAPIConfig
from app.domain.entities.jma_forecast.entity import JmaForecast
from app.domain.entities.jma_forecast.pop_data import PopData
from app.domain.repositories.jma_repository import IJmaRepository
from app.infrastructure.exceptions import RequestError, ResponseInvalidError


class JmaRepository(IJmaRepository):
    def __init__(self):
        pass

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

                    jmaForecast = JmaForecast(
                        report_date_time=forecast["srf"]["reportDatetime"],
                        date_time=date_time.date(),
                        area_code=forecast["officeCode"],
                        area_name=forecast["name"],
                        weather_code=int(forecast["srf"]["timeSeries"][0]["areas"]["weatherCodes"][index]),
                        wind=forecast["srf"]["timeSeries"][0]["areas"]["winds"][index],
                        wave=waves[index] if waves else None,
                        pops=pops_for_day,
                        temp_min=int(temps_for_day[0]) if temps_for_day else None,
                        temp_max=int(temps_for_day[1]) if temps_for_day else None,
                    )
                    results.append(jmaForecast)

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
                    jmaForecast = JmaForecast(
                        report_date_time=forecast["week"]["reportDatetime"],
                        date_time=date_time.date(),
                        area_code=forecast["officeCode"],
                        area_name=forecast["name"],
                        weather_code=int(weekly_weather_codes[index]),
                        wind=None,
                        wave=None,
                        pops=pops,
                        temp_min=temps_min,
                        temp_max=temps_max,
                    )
                    results.append(jmaForecast)
        except KeyError as e:
            logger.error(f"JMA API response is invalid: {e}.")
            raise ResponseInvalidError from e
        except Exception as e:
            logger.error(f"Failed to weekly forecast response: {e}.")
            raise

        return results
