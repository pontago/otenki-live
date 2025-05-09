from urllib.parse import urljoin

import requests
from core.settings import AppAPIConfig
from domain.jma_forecast.model import JmaForecast
from usecases.jma.repository import IJmaRepository


class JmaRepository(IJmaRepository):
    def __init__(self):
        self.forcasts = []

    def get_weekly_forecast(self) -> list[JmaForecast]:
        url = urljoin(base=AppAPIConfig.jma_api_base_url, url="forecast/data/forecast/010000.json")
        response = requests.get(url)
        print(response.json())
        return []
