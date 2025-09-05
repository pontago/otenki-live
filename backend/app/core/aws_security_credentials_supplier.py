from google.auth import aws, exceptions

from app.core.settings import AppSettings


class CustomAwsSecurityCredentialsSupplier(aws.AwsSecurityCredentialsSupplier):
    def get_aws_security_credentials(self, context, request):
        if AppSettings.aws_access_key_id is None:
            raise ValueError("AWS access key ID is not set")
        if AppSettings.aws_secret_access_key is None:
            raise ValueError("AWS secret access key is not set")

        try:
            return aws.AwsSecurityCredentials(
                AppSettings.aws_access_key_id, AppSettings.aws_secret_access_key, AppSettings.aws_session_token
            )
        except Exception as e:
            raise exceptions.RefreshError(e, retryable=True)

    def get_aws_region(self, context, request):
        return AppSettings.aws_region
