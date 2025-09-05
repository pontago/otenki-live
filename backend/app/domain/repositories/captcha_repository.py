from abc import ABC, abstractmethod

from google.auth import aws


class ICaptchaRepository(ABC):
    @abstractmethod
    def verify_recaptcha(
        self,
        project_id: str,
        recaptcha_site_key: str,
        token: str,
        action: str,
        user_ip: str | None = None,
        credentials: aws.Credentials | None = None,
    ) -> float:
        raise NotImplementedError
