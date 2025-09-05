output "cloudfront_app_url" {
  value = "https://${aws_cloudfront_distribution.app.domain_name}/"
  description = "URL of the CloudFront distribution - otenki-live"
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.app.id
  description = "ID of the CloudFront distribution"
}

output "cloudfront_distribution_arn" {
  value = aws_cloudfront_distribution.app.arn
  description = "ARN of the CloudFront distribution"
}