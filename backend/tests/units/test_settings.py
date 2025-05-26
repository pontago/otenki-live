from app.core.di.container import Container
from app.core.settings import AppSettings


def test_settings(container: Container):
    assert AppSettings.region_name
