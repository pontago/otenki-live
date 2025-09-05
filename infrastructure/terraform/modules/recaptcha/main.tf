locals {
  suffix = var.env == "prod" ? "" : "-${var.env}"
}

#
# Enable Services
#
resource "google_project_service" "enable_services" {
  for_each = toset([
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "recaptchaenterprise.googleapis.com",
  ])
  project  = var.gcp_project_id
  service  = each.value
}

#
# reCAPTCHA Enterprise
#
resource "google_recaptcha_enterprise_key" "recaptcha_key" {
  display_name = "${var.project}${local.suffix}"
  project      = var.gcp_project_id

  web_settings {
    allow_all_domains = false
    integration_type  = "SCORE"
    allowed_domains   = var.allowed_domains
    allow_amp_traffic = false
  }
}

#
# Service Account
#
resource "google_service_account" "recaptcha_sa" {
  account_id   = "${var.project}-recaptcha-sa${local.suffix}"
  display_name = "reCAPTCHA Enterprise Service Account ${var.env}"
}

resource "google_project_iam_member" "recaptcha_sa_role" {
  project = var.gcp_project_id
  role    = "roles/recaptchaenterprise.agent"
  member  = "serviceAccount:${google_service_account.recaptcha_sa.email}"
}

#
# Workload Identity
#
resource "google_iam_workload_identity_pool" "aws_pool" {
  workload_identity_pool_id = "${var.project}-aws-pool${local.suffix}"
  display_name              = "AWS Workload Identity Pool ${var.env}"
}

resource "google_iam_workload_identity_pool_provider" "aws_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.aws_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "${var.project}-aws-provider${local.suffix}"

  display_name = "AWS Provider ${var.env}"
  description  = "Allow AWS Lambda to impersonate GCP service account"

  aws {
    account_id = var.aws_account_id
  }
}

resource "google_service_account_iam_member" "recaptcha_federation" {
  service_account_id = google_service_account.recaptcha_sa.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.aws_pool.name}/*"
}