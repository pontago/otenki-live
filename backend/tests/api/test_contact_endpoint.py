from unittest.mock import patch

import pytest
from fastapi import status
from fastapi.testclient import TestClient
from google.cloud import recaptchaenterprise_v1

from app.adapter.api.main import app
from app.core.settings import AppSettings


@pytest.fixture
def client():
    return TestClient(app)


def test_post_contact_invalid_request(client: TestClient):
    payload = {
        "email": "test@example.com",
    }
    response = client.post(f"{AppSettings.api_v1_prefix}/contact", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    payload = {
        "name": "test" * 100,
        "email": "test@examplecom",
        "message": "test" * 10000,
        "recaptcha_token": "dummy",
    }
    response = client.post(f"{AppSettings.api_v1_prefix}/contact", json=payload)
    json = response.json()
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert json["detail"][0]["type"] == "string_too_long"
    assert json["detail"][1]["type"] == "value_error"
    assert json["detail"][2]["type"] == "string_too_long"


@patch("google.cloud.recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient")
def test_post_contact_valid_request(mock_client, client: TestClient):
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

    payload = {
        "name": "test",
        "email": "test@example.com",
        "message": "test",
        "recaptcha_token": token,
    }
    response = client.post(f"{AppSettings.api_v1_prefix}/contact", json=payload)
    assert response.status_code == status.HTTP_200_OK
