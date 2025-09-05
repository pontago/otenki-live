from pathlib import Path

import boto3
import yaml
from loguru import logger

from app.core.settings import AppSettings
from app.domain.entities.mail_template.entity import MailTemplate
from app.domain.entities.mail_template.mail_template_type import MailTemplateType
from app.domain.repositories.ses_repository import ISESRepository
from app.infrastructure.exceptions import SESSendmailError, SESTemplateNotFoundError


class SESRepository(ISESRepository):
    def __init__(self, session: boto3.Session):
        self.session = session
        self.ses = self.session.client("ses", endpoint_url=AppSettings.endpoint_url, region_name=AppSettings.aws_region)

        if AppSettings.env == "test" or (
            AppSettings.endpoint_url and AppSettings.endpoint_url.startswith("http://localhost")
        ):
            self.ses.verify_email_identity(EmailAddress=AppSettings.contact_from_address)

        self.seed_loader()

    def seed_loader(self):
        self.templates = [
            MailTemplate(**item)
            for item in yaml.safe_load(Path(AppSettings.seed_path, "mail_template.yaml").read_text())
        ]

    def get_template(self, type: MailTemplateType) -> MailTemplate:
        template = next((template for template in self.templates if template.type == type), None)
        if not template:
            raise SESTemplateNotFoundError(f"Template not found: {type}")
        return template

    def sendmail(
        self, from_address: str, to_address: str, subject: str, body: str, reply_to_address: str | None = None
    ) -> str:
        try:
            response = self.ses.send_email(
                Source=from_address,
                Destination={
                    "ToAddresses": [to_address],
                },
                ReplyToAddresses=[reply_to_address] if reply_to_address else [],
                Message={
                    "Subject": {"Data": subject},
                    "Body": {"Text": {"Data": body}},
                },
            )
            return response["MessageId"]
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            raise SESSendmailError from e
