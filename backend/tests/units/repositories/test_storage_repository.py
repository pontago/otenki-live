from pathlib import Path

import boto3
import pytest

from app.core.settings import AppSettings
from app.infrastructure.exceptions import CookiePathNotSetError, ModelPathNotSetError
from app.infrastructure.repositories.storage_repository import StorageRepository


@pytest.fixture
def repository():
    session = boto3.session.Session()
    return StorageRepository(session=session)


def test_sync_model(tmp_path, monkeypatch, repository):
    assert AppSettings.classification_model_weights_path is not None
    assert AppSettings.detection_model_weights_path is not None
    assert AppSettings.clothing_model_weights_path is not None

    AppSettings.storage_dir = str(tmp_path)

    repository.sync_model()

    classification_model_path = Path(AppSettings.storage_dir, AppSettings.classification_model_weights_path)
    detection_model_path = Path(AppSettings.storage_dir, AppSettings.detection_model_weights_path)
    clothing_model_path = Path(AppSettings.storage_dir, AppSettings.clothing_model_weights_path)
    assert classification_model_path.exists()
    assert detection_model_path.exists()
    assert clothing_model_path.exists()

    monkeypatch.setattr(AppSettings, "detection_model_weights_path", None)
    with pytest.raises(ModelPathNotSetError):
        repository.sync_model()


def test_download_cookies(tmp_path, monkeypatch, repository):
    assert AppSettings.youtube_cookies_path is not None

    AppSettings.storage_dir = str(tmp_path)

    repository.download_cookies()

    youtube_cookies_path = Path(AppSettings.storage_dir, AppSettings.youtube_cookies_path)
    assert youtube_cookies_path.exists()

    monkeypatch.setattr(AppSettings, "youtube_cookies_path", None)
    with pytest.raises(CookiePathNotSetError):
        repository.download_cookies()
