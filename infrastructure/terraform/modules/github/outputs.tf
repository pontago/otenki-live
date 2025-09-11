output "github_actions_deploy_role_arn" {
  value = aws_iam_role.github_actions_role.arn
}

output "github_actions_deploy_role_name" {
  value = aws_iam_role.github_actions_role.name
}

output "github_service_account_email" {
  value = google_service_account.github_sa.email
  description = "GitHub Actions Service Account Email"
}

output "github_pool_id" {
  value = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  description = "GitHub Actions Workload Identity Pool ID"
}

output "github_provider_id" {
  value = google_iam_workload_identity_pool_provider.github_provider.workload_identity_pool_provider_id
  description = "GitHub Actions Workload Identity Pool Provider ID"
}