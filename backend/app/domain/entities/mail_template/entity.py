from pydantic import BaseModel

from app.domain.entities.mail_template.mail_template_type import MailTemplateType


class MailTemplate(BaseModel):
    type: MailTemplateType
    subject: str
    body: str
