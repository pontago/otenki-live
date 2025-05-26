# terraform {
#   required_version = ">=1.7"

#   required_providers {
#     aws = {
#       source = "hashicorp/aws"
#       version = "~> 5.0"
#     }
#   }
# }

module "app" {
  source = "../../modules"
}

provider "aws" {
  #region = "ap-northeast-1"
  # skip_credentials_validation = true
  # skip_requesting_account_id = true
  # skip_metadata_api_check = true
  # access_key = "dummy"
  # secret_key = "dummy"

  # endpoints {
  #   apigatewayv2 = "http://localhost:4566"
  #   dynamodb = "http://localhost:4566"
  #   lambda = "http://localhost:4566"
  #   sqs = "http://localhost:4566"
  #   s3 = "http://localhost:4566"
  # }
}

module "backend" {
  source = "../../modules/backend"
  env = "dev"
  runtime = "python3.13"
  # environment = {
  #   "DYNAMODB_BILLING_MODE" = "PAY_PER_REQUEST"
  # }

  # providers = {
  #   aws = aws
  # }
}

output "lambda_live_weather_forecast_arn" {
  value = module.backend.lambda_live_weather_forecast_arn
}

output "lambda_queue_live_streams_arn" {
  value = module.backend.lambda_queue_live_streams_arn
}

output "sqs_queue_live_streams_arn" {
  value = module.backend.sqs_queue_live_streams_arn
}