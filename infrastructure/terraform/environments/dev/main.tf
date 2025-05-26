# terraform {
#   required_version = ">=1.7"

#   required_providers {
#     aws = {
#       source = "hashicorp/aws"
#       version = "~> 5.0"
#     }
#   }
# }

# provider "aws" {
#   alias = "dev"
  # access_key = "dummy"
  # secret_key = "dummy"
  # skip_credentials_validation = true
  # skip_requesting_account_id = true
  # skip_metadata_api_check = true

  # endpoints {
  #   apigatewayv2 = "http://localhost:4566"
  #   dynamodb = "http://localhost:4566"
  #   lambda = "http://localhost:4566"
  #   sqs = "http://localhost:4566"
  #   s3 = "http://localhost:4566"
  # }
# }

module "app" {
  source = "../../modules"
}

module "backend" {
  source = "../../modules/backend"
  env = "dev"
  region = "ap-northeast-1"
  runtime = "python3.13"

  # providers = {
  #   aws = aws
  # }
}

# output "lambda_live_weather_forecast_arn" {
#   value = module.app.live_weather_forecast.arn # aws_lambda_function.live_weather_forecast.arn
#   description = "ARN of the Lambda function - otenki-live-weather-forecast"
# }

# output "lambda_queue_live_streams_arn" {
#   value = aws_lambda_function.queue_live_streams.arn
#   description = "ARN of the Lambda function - otenki-live-queue-live-streams"
# }