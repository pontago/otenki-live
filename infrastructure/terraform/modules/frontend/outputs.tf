output "lambda_frontend_arn" {
  value = aws_lambda_function.frontend.arn
  description = "ARN of the Lambda function - otenki-live-frontend"
}

output "lambda_frontend_url" {
  value = aws_lambda_function_url.frontend.function_url
  description = "URL of the Lambda function - otenki-live-frontend"
}

output "lambda_frontend_function_name" {
  value = aws_lambda_function.frontend.function_name
  description = "Function name of the Lambda function - otenki-live-frontend"
}

output "lambda_frontend_url_id" {
  value = aws_lambda_function_url.frontend.url_id
  description = "URL ID of the Lambda function - otenki-live-frontend"
}

output "frontend_bucket_regional_domain_name" {
  value = aws_s3_bucket.frontend.bucket_regional_domain_name
  description = "Regional domain name of the S3 bucket - otenki-live-frontend"
}