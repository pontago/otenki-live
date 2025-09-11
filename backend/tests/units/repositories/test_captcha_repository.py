from unittest.mock import patch

import pytest
from google.cloud import recaptchaenterprise_v1

from app.core.settings import AppSettings
from app.infrastructure.exceptions import RecaptchaVerificationError
from app.infrastructure.repositories.captcha_repository import CaptchaRepository


@pytest.fixture
def repository():
    return CaptchaRepository()


@patch("google.cloud.recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient")
def test_verify_recaptcha(mock_client, repository: CaptchaRepository):
    assert AppSettings.gcp_project_id
    assert AppSettings.recaptcha_site_key

    token = "1000000000000000000000000000000000000000"
    mock_client.return_value.create_assessment.return_value = recaptchaenterprise_v1.Assessment(
        token_properties=recaptchaenterprise_v1.TokenProperties(valid=True, action=AppSettings.recaptcha_action),
        risk_analysis=recaptchaenterprise_v1.RiskAnalysis(score=0.9),
        event=recaptchaenterprise_v1.Event(
            token=token,
            site_key=AppSettings.recaptcha_site_key,
            expected_action=AppSettings.recaptcha_action,
        ),
    )

    score = repository.verify_recaptcha(
        project_id=AppSettings.gcp_project_id,
        recaptcha_site_key=AppSettings.recaptcha_site_key,
        token=token,
        action=AppSettings.recaptcha_action,
    )
    assert score > 0.8


@patch("google.cloud.recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient")
def test_verify_recaptcha_low_score(mock_client, repository: CaptchaRepository):
    assert AppSettings.gcp_project_id
    assert AppSettings.recaptcha_site_key

    token = "1000000000000000000000000000000000000000"
    mock_client.return_value.create_assessment.return_value = recaptchaenterprise_v1.Assessment(
        token_properties=recaptchaenterprise_v1.TokenProperties(valid=True, action=AppSettings.recaptcha_action),
        risk_analysis=recaptchaenterprise_v1.RiskAnalysis(score=0.4),
        event=recaptchaenterprise_v1.Event(
            token=token,
            site_key=AppSettings.recaptcha_site_key,
            expected_action=AppSettings.recaptcha_action,
        ),
    )

    with pytest.raises(RecaptchaVerificationError):
        repository.verify_recaptcha(
            project_id=AppSettings.gcp_project_id,
            recaptcha_site_key=AppSettings.recaptcha_site_key,
            token=token,
            action=AppSettings.recaptcha_action,
        )
