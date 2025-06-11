from pathlib import Path
from venv import logger

import boto3

from app.core.settings import AppSettings
from app.domain.repositories.storage_repository import IStorageRepository
from app.infrastructure.exceptions import (
    CookieDownloadError,
    CookiePathNotSetError,
    ModelDownloadError,
    ModelPathNotSetError,
)


class StorageRepository(IStorageRepository):
    def __init__(self, session: boto3.Session):
        self.session = session
        self.s3 = self.session.client("s3", endpoint_url=AppSettings.endpoint_url)

    def sync_model(self):
        if not AppSettings.detection_model_weights_path:
            raise ModelPathNotSetError(f"Model weights file not found: {AppSettings.detection_model_weights_path}")
        elif not AppSettings.clothing_model_weights_path:
            raise ModelPathNotSetError(
                f"Clothing model weights file not found: {AppSettings.clothing_model_weights_path}"
            )
        # elif not AppSettings.classification_model_weights_path:
        #     raise ModelPathNotSetError(
        #         f"Classification model weights file not found: {AppSettings.classification_model_weights_path}"
        #     )

        detection_model_path = Path(AppSettings.storage_dir, AppSettings.detection_model_weights_path)
        clothing_model_path = Path(AppSettings.storage_dir, AppSettings.clothing_model_weights_path)
        if detection_model_path.exists() and clothing_model_path.exists():
            return

        try:
            detection_model_path.parent.mkdir(parents=True, exist_ok=True)

            if AppSettings.classification_model_weights_path:
                classification_model_path = Path(AppSettings.storage_dir, AppSettings.classification_model_weights_path)
                self.s3.download_file(
                    AppSettings.bucket_name,
                    AppSettings.classification_model_weights_path,
                    str(classification_model_path),
                )

            self.s3.download_file(
                AppSettings.bucket_name,
                AppSettings.detection_model_weights_path,
                str(detection_model_path),
            )
            self.s3.download_file(
                AppSettings.bucket_name,
                AppSettings.clothing_model_weights_path,
                str(clothing_model_path),
            )
        except Exception as e:
            logger.error(f"Failed to download model files: {e}")
            raise ModelDownloadError from e

    def download_cookies(self):
        if not AppSettings.youtube_cookies_path:
            raise CookiePathNotSetError(f"YouTube cookies path not set: {AppSettings.youtube_cookies_path}")

        youtube_cookies_path = Path(AppSettings.storage_dir, AppSettings.youtube_cookies_path)

        try:
            youtube_cookies_path.parent.mkdir(parents=True, exist_ok=True)
            self.s3.download_file(
                AppSettings.bucket_name,
                AppSettings.youtube_cookies_path,
                str(youtube_cookies_path),
            )
        except Exception as e:
            logger.error(f"Failed to create directory for cookies: {e}")
            raise CookieDownloadError from e
