locals {
  suffix = var.env == "prod" ? "" : "-${var.env}"

  frontend_files = concat(
    [
      for f in fileset("${var.frontend_dir}", ".next/standalone/.next/**/*") : abspath("${var.frontend_dir}/${f}")
    ],
    [
      for f in fileset("${var.frontend_dir}", ".next/standalone/*.{json,js}") : abspath("${var.frontend_dir}/${f}")
    ],
    # [
    #   for f in fileset("${var.frontend_dir}", "app/**/*.{ts,tsx}") : abspath("${var.frontend_dir}/${f}")
    # ],
    # [
    #   for f in fileset("${var.frontend_dir}", "features/**/*.{ts,tsx}") : abspath("${var.frontend_dir}/${f}")
    # ],
    # [
    #   for f in fileset("${var.frontend_dir}", "{lib,components,types,styles}/**/*.{ts,tsx}") : abspath("${var.frontend_dir}/${f}")
    # ],
    # [
    #   for f in fileset("${var.frontend_dir}", "{mocks,tests,.storybook}/**/*.{ts,tsx}") : abspath("${var.frontend_dir}/${f}")
    # ],
    [
      for f in fileset("${var.frontend_dir}", "*.{ts,mjs,json,md,yaml,yml,sh}") : abspath("${var.frontend_dir}/${f}")
    ],
    [
      "${var.docker_dir}/frontend/Dockerfile"
    ]
  )
  frontend_content_sha1 = sha1(join("", [for f in local.frontend_files : filesha1(f)]))

  mime_types = {
    ".css"   = "text/css"
    ".js"    = "application/javascript"
    ".png"   = "image/png"
    ".woff2" = "font/woff2"
  }
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

#
# ECR
#
resource "aws_ecr_repository" "frontend" {
  name         = var.ecr_frontend_name
  force_delete = var.env != "prod"
}

resource "aws_ecr_lifecycle_policy" "frontend" {
  repository = aws_ecr_repository.frontend.name
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

#
# Frontend build
#
resource "null_resource" "build_frontend" {
  depends_on = [aws_ecr_repository.frontend]

  triggers = {
    file_content_sha1 = local.frontend_content_sha1
  }

  provisioner "local-exec" {
    command = <<-EOT
      docker build --provenance false --platform linux/arm64 -t ${aws_ecr_repository.frontend.repository_url}:latest -f ${var.docker_dir}/frontend/Dockerfile ${var.frontend_dir} && \
      docker login -u AWS -p ${data.aws_ecr_authorization_token.token.password} ${data.aws_ecr_authorization_token.token.proxy_endpoint} && \
      docker push ${aws_ecr_repository.frontend.repository_url}:latest
    EOT
  }
}

#
# Lambda
#
resource "aws_iam_role" "frontend_lambda" {
  name = "frontend-lambda-role${local.suffix}"

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

resource "aws_iam_role_policy_attachment" "frontend_lambda" {
  role       = aws_iam_role.frontend_lambda.name
  policy_arn = aws_iam_policy.frontend_lambda_access_policy.arn
}

resource "aws_iam_policy" "frontend_lambda_access_policy" {
  name = "frontend-lambda-access-policy${local.suffix}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
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

resource "aws_lambda_function" "frontend" {
  function_name    = "${var.project}-frontend${local.suffix}"
  role             = aws_iam_role.frontend_lambda.arn
  package_type     = "Image"
  image_uri        = "${aws_ecr_repository.frontend.repository_url}:latest"
  publish          = true
  source_code_hash = local.frontend_content_sha1
  architectures    = ["arm64"]
  timeout          = 60
  memory_size      = 512

  environment {
    variables = {
      SECRET_KEY = var.param_secret_key
    }
  }

  depends_on = [null_resource.build_frontend]
}

resource "aws_lambda_function_url" "frontend" {
  function_name      = aws_lambda_function.frontend.function_name
  authorization_type = "AWS_IAM"
  invoke_mode        = "RESPONSE_STREAM"
}

#
# S3
#
resource "aws_s3_bucket" "frontend" {
  bucket        = "${var.project}-frontend${local.suffix}"
  force_destroy = var.env != "prod"
}

resource "aws_s3_bucket_ownership_controls" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "frontend_s3_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend_s3_policy.json
}

data "aws_iam_policy_document" "frontend_s3_policy" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.frontend.arn}/*"
    ]
  }
}

resource "aws_s3_object" "frontend_static_assets" {
  for_each = fileset("${var.frontend_dir}/.next/static", "**/*")

  bucket       = aws_s3_bucket.frontend.id
  key          = "_next/static/${each.value}"
  source       = "${var.frontend_dir}/.next/static/${each.value}"
  etag         = filemd5("${var.frontend_dir}/.next/static/${each.value}")
  content_type = lookup(local.mime_types, lower(regex("\\.[^.]+$", each.value)), "application/octet-stream")
}

resource "aws_s3_object" "frontend_public_assets" {
  for_each = fileset("${var.frontend_dir}/public", "**/*")

  bucket       = aws_s3_bucket.frontend.id
  key          = "public/${each.value}"
  source       = "${var.frontend_dir}/public/${each.value}"
  etag         = filemd5("${var.frontend_dir}/public/${each.value}")
  content_type = lookup(local.mime_types, lower(regex("\\.[^.]+$", each.value)), "application/octet-stream")
}