locals {
  suffix = var.env == "prod" ? "" : "-${var.env}"

  backend_files = concat(
    [
      for f in fileset("${var.backend_dir}", "app/**/*.py") : abspath("${var.backend_dir}/${f}")
    ],
    [
      "${var.backend_dir}/uv.lock",
      "${var.docker_dir}/backend/Dockerfile"
    ]
  )
  backend_content_sha1 = sha1(join("", [for f in local.backend_files : filesha1(f)]))
  ffmpeg_content_sha1  = filesha1("${var.docker_dir}/ffmpeg/Dockerfile")
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

data "aws_region" "current" {}

#
# ECR
#
resource "aws_ecrpublic_repository" "ffmpeg" {
  provider        = aws.us_east_1
  repository_name = var.ecr_ffmpeg_name
}

resource "aws_ecr_repository" "backend" {
  name         = var.ecr_backend_name
  force_delete = var.env != "prod"
}

resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name
  policy     = jsonencode(
    {
      rules = [
        {
          action = {
            type = "expire"
          }
          rulePriority = 1
          selection = {
            countNumber = 1
            countType   = "imageCountMoreThan"
            tagStatus   = "any"
          }
        },
      ]
    }
  )
}

data "aws_ecr_authorization_token" "token" {}
data "aws_ecrpublic_authorization_token" "token" {
  provider = aws.us_east_1
}

#
# Backend build
#
resource "null_resource" "build_ffmpeg" {
  depends_on = [aws_ecrpublic_repository.ffmpeg]

  triggers = {
    file_content_sha1 = local.ffmpeg_content_sha1
  }

  provisioner "local-exec" {
    command = <<-EOT
      docker build --provenance false -t ${aws_ecrpublic_repository.ffmpeg.repository_uri}:latest -f ${var.docker_dir}/ffmpeg/Dockerfile . && \
      docker login -u AWS -p ${data.aws_ecrpublic_authorization_token.token.password} public.ecr.aws && \
      docker push ${aws_ecrpublic_repository.ffmpeg.repository_uri}:latest
    EOT
  }
}

resource "null_resource" "build_backend" {
  depends_on = [aws_ecr_repository.backend, null_resource.build_ffmpeg]

  triggers = {
    file_content_sha1 = local.backend_content_sha1
  }

  provisioner "local-exec" {
    command = <<-EOT
      docker build --provenance false -t ${aws_ecr_repository.backend.repository_url}:latest -f ${var.docker_dir}/backend/Dockerfile ${var.backend_dir} && \
      docker login -u AWS -p ${data.aws_ecr_authorization_token.token.password} ${data.aws_ecr_authorization_token.token.proxy_endpoint} && \
      docker push ${aws_ecr_repository.backend.repository_url}:latest
    EOT
  }
}

#
# Lambda
#
resource "aws_iam_role" "backend_lambda" {
  name = "backend-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "backend_lambda" {
  role       = aws_iam_role.backend_lambda.name
  policy_arn = aws_iam_policy.backend_lambda_access_policy.arn
}

resource "aws_iam_policy" "backend_lambda_access_policy" {
  name = "backend-lambda-access-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:*",
          "s3:*",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:GetQueueUrl",
          "sqs:SendMessage",
          "ses:SendEmail",
        ]
        Resource = "*"
      }
    ]
  })
}

# live_weather_forecast
resource "aws_lambda_function" "live_weather_forecast" {
  function_name  = "otenki-live-weather-forecast${local.suffix}"
  role           = aws_iam_role.backend_lambda.arn
  package_type   = "Image"
  image_uri      = "${aws_ecr_repository.backend.repository_url}:latest"
  publish        = true
  image_config {
    command = ["app.adapter.handler.weather_forecast.lambda_handler"]
  }
  source_code_hash = local.backend_content_sha1
  architectures    = ["arm64"]
  timeout          = 120
  memory_size      = 128

  environment {
    variables = {
      LOGURU_LEVEL = var.log_level
    }
  }

  depends_on = [null_resource.build_backend]
}

