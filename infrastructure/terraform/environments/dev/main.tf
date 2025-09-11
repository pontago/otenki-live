terraform {
  required_version = ">=1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 7.1"
    }
  }

  backend "s3" {
    bucket  = "otenki-live-terraform"
    key     = "dev/terraform.tfstate"
    encrypt = true
    region  = "ap-northeast-1"
  }
}


locals {
  env     = "dev"
  project = "otenki-live"
  suffix  = local.env == "prod" ? "" : "-${local.env}"
}

provider "aws" {
  default_tags {
    tags = {
      Environment = local.env,
      Project     = local.project,
    }
  }

  region = var.aws_region
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region

  default_labels = {
    environment = local.env
    project     = local.project
  }
}

#
# Modules
#
module "recaptcha" {
  source          = "../../modules/recaptcha"
  env             = local.env
  project         = local.project
  region          = var.gcp_region
  gcp_project_id  = var.gcp_project_id
  allowed_domains = var.recaptcha_allowed_domains
}


module "backend" {
  source                       = "../../modules/backend/base"
  env                          = local.env
  project                      = local.project
  backend_dir                  = abspath("${path.root}/../../../../backend")
  docker_dir                   = abspath("${path.root}/../../../docker")
  ecr_backend_name             = "${local.project}${local.suffix}/backend"
  ecr_ffmpeg_name              = "${local.project}${local.suffix}/ffmpeg"
  log_level                    = "DEBUG"
  ses_sender_email             = "app@greenstudio.jp"
  clothing_model_weights_path  = var.clothing_model_weights_path
  detection_model_weights_path = var.detection_model_weights_path
  youtube_cookies_path         = var.youtube_cookies_path
  cors                         = var.base_url
  recaptcha_site_key           = module.recaptcha.recaptcha_site_key
  gcp_project_id               = var.gcp_project_id
  gcp_service_account_email    = module.recaptcha.recaptcha_service_account_email
  gcp_pool_id                  = module.recaptcha.recaptcha_pool_id
  gcp_provider_id              = module.recaptcha.recaptcha_provider_id
}

module "frontend" {
  source            = "../../modules/frontend"
  env               = local.env
  project           = local.project
  param_secret_key  = var.param_secret_key
  frontend_dir      = abspath("${path.root}/../../../../frontend")
  docker_dir        = abspath("${path.root}/../../../docker")
  ecr_frontend_name = "${local.project}${local.suffix}/frontend"
}

module "backend_scheduler" {
  source                           = "../../modules/backend/scheduler"
  env                              = local.env
  lambda_live_weather_forecast_arn = module.backend.lambda_live_weather_forecast_arn
  lambda_queue_live_streams_arn    = module.backend.lambda_queue_live_streams_arn
  update_weather_forecast_schedule = "at(2025-08-13T19:45:00)"
  queue_live_streams_schedule      = "at(2025-08-14T12:30:00)"
}

module "cdn" {
  source        = "../../modules/cdn"
  env           = local.env
  project       = local.project
  backend_fqdn  = "${module.backend.lambda_api_url_id}.lambda-url.${var.aws_region}.on.aws"
  frontend_fqdn = "${module.frontend.lambda_frontend_url_id}.lambda-url.${var.aws_region}.on.aws"

  lambda_api_function_name             = module.backend.lambda_api_function_name
  lambda_frontend_function_name        = module.frontend.lambda_frontend_function_name
  frontend_bucket_regional_domain_name = module.frontend.frontend_bucket_regional_domain_name
}

module "github" {
  source            = "../../modules/github"
  env               = local.env
  github_repository = "pontago/otenki-live"
  project           = local.project
  gcp_project_id    = var.gcp_project_id
}