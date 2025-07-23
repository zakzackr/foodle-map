# ラーメンブログアプリ
## 概要
ラーメンブログアプリです。

## 機能
- ユーザー新規登録機能
- ユーザーログイン機能
- 記事一覧表示機能
- 記事詳細表示機能
- 記事の投稿機能
- 記事の編集機能
- 記事の削除機能
- 記事の下書き保存機能
- いいね機能
- 記事の保存機能
- プロフィール表示機能
- プロフィール編集機能
- コメント機能
- ランキング機能（週間、月間、年間）

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
| カテゴリ    | 技術                                                     |
|---------|--------------------------------------------------------|
| フロントエンド | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| バックエンド  | Go |
| データベース  | PostgreSQL|
| 認証・認可   | Supabase|
| インフラ    | Docker |
| ツール   | Git, Claude Code, Gemini CLI etc... |

## 開発環境構築手順
作成中...

## 要件定義書・設計ドキュメント
./docs/requirements.mdを参照








