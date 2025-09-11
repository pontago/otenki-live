from unittest.mock import patch

import pytest
from google.cloud import recaptchaenterprise_v1

from app.adapter.api.v1.schemas.contact import ContactInput
from app.core.di.container import Container
from app.core.settings import AppSettings
from app.usecases.contact.contact_interactor import ContactInteractor


@pytest.fixture
def usecase(container: Container):
    container.wire(modules=[__name__])
    usecase = ContactInteractor()
    return usecase


@patch("google.cloud.recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient")
def test_contact(mock_client, usecase: ContactInteractor):
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

    message_ids = usecase.execute(
        ContactInput(
            name="test",
            email="test@test.com",
            message="test",
            recaptcha_token=token,
        )
    )

    assert message_ids
    assert len(message_ids) == 2
