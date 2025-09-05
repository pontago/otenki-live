from dependency_injector.wiring import Provide, inject
from google.auth import aws

from app.adapter.api.v1.schemas.contact import ContactInput
from app.core.aws_security_credentials_supplier import CustomAwsSecurityCredentialsSupplier
from app.core.di.container import Container
from app.core.settings import AppSettings
from app.domain.entities.mail_template.mail_template_type import MailTemplateType
from app.domain.repositories.captcha_repository import ICaptchaRepository
from app.domain.repositories.ses_repository import ISESRepository


@inject
class ContactInteractor:
    def __init__(
        self,
        ses_repository: ISESRepository = Provide[Container.ses_repository],
        captcha_repository: ICaptchaRepository = Provide[Container.captcha_repository],
    ):
        self.ses_repository = ses_repository
        self.captcha_repository = captcha_repository

    def execute(self, contact: ContactInput) -> list[str]:
        if AppSettings.recaptcha_site_key is None:
            raise ValueError("Recaptcha site key is not set")
        if AppSettings.gcp_project_id is None:
            raise ValueError("GCP project ID is not set")

        credentials = None
        if AppSettings.gcp_service_account_email:
            supplier = CustomAwsSecurityCredentialsSupplier()
            credentials = aws.Credentials(
                audience=f"//iam.googleapis.com/projects/{AppSettings.gcp_project_number}/locations/global/workloadIdentityPools/{AppSettings.gcp_pool_id}/providers/{AppSettings.gcp_provider_id}",
                subject_token_type="urn:ietf:params:aws:token-type:aws4_request",
                aws_security_credentials_supplier=supplier,
                service_account_impersonation_url=f"https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/{AppSettings.gcp_service_account_email}:generateAccessToken",
            )

        self.captcha_repository.verify_recaptcha(
            project_id=AppSettings.gcp_project_id,
            recaptcha_site_key=AppSettings.recaptcha_site_key,
            token=contact.recaptcha_token,
            action=AppSettings.recaptcha_action,
            credentials=credentials,
        )

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
            reply_to_address=contact.email,
            subject=admin_template.subject,
            body=admin_template.body.format(
                name=contact.name,
                email=contact.email,
                message=contact.message,
            ),
        )
        message_ids.append(admin_message_id)

        return message_ids
