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
  env = "dev"
  project = "otenki-live"
  # ecr_backend_name = "otenki-live/backend"
  #backend_dir = abspath("${path.root}/../../../../backend")
  # base_dir = abspath("${path.root}")
  # backend_content_sha1 = sha1(join("", [for f in fileset("${local.backend_dir}/app", "${local.backend_dir}/uv.lock"): filesha1(f)]))
  # suffix = local.env == "prod" ? "" : "-${local.env}"
}

module "app" {
  source = "../../modules"
}

provider "aws" {
  # profile = "otenki-live-dev"

  default_tags {
    tags = {
      Environment = local.env,
      Project = local.project,
    }
  }

  region = "ap-northeast-1"
  # skip_credentials_validation = true
  # skip_requesting_account_id = true
  # skip_metadata_api_check = true
  # access_key = "dummy"
  # secret_key = "dummy"

  # endpoints {
  #   apigatewayv2 = "http://localhost:4566"
  #   dynamodb = "http://localhost:4566"
  #   lambda = "http://localhost:4566"
  #   sqs = "http://localhost:4566"
  #   s3 = "http://localhost:4566"
  # }
}

module "backend" {
  source = "../../modules/backend"
  env = local.env
  project = local.project
  backend_dir = abspath("${path.root}/../../../../backend")
  ecr_backend_name = "otenki-live/backend"
}

# output "lambda_live_weather_forecast_arn" {
#   value = module.backend.lambda_live_weather_forecast_arn
# }

# output "lambda_queue_live_streams_arn" {
#   value = module.backend.lambda_queue_live_streams_arn
# }

# output "sqs_queue_live_streams_arn" {
#   value = module.backend.sqs_queue_live_streams_arn
# }





# resource "aws_vpc" "main" {
#   cidr_block           = "10.0.0.0/16"
#   enable_dns_support   = true
#   enable_dns_hostnames = true
# }

# resource "aws_subnet" "public_a" {
#   vpc_id                  = aws_vpc.main.id
#   cidr_block              = "10.0.1.0/24"
#   availability_zone       = "ap-northeast-1a"
#   map_public_ip_on_launch = true
# }

# resource "aws_internet_gateway" "igw" {
#   vpc_id = aws_vpc.main.id
# }

# resource "aws_route_table" "public_rt" {
#   vpc_id = aws_vpc.main.id
# }

# resource "aws_route" "public_route" {
#   route_table_id         = aws_route_table.public_rt.id
#   destination_cidr_block = "0.0.0.0/0"
#   gateway_id             = aws_internet_gateway.igw.id
# }

# resource "aws_route_table_association" "public_a_assoc" {
#   subnet_id      = aws_subnet.public_a.id
#   route_table_id = aws_route_table.public_rt.id
# }

# # Lambda + EFS 用のセキュリティグループ
# resource "aws_security_group" "lambda_sg" {
#   name        = "lambda-sg"
#   description = "Allow Lambda - EFS traffic"
#   vpc_id      = aws_vpc.main.id

#   ingress {
#     from_port   = 2049
#     to_port     = 2049
#     protocol    = "tcp"
#     self        = true
#     description = "NFS access between Lambda and EFS"
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }

# resource "aws_iam_role" "lambda" {
#   name = "example-role"

#   assume_role_policy = <<EOF
# {
#     "Version": "2012-10-17",
#     "Statement": [
#         {
#             "Effect": "Allow",
#             "Principal": {
#                 "Service": "lambda.amazonaws.com"
#             },
#             "Action": "sts:AssumeRole"
#         }
#     ]
# }
# EOF
# }

# resource "aws_iam_role_policy_attachment" "lambda_vpc_managed_policy" {
#   role       = aws_iam_role.lambda.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
# }

# resource "aws_lambda_function" "efs_lambda" {
#   function_name = "efsLambda"
#   role          = aws_iam_role.lambda.arn
#   runtime       = "python3.13"
#   handler       = "main.lambda_handler"
#   filename      = "/Users/pontago/Downloads/lambda_test/lambda_test.zip"

#   # file_system_config {
#   #   arn              = aws_efs_access_point.lambda_ap.arn
#   #   local_mount_path = "/mnt/efs"
#   # }

