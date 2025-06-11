locals {
  suffix = var.env == "prod" ? "" : "-${var.env}"
  base_dir = abspath("${path.root}")
  backend_app_files = [
    for f in fileset("${var.backend_dir}", "app/**/*.py") : abspath("${var.backend_dir}/${f}")
  ]
  backend_files = concat(
    local.backend_app_files,
    [
      "${var.backend_dir}/uv.lock",
      "${path.module}/Dockerfile"
    ]
  )
  backend_content_sha1 = sha1(join("", [for f in local.backend_files : filesha1(f)]))
}


#
# ECR
#
resource "aws_ecr_repository" "backend" {
  name = var.ecr_backend_name
  force_delete = var.env != "prod"
}

resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name
  policy = jsonencode(
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

#
# Backend build
#
resource "null_resource" "build_backend" {
  depends_on = [ aws_ecr_repository.backend ]

  triggers = {
    file_content_sha1 = local.backend_content_sha1
  }

  provisioner "local-exec" {
    command = <<-EOT
      docker build --no-cache --provenance false -t ${aws_ecr_repository.backend.repository_url}:latest -f ${path.module}/Dockerfile ${var.backend_dir} 
      docker login -u AWS -p ${data.aws_ecr_authorization_token.token.password} ${data.aws_ecr_authorization_token.token.proxy_endpoint}
      docker push ${aws_ecr_repository.backend.repository_url}:latest
    EOT
  }
}

#
# Lambda
#
resource "aws_iam_role" "lambda" {
  name = "lambda-role"

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

resource "aws_iam_role_policy_attachment" "lambda" {
  role = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.lambda_access_policy.arn
}

resource "aws_iam_policy" "lambda_access_policy" {
  name = "lambda-access-policy"
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
        ]
        Resource = "*"
      }
    ]
  })
}

# live_weather_forecast
resource "aws_lambda_function" "live_weather_forecast" {
  function_name = "otenki-live-weather-forecast${local.suffix}"
  role = aws_iam_role.lambda.arn
  package_type = "Image"
  image_uri = "${aws_ecr_repository.backend.repository_url}:latest"
  publish = true
  image_config {
    command = ["app.adapter.handler.weather_forecast.lambda_handler"]
  }
  source_code_hash = local.backend_content_sha1
  architectures = ["arm64"]
  timeout = 60
  memory_size = 128

  depends_on = [ null_resource.build_backend ]
}

# queue_live_streams
resource "aws_lambda_function" "queue_live_streams" {
  function_name = "otenki-live-queue-live-streams${local.suffix}"
  role = aws_iam_role.lambda.arn
  package_type = "Image"
  image_uri = "${aws_ecr_repository.backend.repository_url}:latest"
  publish = true
  image_config {
    command = ["app.adapter.handler.queue_live_streams.lambda_handler"]
  }
  source_code_hash = local.backend_content_sha1
  architectures = ["arm64"]
  timeout = 60
  memory_size = 128

  depends_on = [ null_resource.build_backend ]
}

# live_object_detection
resource "aws_lambda_function" "live_object_detection" {
  function_name = "otenki-live-object-detection${local.suffix}"
  role = aws_iam_role.lambda.arn
  package_type = "Image"
  image_uri = "${aws_ecr_repository.backend.repository_url}:latest"
  publish = true
  image_config {
    command = ["app.adapter.handler.live_object_detection.lambda_handler"]
  }
  source_code_hash = local.backend_content_sha1
  architectures = ["arm64"]
  timeout = 180
  memory_size = 1024

  environment {
    variables = {
      XDG_CACHE_HOME = "/tmp"
      CLOTHING_MODEL_WEIGHTS_PATH = "checkpoints/weights-efficientnetv2-2025050301.pth"
      DETECTION_MODEL_WEIGHTS_PATH = "checkpoints/yolov8n.onnx"
      YOUTUBE_COOKIES_PATH = "cookies/www.youtube.com_cookies.txt"
    }
  }

  depends_on = [ null_resource.build_backend ]
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

resource "aws_lambda_event_source_mapping" "live_object_detection_trigger" {
  event_source_arn = aws_sqs_queue.queue_live_streams.arn
  function_name = aws_lambda_function.live_object_detection.arn
  batch_size = 1
}

#
# S3
#
resource "aws_s3_bucket" "backend" {
  bucket = "${var.project}-backend${local.suffix}"
  force_destroy = var.env != "prod"
}

resource "aws_s3_bucket_ownership_controls" "backend" {
  bucket = aws_s3_bucket.backend.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "secure_bucket" {
  bucket  = aws_s3_bucket.backend.id
  block_public_acls = true
  ignore_public_acls = true
  block_public_policy = true
  restrict_public_buckets = true
}