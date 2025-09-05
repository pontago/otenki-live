output "recaptcha_site_key" {
  value = google_recaptcha_enterprise_key.recaptcha_key.name
  description = "reCAPTCHA Enterprise Key Name"
}

output "recaptcha_service_account_email" {
  value = google_service_account.recaptcha_sa.email
  description = "reCAPTCHA Enterprise Service Account Email"
}

output "recaptcha_pool_id" {
  value = google_iam_workload_identity_pool.aws_pool.workload_identity_pool_id
  description = "reCAPTCHA Enterprise Workload Identity Pool ID"
}

output "recaptcha_provider_id" {
  value = google_iam_workload_identity_pool_provider.aws_provider.workload_identity_pool_provider_id
  description = "reCAPTCHA Enterprise Workload Identity Pool Provider ID"
}