locals {
  suffix = var.env == "prod" ? "" : "-${var.env}"
}

#
# AWS
#
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["a031c46782e6e6c662c2c87c76da9aa62ccabd8e"]
}

resource "aws_iam_role" "github_actions_role" {
  name = "github-actions-role${local.suffix}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repository}:*" 
          }
        }
      }
    ]
  })
}

resource "aws_iam_policy" "github_actions_deploy_policy" {
  name = "github-actions-deploy-policy${local.suffix}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "acm:RequestCertificate",
          "cloudfront:CreateOriginAccessControl",
          "cloudfront:ListCachePolicies",
          "cloudfront:ListOriginRequestPolicies",
          "cloudfront:ListTagsForResource",
          "ecr-public:DescribeRepositories",
          "ecr-public:GetAuthorizationToken",
          "ecr:GetAuthorizationToken",
          "lambda:CreateEventSourceMapping",
          "lambda:ListTags",
          "s3:GetBucketAcl",
          "s3:GetBucketCORS",
          "s3:GetBucketPolicy",
          "ses:DeleteIdentity",
          "ses:GetIdentityVerificationAttributes",
          "ses:VerifyEmailIdentity",
          "sts:GetCallerIdentity",
          "sts:GetServiceBearerToken",
          "iam:GetOpenIDConnectProvider",
          "scheduler:GetSchedule"
        ]
        Resource = "*"
      },

      # ACM
      {
        Effect = "Allow"
        Action = ["acm:DescribeCertificate","acm:ListTagsForCertificate"]
        Resource = "arn:aws:acm:us-east-1:${data.aws_caller_identity.current.account_id}:certificate/*"
      },

      # CloudFront
      {
        Effect = "Allow"
        Action = "cloudfront:GetCachePolicy"
        Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:cache-policy/*"
      },
      {
        Effect = "Allow"
        Action = ["cloudfront:DeleteDistribution","cloudfront:GetDistribution","cloudfront:UpdateDistribution"]
        Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/*"
      },
      {
        Effect = "Allow"
        Action = ["cloudfront:CreateFunction","cloudfront:DescribeFunction","cloudfront:GetFunction","cloudfront:PublishFunction"]
        Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:function/*"
      },
      {
        Effect = "Allow"
        Action = ["cloudfront:DeleteOriginAccessControl","cloudfront:GetOriginAccessControl","cloudfront:UpdateOriginAccessControl"]
        Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:origin-access-control/*"
      },
      {
        Effect = "Allow"
        Action = ["cloudfront:CreateCloudFrontOriginAccessIdentity","cloudfront:DeleteCloudFrontOriginAccessIdentity","cloudfront:GetCloudFrontOriginAccessIdentity"]
        Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:origin-access-identity/*"
      },
      {
        Effect = "Allow"
        Action = ["cloudfront:CreateOriginRequestPolicy","cloudfront:GetOriginRequestPolicy"]
        Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:origin-request-policy/*"
      },

      # ECR Public
      {
        Effect = "Allow"
        Action = [
          "ecr-public:BatchCheckLayerAvailability",
          "ecr-public:CompleteLayerUpload",
          "ecr-public:CreateRepository",
          "ecr-public:DeleteRepository",
          "ecr-public:GetRepositoryCatalogData",
          "ecr-public:InitiateLayerUpload",
          "ecr-public:ListTagsForResource",
          "ecr-public:PutImage",
          "ecr-public:TagResource",
          "ecr-public:UploadLayerPart"
        ]
        Resource = "arn:aws:ecr-public::${data.aws_caller_identity.current.account_id}:repository/*"
      },

      # ECR Private
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:BatchGetImage",
          "ecr:CompleteLayerUpload",
          "ecr:CreateRepository",
          "ecr:DeleteLifecyclePolicy",
          "ecr:DeleteRepository",
          "ecr:DescribeRepositories",
          "ecr:GetLifecyclePolicy",
          "ecr:GetRepositoryPolicy",
          "ecr:InitiateLayerUpload",
          "ecr:ListTagsForResource",
          "ecr:PutImage",
          "ecr:PutLifecyclePolicy",
          "ecr:SetRepositoryPolicy",
          "ecr:TagResource",
          "ecr:UploadLayerPart"
        ]
        Resource = "arn:aws:ecr:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:repository/*"
      },

      # IAM Policies
      {
        Effect = "Allow"
        Action = [
          "iam:CreatePolicy",
          "iam:CreatePolicyVersion",
          "iam:DeletePolicy",
          "iam:DeletePolicyVersion",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:ListPolicyVersions"
        ]
        Resource = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/*"
      },

      # IAM Roles
      {
        Effect = "Allow"
        Action = [
          "iam:AttachRolePolicy",
          "iam:CreateRole",
          "iam:CreateServiceLinkedRole",
          "iam:DeleteRole",
          "iam:DeleteRolePolicy",
          "iam:DetachRolePolicy",
          "iam:GetRole",
          "iam:GetRolePolicy",
          "iam:ListAttachedRolePolicies",
          "iam:ListInstanceProfilesForRole",
          "iam:ListRolePolicies",
          "iam:PutRolePolicy"
        ]
        Resource = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/*"
      },

      # KMS
      {
        Effect = "Allow"
        Action = [
          "kms:CreateGrant",
          "kms:Decrypt",
          "kms:DescribeKey",
          "kms:Encrypt",
          "kms:GenerateDataKey"
        ]
        Resource = "arn:aws:kms:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:key/*"
      },

      # Lambda Event Source Mapping
      {
        Effect = "Allow"
        Action = "lambda:GetEventSourceMapping"
        Resource = "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:event-source-mapping:*"
      },

      # Lambda Functions
      {
        Effect = "Allow"
        Action = [
          "lambda:AddPermission",
          "lambda:CreateFunction",
          "lambda:CreateFunctionUrlConfig",
          "lambda:DeleteFunction",
          "lambda:GetFunction",
          "lambda:GetFunctionConfiguration",
          "lambda:GetFunctionUrlConfig",
          "lambda:GetPolicy",
          "lambda:ListVersionsByFunction",
          "lambda:PublishVersion",
          "lambda:RemovePermission",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:UpdateFunctionUrlConfig"
        ]
        Resource = "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:*"
      },

      # S3
      {
        Effect = "Allow"
        Action = [
          "s3:CreateBucket",
          "s3:GetAccelerateConfiguration",
          "s3:GetBucketLogging",
          "s3:GetBucketObjectLockConfiguration",
          "s3:GetBucketOwnershipControls",
          "s3:GetBucketPublicAccessBlock",
          "s3:GetBucketRequestPayment",
          "s3:GetBucketTagging",
          "s3:GetBucketVersioning",
          "s3:GetBucketWebsite",
          "s3:GetEncryptionConfiguration",
          "s3:GetLifecycleConfiguration",
          "s3:GetReplicationConfiguration",
          "s3:PutBucketOwnershipControls",
          "s3:PutBucketPolicy",
          "s3:PutBucketPublicAccessBlock",
          "s3:PutBucketTagging",
          "s3:ListBucket",
        ]
        Resource = "arn:aws:s3:::*",
      },

      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectTagging",
          "s3:PutObject",
          "s3:PutObjectTagging",
          "s3:DeleteObject",
        ]
        Resource = "arn:aws:s3:::*/*",
        
      },

      # SQS
      {
        Effect = "Allow"
        Action = [
          "sqs:CreateQueue",
          "sqs:GetQueueAttributes",
          "sqs:ListQueueTags"
        ]
        Resource = "arn:aws:sqs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_actions_deploy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_deploy_policy.arn
}

#
# GCP
#
resource "google_service_account" "github_sa" {
  account_id   = "${var.project}-github-sa${local.suffix}"
  display_name = "GitHub Actions Service Account ${var.env}"
}

resource "google_project_iam_member" "github_sa_role" {
  for_each = toset([
    "roles/resourcemanager.projectIamAdmin",
    "roles/serviceusage.serviceUsageAdmin",
    "roles/iam.serviceAccountAdmin",
    "roles/iam.workloadIdentityPoolAdmin",
    "roles/recaptchaenterprise.admin"
  ])

  project = var.gcp_project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.github_sa.email}"
}

resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "${var.project}-github-pool${local.suffix}"
  display_name              = "GitHub Actions ${var.env}"
}

resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "${var.project}-github-provider${local.suffix}"

  display_name = "GitHub Actions Provider ${var.env}"
  description  = "GitHub Actions ${var.env}"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }

  attribute_condition = "attribute.repository == \"${var.github_repository}\""
}

resource "google_service_account_iam_member" "github_federation" {
  service_account_id = google_service_account.github_sa.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repository}"
}