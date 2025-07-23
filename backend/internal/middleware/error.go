package middleware

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"runtime/debug"

	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors"
)

// AppHandler はエラーを返すことができるカスタムハンドラー型
type AppHandler func(w http.ResponseWriter, r *http.Request) error

// AppHandlerはhttp.Handlerインターフェースを実装し、エラーハンドリングを提供
// GoのRouterは、http.Handlerインターフェースを実装した型を呼び出す
// Handler.ServeHTTPは、レスポンスにヘッダとデータを書き込む。その後リクエストが終了したシグナルを出す。
func (ah AppHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// panicから回復
	defer func() {
		if rec := recover(); rec != nil {
			slog.Error("Panic recovered",
				"error", rec,
				"stack", string(debug.Stack()),
				"method", r.Method,
				"path", r.URL.Path,
			)

			internalErr := apperrors.NewAppError(
				"INTERNAL_SERVER_ERROR",
				"予期しないエラーが発生しました",
				http.StatusInternalServerError,
				nil,
			)
			writeErrorResponse(w, internalErr)
		}
	}()

	// ハンドラーを実行してエラーをキャッチ
	if err := ah(w, r); err != nil {
		handleError(w, r, err)
	}
}

// handleError はエラーを適切なHTTPレスポンスに変換
func handleError(w http.ResponseWriter, r *http.Request, err error) {
	var appErr *apperrors.AppError

	// AppErrorかどうかチェック
	if errors.As(err, &appErr) {
		writeErrorResponse(w, appErr)
	} else {
		// 予期しないエラーの場合
		slog.Error("Unexpected error",
			"error", err,
			"method", r.Method,
			"path", r.URL.Path,
		)

		// 予期しないエラーは全てInternal Server Errorで返す
		internalErr := apperrors.NewAppError(
			"INTERNAL_SERVER_ERROR",
			"予期しないエラーが発生しました",
			http.StatusInternalServerError,
			err,
		)
		writeErrorResponse(w, internalErr)
	}
}

// AppErrorを元にカスタムエラー（JSON）を生成して、Responseに書き込む
func writeErrorResponse(w http.ResponseWriter, appErr *apperrors.AppError) {
	// ログ出力
	slog.Error("Application error",
		"code", appErr.Code,
		"message", appErr.Message,
		"status", appErr.Status,
	)

	// HTTPヘッダー設定
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(appErr.Status)

	// カスタムエラーをレスポンスボディにセット
	if err := json.NewEncoder(w).Encode(appErr); err != nil {
		slog.Error("Failed to encode error response", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
