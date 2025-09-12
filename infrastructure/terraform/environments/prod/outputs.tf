# Cloudfront
output "cloudfront_app_url" {
  value       = module.cdn.cloudfront_app_url
  description = "URL of the CloudFront distribution"
}

# reCAPTCHA
output "recaptcha_site_key" {
  value       = module.recaptcha.recaptcha_site_key
  description = "reCAPTCHA Enterprise Key Name"
}

output "recaptcha_service_account_email" {
  value       = module.recaptcha.recaptcha_service_account_email
  description = "reCAPTCHA Enterprise Service Account Email"
}

output "recaptcha_pool_id" {
  value       = module.recaptcha.recaptcha_pool_id
  description = "reCAPTCHA Enterprise Workload Identity Pool ID"
}

output "recaptcha_provider_id" {
  value       = module.recaptcha.recaptcha_provider_id
  description = "reCAPTCHA Enterprise Workload Identity Pool Provider ID"
}

# GitHub
output "github_actions_deploy_role_arn" {
  value       = module.github.github_actions_deploy_role_arn
  description = "GitHub Actions Deploy Role ARN"
}

output "github_actions_deploy_role_name" {
  value       = module.github.github_actions_deploy_role_name
  description = "GitHub Actions Deploy Role Name"
}

output "github_service_account_email" {
  value       = module.github.github_service_account_email
  description = "GitHub Actions Service Account Email"
}

output "github_pool_id" {
  value       = module.github.github_pool_id
  description = "GitHub Actions Workload Identity Pool ID"
}

output "github_provider_id" {
  value       = module.github.github_provider_id
  description = "GitHub Actions Workload Identity Pool Provider ID"
}