import boto3
import pytest

from app.core.settings import AppSettings
from app.domain.entities.mail_template.mail_template_type import MailTemplateType
from app.infrastructure.exceptions import SESSendmailError
from app.infrastructure.repositories.ses_repository import SESRepository


@pytest.fixture
def repository():
    session = boto3.session.Session(region_name=AppSettings.aws_region)
    return SESRepository(session=session)


def test_seed_loader(repository):
    assert len(repository.templates) == 2
    assert repository.templates[0].type == MailTemplateType.CONFIRM
    assert repository.templates[1].type == MailTemplateType.ADMIN


def test_get_template(repository):
    template = repository.get_template(MailTemplateType.CONFIRM)
    assert template.type == MailTemplateType.CONFIRM
    assert template.subject == "お問い合わせを受け付けました（自動返信）"


def test_send_mail(repository):
    with pytest.raises(SESSendmailError):
        repository.sendmail(AppSettings.contact_from_address, "test@test.com", None, None)

    message_id = repository.sendmail(AppSettings.contact_from_address, "test@test.com", "subject", "body")
    assert message_id
