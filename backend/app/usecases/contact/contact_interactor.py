from dependency_injector.wiring import Provide, inject

from app.adapter.api.v1.schemas.contact import ContactInput
from app.core.di.container import Container
from app.core.settings import AppSettings
from app.domain.entities.mail_template.mail_template_type import MailTemplateType
from app.domain.repositories.ses_repository import ISESRepository


@inject
class ContactInteractor:
    def __init__(
        self,
        ses_repository: ISESRepository = Provide[Container.ses_repository],
    ):
        self.ses_repository = ses_repository

    def execute(self, contact: ContactInput) -> list[str]:
        confirm_template = self.ses_repository.get_template(MailTemplateType.CONFIRM)
        admin_template = self.ses_repository.get_template(MailTemplateType.ADMIN)

        message_ids = []
        confirm_message_id = self.ses_repository.sendmail(
            from_address=AppSettings.contact_from_address,
            to_address=contact.email,
            subject=confirm_template.subject,
            body=confirm_template.body.format(
                name=contact.name,
                email=contact.email,
                message=contact.message,
            ),
        )
        message_ids.append(confirm_message_id)

        admin_message_id = self.ses_repository.sendmail(
            from_address=AppSettings.contact_from_address,
            to_address=AppSettings.contact_from_address,
            subject=admin_template.subject,
            body=admin_template.body.format(
                name=contact.name,
                email=contact.email,
                message=contact.message,
            ),
        )
        message_ids.append(admin_message_id)

        return message_ids
