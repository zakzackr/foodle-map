// Package app はラーメンブログのメインアプリケーション構造体とHTTPサーバーを提供する。
package app

import (
	"database/sql"
	"log/slog"
	"net/http"
	"os"

	_ "github.com/lib/pq"

	"github.com/zakzackr/ramen-blog/backend/internal/handler"
	"github.com/zakzackr/ramen-blog/backend/internal/middleware"
	"github.com/zakzackr/ramen-blog/backend/internal/repository"
	"github.com/zakzackr/ramen-blog/backend/internal/service"
)

// App はメインアプリケーション構造体。
// ルーター、設定、ログ、データベースを含む。
type App struct {
	router *http.ServeMux
	config *Config
	logger *slog.Logger
	db     *sql.DB
}

// Config はポート番号とベースURL、データベースURLを含むアプリケーション設定を保持する。
type Config struct {
	port        string
	baseURL     string
	databaseURL string
}

// New は新しいAppインスタンスを作成・初期化する。
// ログ、HTTPルーティング、DB接続を設定し、使用可能なAppを返す。
func New() *App {
	// デフォルト設定
	config := &Config{
		port:        getEnv("SERVER_PORT", "8080"),
		baseURL:     getEnv("API_BASE_URL", "http://localhost:8080/api/v1"),
		databaseURL: getEnv("DATABASE_URL", "postgres://user:password@db:5432/ramen_blog?sslmode=disable"),
	}

	// 構造化ログの設定
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	// ルーター作成
	// ServeHttp()が、登録されたハンドラーを呼び出す
	router := http.NewServeMux()

	// DB接続
	db, err := sql.Open("postgres", config.databaseURL)
	// TODO: DB接続失敗時のリトライ処理
	if err != nil {
		logger.Error("Failed to connect to database:", "error", err)
		os.Exit(1) // 異常終了でプロセス終了
	}

	// DB接続の成功を確認
	if err := db.Ping(); err != nil {
		logger.Error("Failed to ping database:", "error", err)
		os.Exit(1) // 異常終了でプロセス終了
	}

	app := &App{
		router: router,
		config: config,
		logger: logger,
		db:     db,
	}

	// ルートを設定
	app.setupRoutes()

	return app
}

// Loggerのみ取得可能にする
func (a *App) Logger() *slog.Logger {
	return a.logger
}

// TODO: middlewareに移行

// ServeHTTP はhttp.Handlerインターフェースを実装し、AppがHTTPリクエストを処理できるようにする。
// 受信リクエストをログに記録し、内部ルーターに委譲する。
func (a *App) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// リクエストログ
	a.logger.Info("Request", "method", r.Method, "path", r.URL.Path)

	// CORS設定
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000, http://localhost:8081")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// preflightリクエストの処理
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// ルーターに委譲
	a.router.ServeHTTP(w, r)
}

// setupRoutes はラーメンブログAPIエンドポイントのすべてのHTTPルートを設定する。
func (a *App) setupRoutes() {
	// DI
	articleRepository := repository.NewArticleRepository(a.db, a.logger)
	articleService := service.NewArticleService(articleRepository, a.logger)
	articleHandler := handler.NewArticleHandler(articleService, a.logger)

	// 基本的なルート設定
	// Handle関数で、ハンドラーを登録する
	// a.router.HandleFunc("GET /api/v1/articles", articleHandler.GetArticles)
	// errorを返すため、Handle関数を使用
	a.router.Handle("GET /api/v1/articles", middleware.AppHandler(articleHandler.GetArticles))
	a.router.Handle("POST /api/v1/articles", middleware.AppHandler(articleHandler.CreateArticle))
	a.router.Handle("GET /api/v1/articles/{id}", middleware.AppHandler(articleHandler.GetArticle))
	// a.router.HandleFunc("PUT /api/v1/articles/{id}", a.updateArticle)
	// a.router.HandleFunc("DELETE /api/v1/articles/{id}", a.deleteArticle)

	// a.router.HandleFunc("/api/v1/auth/login", a.handleLogin)
	// a.router.HandleFunc("/api/v1/auth/register", a.handleRegister)
}

// getEnv は環境変数の値を取得するか、設定されていない場合はデフォルト値を返す。
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
