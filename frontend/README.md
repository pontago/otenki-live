# Frontend

Next.js 15を使用して構築された、天気情報とライブストリームを組み合わせたWebアプリケーションです。

### 主な機能

- **地域別天気予報**: 全国10地域の天気予報を地図とリストで表示
- **ライブストリーム連携**: YouTubeライブストリームからの物体検出データ（傘、服装など）
- **詳細天気情報**: 現在の天気、時間別予報、日別予報
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **ダークモード対応**: ライト・ダークテーマ切り替え
- **お問い合わせフォーム**: reCAPTCHA対応のコンタクトフォーム

## 🛠 技術スタック

### フレームワーク・ライブラリ
- **Next.js 15.3.3** - React フレームワーク
- **React 19.1.0** - UI ライブラリ
- **TypeScript 5.8.3** - 型安全性
- **Tailwind CSS 4.1.10** - スタイリング
- **shadcn/ui** - UI コンポーネントライブラリ

### 状態管理・フォーム
- **React Hook Form 7.60.0** - フォーム管理
- **Zod 3.25.67** - スキーマバリデーション
- **next-themes 0.4.6** - テーマ管理

### 開発・テストツール
- **Vitest 3.2.4** - ユニットテスト
- **Playwright 1.54.1** - E2Eテスト
- **Storybook 9.0.12** - コンポーネント開発
- **MSW 2.10.2** - API モック
- **ESLint** - コード品質
- **Prettier** - コードフォーマット

### その他
- **Luxon 3.6.1** - 日時処理
- **Lucide React** - アイコン
- **Google Analytics** - アクセス解析
- **reCAPTCHA** - スパム対策

## 📁 プロジェクト構造

```
frontend/
├── app/                          # Next.js App Router
│   ├── [region]/                 # 動的ルート（地域別ページ）
│   │   ├── [pref]/              # 動的ルート（都道府県別ページ）
│   │   └── page.tsx
│   ├── about/                   # アプリについて
│   ├── contact/                 # お問い合わせ
│   ├── credits/                 # クレジット
│   ├── og/                      # OG画像生成
│   ├── layout.tsx               # ルートレイアウト
│   ├── page.tsx                 # ホームページ
│   ├── error.tsx                # エラーページ
│   ├── not-found.tsx            # 404ページ
│   ├── robots.ts                # robots.txt
│   └── sitemap.ts               # サイトマップ
├── components/                   # 共通コンポーネント
│   ├── ui/                      # shadcn/ui コンポーネント
│   ├── header.tsx               # ヘッダー
│   ├── footer.tsx               # フッター
│   ├── theme-provider.tsx       # テーマプロバイダー
│   └── theme-switch.tsx         # テーマ切り替え
├── features/                     # 機能別モジュール
│   ├── weather/                 # 天気関連機能
│   │   ├── api/                 # API呼び出し
│   │   ├── components/          # 天気コンポーネント
│   │   ├── lib/                 # 天気関連ユーティリティ
│   │   └── types/               # 型定義
│   └── contact/                 # お問い合わせ機能
│       ├── api/                 # API呼び出し
│       ├── components/          # フォームコンポーネント
│       ├── schemas/             # バリデーションスキーマ
│       └── types/               # 型定義
├── lib/                         # ユーティリティ・設定
│   ├── constants.ts             # 定数定義
│   ├── env.ts                   # 環境変数設定
│   └── utils.ts                 # 共通ユーティリティ
├── mocks/                       # MSW モックデータ
├── public/                      # 静的ファイル
├── styles/                      # グローバルスタイル
├── tests/                       # E2Eテスト
└── types/                       # グローバル型定義
```

## 🚀 セットアップ

### 前提条件
- Node.js 22.18.x
- pnpm 10.14.x

### インストール

```bash
# 依存関係のインストール
pnpm install

pnpm run dev
```

### 環境変数

```env
NEXT_PUBLIC_BASE_URL=サイトURL
NEXT_PUBLIC_API_BASE_URL=API URL
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=reCAPTCHAサイトキー
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=Google AnalyticsのトラッキングID
USE_MSW=モックの有効化
SECRET_KEY=OGP生成シークレットキー
```

## 🧪 テスト

```bash
pnpm run test
pnpm run test:e2e
```

## 🎨 UI/UX

### デザインシステム
- **shadcn/ui** をベースとしたコンポーネントライブラリ
- **Tailwind CSS** によるユーティリティファーストのスタイリング
- **Lucide React** による統一されたアイコンセット

## 🧪 テスト戦略

### ユニットテスト (Vitest)
- コンポーネントの単体テスト
- Storybookとの統合テスト
- ブラウザ環境でのテスト実行

### E2Eテスト (Playwright)
- ユーザーフローの自動テスト
- クロスブラウザ対応
- モバイル・デスクトップ両対応

### モック (MSW)
- API レスポンスのモック
- 開発・テスト環境での使用
- Storybookとの統合

## 🔧 開発ワークフロー

### コード品質
- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット
- **TypeScript**: 型安全性

### コンポーネント開発
- **Storybook**: コンポーネントの独立開発
- **Vitest**: コンポーネントテスト
- **MSW**: API モック

### デプロイ
- **Next.js Standalone**: 最適化されたビルド
- **Docker**: コンテナ化対応
- **CI/CD**: GitHub Actions