#   vpc_config {
#     subnet_ids         = [aws_subnet.public_a.id]
#     security_group_ids = [aws_security_group.lambda_sg.id]
#   }
# }






# resource "aws_ecr_repository" "backend" {
#   name = local.ecr_backend_name
#   force_delete = true
# }

# resource "aws_ecr_lifecycle_policy" "backend" {
#   policy = jsonencode(
#     {
#       rules = [
#         {
#           action = {
#             type = "expire"
#           }
#           rulePriority = 1
#           selection = {
#             countNumber = 1
#             countType   = "imageCountMoreThan"
#             tagStatus   = "any"
#           }
#         },
#       ]
#     }
#   )
#   repository = aws_ecr_repository.backend.name
# }

# data "aws_ecr_authorization_token" "token" {}

# resource "null_resource" "build_backend" {
#   depends_on = [ aws_ecr_repository.backend ]

#   triggers = {
#     file_content_sha1 = local.backend_content_sha1
#   }

#   provisioner "local-exec" {
#     command = <<-EOT
#       cd ${local.backend_dir}
#       uv -q export --frozen --no-dev --no-editable -o requirements.txt
#       uv -q pip install --no-installer-metadata --no-compile-bytecode --upgrade --python-platform aarch64-manylinux_2_28 --python 3.13 -r requirements.txt --target ${local.base_dir}/packages
#       cd ${local.base_dir}
#       docker build --no-cache --provenance false -t ${aws_ecr_repository.backend.repository_url}:latest .
#       docker login -u AWS -p ${data.aws_ecr_authorization_token.token.password} ${data.aws_ecr_authorization_token.token.proxy_endpoint}
#       docker push ${aws_ecr_repository.backend.repository_url}:latest
#       rm -rf ${local.base_dir}/packages
#     EOT
#   }
# }

# resource "aws_lambda_function" "live_weather_forecast" {
#   function_name = "otenki-live-weather-forecast${local.suffix}"
#   role = aws_iam_role.lambda.arn
#   package_type = "Image"
#   image_uri    = "${aws_ecr_repository.backend.repository_url}:latest"
#   publish      = true
#   # handler = "app.adapter.handler.weather_forecast.lambda_handler"
#   image_config {
#     command = ["app.adapter.handler.weather_forecast.lambda_handler"]
#   }
#   source_code_hash = local.backend_content_sha1
#   # runtime = "python3.13"
#   architectures = ["arm64"]
#   timeout = 300
#   memory_size = 128

#   depends_on = [ null_resource.build_backend ]
# }

# resource "aws_iam_role" "lambda" {
#   name = "lambda-role"

#   assume_role_policy = <<EOF
# {
#     "Version": "2012-10-17",
#     "Statement": [
#         {
#             "Effect": "Allow",
#             "Principal": {
#                 "Service": "lambda.amazonaws.com"
#             },
#             "Action": "sts:AssumeRole"
#         }
#     ]
# }
# EOF
# }

# resource "aws_iam_role_policy_attachment" "lambda" {
#   role       = aws_iam_role.lambda.name
#   policy_arn = aws_iam_policy.lambda_custom.arn
# }

# resource "aws_iam_policy" "lambda_custom" {
#   name   = "lambda-custom-policy"
#   policy = <<EOF
# {
#     "Version": "2012-10-17",
#     "Statement": [
#         {
#             "Effect": "Allow",            
#             "Action": [
#               "dynamodb:*",
#               "logs:CreateLogGroup",
#               "logs:CreateLogStream",
#               "logs:PutLogEvents"
#             ],
#             "Resource": "*"
#         }
#     ]
# }
# EOF
# }

# resource "aws_s3_bucket" "backend" {
#   bucket = "${local.project}-backend${local.suffix}"
#   force_destroy = true
# }

# resource "aws_s3_bucket_ownership_controls" "backend" {
#   bucket = aws_s3_bucket.backend.id

#   rule {
#     object_ownership = "BucketOwnerEnforced"
#   }
# }

# resource "aws_s3_bucket_public_access_block" "secure_bucket" {
#   bucket                  = aws_s3_bucket.backend.id
#   block_public_acls       = true
#   ignore_public_acls      = true
#   block_public_policy     = true
#   restrict_public_buckets = true
# }