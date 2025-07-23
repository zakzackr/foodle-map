# グルメ SNS

## 概要

グルメ SNS です。

## 機能

作成中...

## ディレクトリ構成

```
.
├── backend/             # バックエンド（Goアプリケーション）
│   ├── cmd/             # アプリケーションエントリーポイント
│   ├── internal         # アプリケーション実装
│   ├── go.mod           # Go モジュール定義
│   ├── .air.toml        # ホットリロード設定
│   └── Dockerfile.dev   # 開発用Dockerfile
├── frontend/            # フロントエンド（Next.jsアプリケーション）
│   ├── src/             # ソースコード
│   ├── package.json     # フロントエンド依存管理ファイル
│   └── Dockerfile.dev   # 開発用Dockerfile
├── db/                  # データベース関連
│   └── migrations/      # マイグレーションファイル
├── docs/                # ドキュメント保管用のディレクトリ
│   ├── openapi.yml      # API仕様書（OpenAPI形式）
│   ├── requirements.md  # 設計ドキュメント
│   └── その他の設計資料
├── .env.example         # 環境変数サンプルファイル
├── docker-compose.yml   # docker composeファイル
├── CLAUDE.md            # Claude Code設定ファイル
├── GEMINI.md            # Gemini CLI設定ファイル
├── README.md            # README

```

## 技術スタック

| カテゴリ       | 技術                                                      |
| -------------- | --------------------------------------------------------- |
| フロントエンド | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| バックエンド   | Go                                                        |
| モバイル       | 検討中...                                                 |
| データベース   | PostgreSQL                                                |
| 認証・認可     | Supabase                                                  |
| インフラ       | Docker                                                    |
| ツール         | Git, Claude Code, Gemini CLI etc...                       |

## 開発環境構築手順

作成中...

## 要件定義書・設計ドキュメント

./docs/requirements.md を参照
