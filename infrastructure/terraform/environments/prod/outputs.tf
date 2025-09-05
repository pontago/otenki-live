# Cloudfront
output "cloudfront_app_url" {
  value = module.cdn.cloudfront_app_url
  description = "URL of the CloudFront distribution"
}

# reCAPTCHA
output "recaptcha_site_key" {
  value = module.recaptcha.recaptcha_site_key
  description = "reCAPTCHA Enterprise Key Name"
}

output "recaptcha_service_account_email" {
  value = module.recaptcha.recaptcha_service_account_email
  description = "reCAPTCHA Enterprise Service Account Email"
}

output "recaptcha_pool_id" {
  value = module.recaptcha.recaptcha_pool_id
  description = "reCAPTCHA Enterprise Workload Identity Pool ID"
}

output "recaptcha_provider_id" {
  value = module.recaptcha.recaptcha_provider_id
  description = "reCAPTCHA Enterprise Workload Identity Pool Provider ID"
}