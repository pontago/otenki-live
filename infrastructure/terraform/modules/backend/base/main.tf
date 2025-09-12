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
data "aws_caller_identity" "current" {}
data "google_project" "project" {
  project_id = var.gcp_project_id
}

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
      docker build --provenance false --platform linux/arm64 -t ${aws_ecrpublic_repository.ffmpeg.repository_uri}:latest -f ${var.docker_dir}/ffmpeg/Dockerfile . && \
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
      docker build --provenance false --platform linux/arm64 -t ${aws_ecr_repository.backend.repository_url}:latest -f ${var.docker_dir}/backend/Dockerfile ${var.backend_dir} && \
      docker login -u AWS -p ${data.aws_ecr_authorization_token.token.password} ${data.aws_ecr_authorization_token.token.proxy_endpoint} && \
      docker push ${aws_ecr_repository.backend.repository_url}:latest
    EOT
  }
}

#
# Lambda
#
resource "aws_iam_role" "backend_lambda" {
  name = "backend-lambda-role${local.suffix}"

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
  name = "backend-lambda-access-policy${local.suffix}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:*",
        ]
        Resource = "arn:aws:dynamodb:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:table/*",
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Environment" = var.env,
            "aws:ResourceTag/Project"     = var.project,
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:GetQueueUrl",
          "sqs:SendMessage",
        ]
        Resource = "arn:aws:sqs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*",
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Environment" = var.env,
            "aws:ResourceTag/Project"     = var.project,
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "s3:*",
        ]
        Resource = [
          "${aws_s3_bucket.backend.arn}/*",
        ],
      },
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
        ]
        Resource = [
          "${aws_ses_email_identity.backend.arn}",
        ],
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:*",
      },
    ]
  })
}

# live_weather_forecast
resource "aws_lambda_function" "live_weather_forecast" {
  function_name  = "${var.project}-weather-forecast${local.suffix}"
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
      ENV          = var.env
    }
  }

  depends_on = [null_resource.build_backend]
}

# queue_live_streams
resource "aws_lambda_function" "queue_live_streams" {
  function_name  = "${var.project}-queue-live-streams${local.suffix}"
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
      ENV          = var.env
    }
  }

  depends_on = [null_resource.build_backend]
}

# live_object_detection
resource "aws_lambda_function" "live_object_detection" {
  function_name  = "${var.project}-object-detection${local.suffix}"
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
      ENV                          = var.env
    }
  }

  depends_on = [null_resource.build_backend]
}

# api
resource "aws_lambda_function" "api" {
  function_name  = "${var.project}-api${local.suffix}"
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
      LOGURU_LEVEL              = var.log_level
      ENV                       = var.env
      CORS                      = var.cors
      RECAPTCHA_SITE_KEY        = var.recaptcha_site_key
      GCP_PROJECT_ID            = var.gcp_project_id
      GCP_PROJECT_NUMBER        = data.google_project.project.number
      GCP_SERVICE_ACCOUNT_EMAIL = var.gcp_service_account_email
      GCP_POOL_ID               = var.gcp_pool_id
      GCP_PROVIDER_ID           = var.gcp_provider_id
    }
  }

  depends_on = [null_resource.build_backend]
}

resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "AWS_IAM"
}

#
# SQS
#
resource "aws_sqs_queue" "queue_live_streams" {
  name                       = "${var.project}-queue-live-streams${local.suffix}"
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