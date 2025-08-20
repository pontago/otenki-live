output "lambda_frontend_arn" {
  value = aws_lambda_function.frontend.arn
  description = "ARN of the Lambda function - otenki-live-frontend"
}

output "lambda_frontend_url" {
  value = aws_lambda_function_url.frontend.function_url
  description = "URL of the Lambda function - otenki-live-frontend"
}

output "cloudfront_frontend_url" {
  value = "https://${aws_cloudfront_distribution.frontend.domain_name}/"
  description = "URL of the CloudFront distribution - otenki-live-frontend"
}