# システムの目的・背景

グルメ SNS。Map や投稿から好きなお店を発見して、最高の外食体験を。

## 技術スタック

-   **フロントエンド**: Next.js, TypeScript, Tailwind CSS, shadcn/ui, Tiptap
-   **バックエンド**: Go
-   **モバイル**: 検討中
-   **データベース**: MySQL
-   **インフラ**: 検討中（Vercel, AWS）, Docker
-   **その他**: Git, Swagger UI

## 全体構成図

-   システム全体像（アーキテクチャ概要図）

## 機能要件

1. **認証機能**
    - メールアドレス・パスワードでの新規登録、ログイン
    - ログアウト
2. **記事投稿機能**
    - 記事の作成（Notion ライクなテキスト入力。画像投稿も可能。）
    - 記事の投稿
    - 記事の編集
    - 記事の削除
    - 記事の下書き保存
3. **記事表示機能**
    - 記事一覧表示
    - 記事詳細表示
    - いいね機能
    - 記事の保存
4. **ユーザー機能**
    - いいね
    - プロフィール表示
    - プロフィール編集
    - コメント
    - ランキング表示（週間、月間、年間）

## 非機能要件

1. **セキュリティ**
    - ユーザー認証として、JWT 認証を採用する。
    - パスワードはハッシュ化して保存する。平文で保存しないこと。
    - Cookie の SameSite:None で運用する場合は、CSRF 対策を必ず行うこと。
    - database/sql を使用する場合は、SQL インジェクション対策で、ロー SQL を避け、プリペアドステートメントを使用すること。必要に応じで ORM を導入すること。
2. **ユーザビリティ**
    - レスポンシブデザイン対応
    - シンプルで使いやすいデザイン

## 画面構成

-   Feed 画面（フォローしている人の投稿、おすすめの投稿を表示）
-   Map 画面
-   飲食店詳細表示（評価・レビューなどを表示）
-   ログイン・新規登録画面
-   プロフィール画面

## データベース設計

作成中...

## API 設計

./openapi.yaml 参照

## 認証設計

### アーキテクチャ

-   **BFF（Backend for Frontend）** + **Supabase 認証**を採用
-   Next.js Route Handler（BFF 層）で Supabase 認証を処理
-   JWT 認証を HttpOnly Cookie で管理（Supabase SSR）

### 認証フロー

1. **クライアント**: フロントエンドから`/api/auth/*`（Route Handler）を呼び出し
2. **BFF 層**: Route Handler で Supabase 認証 API（`signInWithPassword`, `signUp`, `signOut`）を実行
3. **セッション管理**: Supabase が HttpOnly Cookie に JWT（access-token, refresh-token）を自動保存
4. **認証状態**: Client Components・Server Components 両方でセッション情報にアクセス可能

### JWT 管理

-   **保存場所**: HttpOnly Cookie（Supabase が自動管理）
-   **アクセス方法**:
    -   Client Components: ブラウザが自動で Cookie を送信（`credentials: 'include'`）
    -   Server Components: `createServerSideClient()`で Cookie から取得
-   **Go API 連携**: Server Component から JWT を取得し、`Authorization: Bearer <token>`ヘッダーで送信

#### Cookie の設定（Supabase が自動設定）

-   HttpOnly 属性: true
-   Secure 属性: false（開発時）、true（本番環境）
-   SameSite 属性: Supabase の設定に従う
-   有効期限: Supabase のトークン有効期限に従う

#### JWT の設定（Supabase が生成）

-   sub クレーム: ユーザー ID（Supabase UUID）
-   email クレーム: ユーザーメールアドレス
-   user_metadata クレーム: username, role 等のカスタム情報
-   role クレーム: authenticated/anon（Supabase の内部ロール）

### Go API 連携

-   **JWT 検証**: Supabase の JWT Secret を Go 側でも設定し、同じキーで検証
-   **認証方式**: `Authorization: Bearer <token>`ヘッダー
-   **ユーザー情報**: JWT のクレームからユーザー ID・メタデータを取得

## 認可設計

### ロール管理

ユーザーのロール情報は`user_metadata.role`に保存し、以下の権限体系を採用：

#### user（一般ユーザー）

-   Feed 表示（フォローしている人の投稿、おすすめの投稿を表示）
    -   いいね・保存機能
    -   コメント機能
-   Map 表示
    -   Map でお店の検索
    -   Map から飲食店の詳細表示（評価・レビューなどを表示）
-   投稿、投稿の編集・削除
-   プロフィール表示・編集
    -   フォロー機能
-   コメント投稿・編集・削除（自身のコメントのみ）

#### admin（管理者）

-   user 権限の全て
-   全ユーザーの記事・コメントの管理（編集・削除）
-   ユーザー管理
-   システム設定

### アクセス制御

#### フロントエンド（middleware.ts）

-   **保護されたページ**: `/dashboard`, `/profile`, `/articles/new`, `/articles/edit`
-   **認証ページ**: `/login`, `/signup`（認証済みユーザーは`/dashboard`にリダイレクト）
-   **未認証時**: 保護されたページへのアクセスは`/login`にリダイレクト

#### バックエンド（Go API）

-   JWT 検証ミドルウェアで全 API 保護
-   ロールベースの認可制御
-   リソース所有者チェック（記事・コメントの編集・削除）

### 実装状況

-   ✅ Route Handler（login, signup, logout）
-   ✅ username・role の user_metadata 保存
-   🚧 middleware.ts（認証チェック・リダイレクト）
-   ⏳ api.ts 修正（Route Handler 呼び出し）
-   ⏳ 認証状態管理（React Context）
