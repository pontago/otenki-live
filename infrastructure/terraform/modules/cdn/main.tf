locals {
  suffix = var.env == "prod" ? "" : "-${var.env}"
}

#
# CloudFront
#
data "aws_cloudfront_origin_request_policy" "all_except_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_origin_access_identity" "frontend" {}

resource "aws_cloudfront_origin_access_control" "lambda_oac" {
  name                              = "lambda-oac${local.suffix}"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "frontend_s3_oac" {
  name                              = "frontend-s3-oac${local.suffix}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_function" "restrict_host" {
  name    = "restrict-host${local.suffix}"
  runtime = "cloudfront-js-2.0"
  code    = <<EOT
function handler(event) {
    var request = event.request;
    var headers = request.headers;

    if (headers.host.value !== "${var.fqdn}") {
        return {
            statusCode: 403,
            statusDescription: "Forbidden"
        };
    }
    return request;
}
EOT
}

resource "aws_cloudfront_distribution" "app" {
  enabled = true
  comment = "${var.project}${local.suffix}"

  origin {
    domain_name              = var.frontend_fqdn
    origin_id                = "frontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.lambda_oac.id
    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name              = var.backend_fqdn
    origin_id                = "api"
    origin_access_control_id = aws_cloudfront_origin_access_control.lambda_oac.id
    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name              = var.frontend_bucket_regional_domain_name
    origin_id                = "frontend-static"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend_s3_oac.id
    origin_path              = "/public"
  }

  origin {
    domain_name              = var.frontend_bucket_regional_domain_name
    origin_id                = "frontend-nextjs"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend_s3_oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "frontend"
    viewer_protocol_policy = "redirect-to-https"

    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_except_host.id
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id

    dynamic "function_association" {
      for_each = var.fqdn != null ? [1] : []
      content {
        event_type   = "viewer-request"
        function_arn = aws_cloudfront_function.restrict_host.arn
      }
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/api/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "api"
    viewer_protocol_policy = "redirect-to-https"

    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_except_host.id
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
  }

  ordered_cache_behavior {
    path_pattern           = "/optimized/*"
    target_origin_id       = "frontend-static"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]

    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_except_host.id
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  ordered_cache_behavior {
    path_pattern           = "/_next/static/*"
    target_origin_id       = "frontend-nextjs"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]

    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_except_host.id
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.cert_arn == null ? true : false
    acm_certificate_arn            = var.cert_arn
    ssl_support_method             = var.cert_arn == null ? null : "sni-only"
    minimum_protocol_version       = var.cert_arn == null ? null : "TLSv1.2_2021"
  }

  aliases = var.fqdn != null ? [var.fqdn] : []
}

#
# Lambda Permission
#
resource "aws_lambda_permission" "api" {
  statement_id           = "AllowExecutionFromCloudFront"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = var.lambda_api_function_name
  principal              = "cloudfront.amazonaws.com"
  source_arn             = aws_cloudfront_distribution.app.arn
  function_url_auth_type = "AWS_IAM"
}

resource "aws_lambda_permission" "frontend" {
  statement_id           = "AllowExecutionFromCloudFront"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = var.lambda_frontend_function_name
  principal              = "cloudfront.amazonaws.com"
  source_arn             = aws_cloudfront_distribution.app.arn
  function_url_auth_type = "AWS_IAM"
}