from abc import ABC, abstractmethod

from app.domain.entities.mail_template.entity import MailTemplate
from app.domain.entities.mail_template.mail_template_type import MailTemplateType


class ISESRepository(ABC):
    @abstractmethod
    def seed_loader(self):
        raise NotImplementedError

    @abstractmethod
    def get_template(self, type: MailTemplateType) -> MailTemplate:
        raise NotImplementedError

    @abstractmethod
    def sendmail(
        self, from_address: str, to_address: str, subject: str, body: str, reply_to_address: str | None = None
    ) -> str:
        raise NotImplementedError
