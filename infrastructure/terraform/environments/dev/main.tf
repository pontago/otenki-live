terraform {
  required_version = ">=1.7"

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}


locals {
  env      = "dev"
  project  = "otenki-live"
}

provider "aws" {
  default_tags {
    tags = {
      Environment = local.env,
      Project     = local.project,
    }
  }

  region = "ap-northeast-1"
}

module "backend" {
  source                       = "../../modules/backend/base"
  env                          = local.env
  project                      = local.project
  backend_dir                  = abspath("${path.root}/../../../../backend")
  docker_dir                   = abspath("${path.root}/../../../docker")
  ecr_backend_name             = "otenki-live/backend"
  ecr_ffmpeg_name              = "otenki-live/ffmpeg"
  log_level                    = "DEBUG"
  ses_sender_email             = "app@greenstudio.jp"
  clothing_model_weights_path  = "checkpoints/weights-efficientnetv2-2025050301.pth"
  detection_model_weights_path = "checkpoints/yolov8n.onnx"
  youtube_cookies_path         = "cookies/www.youtube.com_cookies.txt"
}

module "frontend" {
  source              = "../../modules/frontend"
  env                 = local.env
  project             = local.project
  base_url            = var.base_url
  api_url             = var.api_url
  param_secret_key    = var.param_secret_key
  recaptcha_site_key  = var.recaptcha_site_key
  google_analytics_id = var.google_analytics_id
  frontend_dir        = abspath("${path.root}/../../../../frontend")
  docker_dir          = abspath("${path.root}/../../../docker")
  ecr_frontend_name   = "otenki-live/frontend"
}

module "backend_scheduler" {
  source                           = "../../modules/backend/scheduler"
  env                              = local.env
  lambda_live_weather_forecast_arn = module.backend.lambda_live_weather_forecast_arn
  lambda_queue_live_streams_arn    = module.backend.lambda_queue_live_streams_arn
}