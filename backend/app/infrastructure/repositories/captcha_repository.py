from google.cloud import recaptchaenterprise_v1
from loguru import logger

from app.domain.repositories.captcha_repository import ICaptchaRepository
from app.infrastructure.exceptions import RecaptchaVerificationError


class CaptchaRepository(ICaptchaRepository):
    def verify_recaptcha(
        self, project_id: str, recaptcha_site_key: str, token: str, action: str, user_ip: str | None = None
    ) -> float:
        client = recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient()
        parent = f"projects/{project_id}"

        event = recaptchaenterprise_v1.Event(
            token=token,
            site_key=recaptcha_site_key,
            user_ip_address=user_ip,
            expected_action=action,
        )

        assessment = recaptchaenterprise_v1.Assessment(event=event)

        response = client.create_assessment(request={"parent": parent, "assessment": assessment})

        if not response.token_properties.valid:
            logger.warning(f"Recaptcha token is invalid: {response.token_properties.invalid_reason}")
            raise RecaptchaVerificationError(f"Invalid token: {response.token_properties.invalid_reason}")

        if response.risk_analysis.score < 0.5:
            logger.warning(f"Recaptcha score is too low: {response.risk_analysis.score}")
            raise RecaptchaVerificationError(f"Score is too low: {response.risk_analysis.score}")

        return response.risk_analysis.score
