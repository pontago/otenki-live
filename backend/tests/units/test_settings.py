from app.core.di.container import Container
from app.core.settings import AppSettings


def test_settings(container: Container):
    print(AppSettings.endpoint_url)
    assert AppSettings.aws_region
