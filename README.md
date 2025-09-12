# お天気ライブ

気象庁の天気予報データとライブストリーミング動画を組み合わせた天気予報サービスのテストです。物体検出による服装推論機能を提供します。

- FastAPI + Next.js + AWS Serverless
- EfficientNetV2 + YOLO + SAHI
- Terraform
- Clean Architecture

## Backend
[Backend - README](./backend/README.md)

- FastAPI
- uv + ruff + mypy
- pytest
- AWS Lambda + Mangum
- AWS DynamoDB + PynamoDB

## Frontend
[Frontend - README](./frontend/README.md)

- Next.js
- shadcn/ui + Tailwind
- Storybook + Vitest + Playwright E2E + MSW
- AWS Lambda Web Adapter

## Infrastructure

- AWS Lambda, DynamoDB, SQS, SES, EventBridge, ECR, CloudFront, S3
- GCP reCAPTCHA Enterprise
- CI/CD GitHub Actions + OIDC（AWS, GCP）
- Terraform

## Requirement

- Python >=3.13
- FastAPI >=0.115.12
- Node.js 22.18.x
- Next.js 15.3.x

## Environment Variables and Secrets

### Secrets for Actions

- AWS_ROLE=AWS Assume Role (OIDC)
- GCP_PROJECT_NUMBER=GCPプロジェクト番号
- GCP_SERVICE_ACCOUNT_EMAIL=GCPサービスアカウント
- GCP_POOL_ID=Workload Identity Pool ID
- GCP_PROVIDER_ID=Workload Identity Pool Provider ID
- PARAM_SECRET_KEY=OGP生成シークレットキー

### Environment

- ENV=dev, prod
- AWS_REGION=ap-northeast-1
- GCP_REGION=asia-northeast1
- GCP_PROJECT_ID=GCPプロジェクトID
- BASE_URL=サイトURL
- API_BASE_URL=API URL
- DOMAIN_NAME=ドメイン
- FQDN=サイトドメイン（サブドメイン）
- RECAPTCHA_SITE_KEY=reCAPTCHAサイトキー
- GOOGLE_ANALYTICS_ID=Google AnalyticsのトラッキングID
- CLOTHING_MODEL_WEIGHTS_PATH=服装分類モデルのパス
- DETECTION_MODEL_WEIGHTS_PATH=物体検出モデルのパス
- YOUTUBE_COOKIES_PATH=YouTubeクッキーパス