output "lambda_live_weather_forecast_arn" {
  value = aws_lambda_function.live_weather_forecast.arn
  description = "ARN of the Lambda function - otenki-live-weather-forecast"
}

output "lambda_queue_live_streams_arn" {
  value = aws_lambda_function.queue_live_streams.arn
  description = "ARN of the Lambda function - otenki-live-queue-live-streams"
}

output "sqs_queue_live_streams_arn" {
  value = aws_sqs_queue.queue_live_streams.arn
  description = "ARN of the SQS queue - otenki-live-queue-live-streams"
}

output "lambda_api_arn" {
  value = aws_lambda_function.api.arn
  description = "ARN of the Lambda function - otenki-live-api"
}

output "lambda_api_url" {
  value = aws_lambda_function_url.api.function_url
  description = "URL of the Lambda function - otenki-live-api"
}

output "cloudfront_api_url" {
  value = "https://${aws_cloudfront_distribution.api.domain_name}/"
  description = "URL of the CloudFront distribution - otenki-live-api"
}