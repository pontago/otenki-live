# Backend

このバックエンドAPIは、天気予報データの取得・管理、ライブチャンネルの監視、物体検出による服装推奨機能を提供します。

## 🏗️ アーキテクチャ

このプロジェクトは**クリーンアーキテクチャ**の原則に基づいて設計されており、以下の層で構成されています：

```
app/
├── adapter/          # 外部インターフェース層
│   ├── api/         # REST API エンドポイント
│   └── handler/     # AWS Lambda ハンドラー
├── core/            # アプリケーションコア層
│   ├── di/          # 依存性注入コンテナ
│   ├── settings.py  # 設定管理
│   └── utils.py     # ユーティリティ
├── domain/          # ドメイン層
│   ├── entities/    # エンティティ
│   ├── repositories/ # リポジトリインターフェース
│   └── services/    # ドメインサービス
├── infrastructure/  # インフラストラクチャ層
│   ├── dto/         # データ転送オブジェクト
│   ├── mappers/     # データマッパー
│   └── repositories/ # リポジトリ実装
└── usecases/        # ユースケース層
    ├── area/        # 地域関連
    ├── contact/     # お問い合わせ
    ├── live_channel/ # ライブチャンネル
    └── weather_forecast/ # 天気予報
```

## 🚀 主要機能

### 1. 天気予報API
- **地域別天気予報**: 全国10地域の天気予報を取得
- **都道府県別天気予報**: 指定地域内の都道府県別詳細予報
- **詳細天気予報**: 特定エリアの詳細な天気情報（降水確率、気温等）

### 2. ライブチャンネル管理
- **アクティブチャンネル一覧**: 現在配信中のライブチャンネルを取得
- **物体検出**: ライブストリームから服装を検出
- **自動監視**: YouTubeライブストリームの自動検出・処理

### 3. お問い合わせ機能
- **reCAPTCHA検証**: Google reCAPTCHA v3によるスパム対策
- **メール送信**: AWS SESを使用した確認メール・管理者通知

### 4. 地域管理
- **地域一覧**: 天気予報対象地域の一覧取得

## 📡 API エンドポイント

### 天気予報
```
GET /api/v1/forecast                    # 地域別天気予報一覧
GET /api/v1/forecast/{region_code}      # 都道府県別天気予報
GET /api/v1/forecast/{region_code}/{area_code}  # 詳細天気予報
```

### ライブチャンネル
```
GET /api/v1/live-channel                # アクティブライブチャンネル一覧
```

### お問い合わせ
```
POST /api/v1/contact                    # お問い合わせ送信
```

### 地域
```
GET /api/v1/area                        # 地域一覧
```

## 🛠️ 技術スタック

### フレームワーク・ライブラリ
- **FastAPI**: 高性能なWeb APIフレームワーク
- **Pydantic**: データバリデーション・シリアライゼーション
- **Dependency Injector**: 依存性注入
- **Loguru**: ログ管理

### AWS サービス
- **DynamoDB**: データベース（天気予報データ、ライブチャンネル情報）
- **S3**: ファイルストレージ（機械学習モデル、一時ファイル）
- **SES**: メール送信サービス
- **SQS**: メッセージキュー（ライブストリーム処理）
- **Lambda**: サーバーレス実行環境

### 機械学習
- **PyTorch**: 深層学習フレームワーク
- **TorchVision**: 画像処理・物体検出
- **SAHI**: 物体検出ライブラリ
- **YOLO**: 物体検出モデル
- **EfficientNetV2**: 物体分類モデル

### 外部API
- **気象庁API**: 天気予報データ取得
- **YouTube**: ライブストリーム情報取得
- **Google reCAPTCHA**: スパム対策

## 🔧 セットアップ

### 前提条件
- Python 3.13+
- AWS（LocalStack）
- Docker（開発環境）

### インストール
```bash
# 依存関係のインストール
uv sync
```

### 環境変数設定
```env
ENV=dev
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="dummy"
AWS_SECRET_ACCESS_KEY="dummy"
ENDPOINT_URL="http://localhost:4566"
DYNAMODB_BILLING_MODE="PAY_PER_REQUEST"
STORAGE_DIR="/tmp"
CLOTHING_MODEL_WEIGHTS_PATH=
DETECTION_MODEL_WEIGHTS_PATH=
YOUTUBE_COOKIES_PATH=
RECAPTCHA_SITE_KEY=
LOGURU_LEVEL=DEBUG
CORS="http://localhost:3000"
GCP_PROJECT_ID=
```

### 開発サーバー起動
```bash
# 事前にLocalStackを起動
docker compose -f /infrastructure/docker/docker-compose.yml up

# 気象庁から天気情報を取得・更新
uv run app/adapter/handler/weather_forecast.py 

# FastAPI開発サーバー
uv run fastapi dev app/adapter/api/main.py
```

## 🧪 テスト

```bash
# 全テスト実行
uv run pytest tests
```

## 🔄 処理フロー

### 天気予報更新フロー
1. 気象庁APIから天気予報データを取得
2. DynamoDBに保存（TTL設定）
3. フロントエンドからAPI経由で取得

### ライブストリーム処理フロー
1. ライブストリーム情報を取得
2. YouTubeから動画をダウンロード
3. 物体検出モデルで服装を検出
4. 結果をDynamoDBに保存

### お問い合わせ処理フロー
1. reCAPTCHA検証
2. 確認メール送信（ユーザー宛）
3. 通知メール送信（管理者宛）