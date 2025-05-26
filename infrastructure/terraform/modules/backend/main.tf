# terraform {
#   required_version = ">=1.7"

#   required_providers {
#     aws = {
#       source = "hashicorp/aws"
#       version = "~> 5.0"
#     }
#   }
# }

locals {
  suffix = var.env == "prod" ? "" : "-${var.env}"
}

# provider "aws" {
#   region = var.region
#   # skip_credentials_validation = var.env == "dev"
#   # skip_requesting_account_id = var.env == "dev"
#   # skip_metadata_api_check = var.env == "dev"
# }

#
# Lambda
#
data "external" "backend_build" {
  program = ["${path.root}/../../../shell/build_backend.sh", "${path.root}/../../../../backend/"]
}

data "archive_file" "backend_archive" {
  type = "zip"
  source_dir = data.external.backend_build.result.backend_dir
  output_path = ".terraform/backend.zip"
}

# live_weather_forecast
resource "aws_lambda_function" "live_weather_forecast" {
  filename = data.archive_file.backend_archive.output_path
  function_name = "otenki-live-weather-forecast${local.suffix}"
  role = "arn:aws:iam::000000000000:role/lambda-role"
  handler = "app.adapter.handler.weather_forecast.lambda_handler"
  source_code_hash = data.archive_file.backend_archive.output_base64sha256
  runtime = var.runtime
  timeout = 300
  memory_size = 128
}

# queue_live_streams
resource "aws_lambda_function" "queue_live_streams" {
  filename = data.archive_file.backend_archive.output_path
  function_name = "otenki-live-queue-live-streams${local.suffix}"
  role = "arn:aws:iam::000000000000:role/lambda-role"
  handler = "app.adapter.handler.queue_live_streams.lambda_handler"
  source_code_hash = data.archive_file.backend_archive.output_base64sha256
  runtime = var.runtime
  timeout = 300
  memory_size = 128
}

#
# SQS
#
resource "aws_sqs_queue" "queue_live_streams" {
  name = "otenki-live-queue-live-streams${local.suffix}"
  #message_retention_seconds = 60 * 8
  message_retention_seconds = 60 * 5
  visibility_timeout_seconds = 215 # lambda_timeout + batch_window + 30s (3min)
  receive_wait_time_seconds = 5
}

# resource "aws_lambda_event_source_mapping" "live-object-detection-trigger" {
#   event_source_arn = aws_sqs_queue.queue_live_streams.arn
#   function_name = aws_lambda_function.backend_app.arn
#   batch_size = 1
# }