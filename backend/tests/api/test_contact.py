import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.adapter.api.main import app
from app.core.settings import AppSettings


@pytest.fixture
def client():
    return TestClient(app)


def test_post_contact(client):
    payload = {
        "email": "test@example.com",
    }
    response = client.post(f"{AppSettings.api_v1_prefix}/contact", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    payload = {
        "name": "test" * 100,
        "email": "test@examplecom",
        "message": "test" * 10000,
    }
    response = client.post(f"{AppSettings.api_v1_prefix}/contact", json=payload)
    json = response.json()
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert json["detail"][0]["type"] == "string_too_long"
    assert json["detail"][1]["type"] == "value_error"
    assert json["detail"][2]["type"] == "string_too_long"

    payload = {
        "name": "test",
        "email": "test@example.com",
        "message": "test",
    }
    response = client.post(f"{AppSettings.api_v1_prefix}/contact", json=payload)
    assert response.status_code == status.HTTP_200_OK