# queue_live_streams
resource "aws_lambda_function" "queue_live_streams" {
  function_name  = "otenki-live-queue-live-streams${local.suffix}"
  role           = aws_iam_role.backend_lambda.arn
  package_type   = "Image"
  image_uri      = "${aws_ecr_repository.backend.repository_url}:latest"
  publish        = true
  image_config {
    command = ["app.adapter.handler.queue_live_streams.lambda_handler"]
  }
  source_code_hash = local.backend_content_sha1
  architectures    = ["arm64"]
  timeout          = 60
  memory_size      = 128

  environment {
    variables = {
      LOGURU_LEVEL = var.log_level
    }
  }

  depends_on = [null_resource.build_backend]
}

# live_object_detection
resource "aws_lambda_function" "live_object_detection" {
  function_name  = "otenki-live-object-detection${local.suffix}"
  role           = aws_iam_role.backend_lambda.arn
  package_type   = "Image"
  image_uri      = "${aws_ecr_repository.backend.repository_url}:latest"
  publish        = true
  image_config {
    command = ["app.adapter.handler.live_object_detection.lambda_handler"]
  }
  source_code_hash = local.backend_content_sha1
  architectures    = ["arm64"]
  timeout          = 180
  memory_size      = 1024

  environment {
    variables = {
      XDG_CACHE_HOME               = "/tmp"
      CLOTHING_MODEL_WEIGHTS_PATH  = var.clothing_model_weights_path
      DETECTION_MODEL_WEIGHTS_PATH = var.detection_model_weights_path
      YOUTUBE_COOKIES_PATH         = var.youtube_cookies_path
      LOGURU_LEVEL                 = var.log_level
    }
  }

  depends_on = [null_resource.build_backend]
}

# api
resource "aws_lambda_function" "api" {
  function_name  = "otenki-live-api${local.suffix}"
  role           = aws_iam_role.backend_lambda.arn
  package_type   = "Image"
  image_uri      = "${aws_ecr_repository.backend.repository_url}:latest"
  publish        = true
  image_config {
    command = ["app.adapter.api.main.handler"]
  }
  source_code_hash = local.backend_content_sha1
  architectures    = ["arm64"]
  timeout          = 60
  memory_size      = 512

  environment {
    variables = {
      LOGURU_LEVEL = var.log_level
    }
  }

  depends_on = [null_resource.build_backend]
}

resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "AWS_IAM"
}

#
# CloudFront
#
resource "aws_cloudfront_origin_access_control" "backend_lambda_oac" {
  name                              = "backend-lambda-oac"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_origin_request_policy" "all_except_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "api" {
  enabled = true

  origin {
    domain_name              = "${aws_lambda_function_url.api.url_id}.lambda-url.${data.aws_region.current.name}.on.aws"
    origin_id                = "api"
    origin_access_control_id = aws_cloudfront_origin_access_control.backend_lambda_oac.id
    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "api"
    viewer_protocol_policy = "redirect-to-https"

    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_except_host.id
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # aliases = ["api.example.com"]
}

resource "aws_lambda_permission" "api" {
  statement_id           = "AllowExecutionFromCloudFront"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.api.function_name
  principal              = "cloudfront.amazonaws.com"
  source_arn             = aws_cloudfront_distribution.api.arn
  function_url_auth_type = "AWS_IAM"
}

#
# SQS
#
resource "aws_sqs_queue" "queue_live_streams" {
  name                       = "otenki-live-queue-live-streams${local.suffix}"
  #message_retention_seconds = 60 * 8
  message_retention_seconds  = 60 * 5
  visibility_timeout_seconds = 215 # lambda_timeout + batch_window + 30s (3min)
  receive_wait_time_seconds  = 5
}

resource "aws_lambda_event_source_mapping" "live_object_detection_trigger" {
  event_source_arn = aws_sqs_queue.queue_live_streams.arn
  function_name    = aws_lambda_function.live_object_detection.arn
  batch_size       = 1
}

#
# SES
#
resource "aws_ses_email_identity" "backend" {
  email = var.ses_sender_email
}

#
# S3
#
resource "aws_s3_bucket" "backend" {
  bucket        = "${var.project}-backend${local.suffix}"
  force_destroy = var.env != "prod"
}

resource "aws_s3_bucket_ownership_controls" "backend" {
  bucket = aws_s3_bucket.backend.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "backend" {
  bucket                  = aws_s3_bucket.backend.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}