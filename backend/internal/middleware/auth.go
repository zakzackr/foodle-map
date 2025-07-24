package middleware

import (
	"log/slog"
	"net/http"
	"strings"

	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors"
)

// JWT認証用ミドルウェア



type AuthMiddleware struct {
	logger *slog.Logger
}

func NewAuthMiddleware(logger *slog.Logger) *AuthMiddleware {
	return  &AuthMiddleware{logger: logger}
}

// JWT検証ミドルウェア
func RequireAuth(next AppHandler) AppHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		// Authorizationヘッダからトークン取得
		authHeader := r.Header.Get("Authorization")

		// Authorizationヘッダのvalidation
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer") {
			return apperrors. NewAppError(
				"UNAUTHORIED",
				"認証が必要です",
				http.StatusUnauthorized,
				nil,
			)
		}

		accessToken := strings.TrimPrefix(authHeader, "Bearer: ")

		// JWT検証
		verifyJWT(accessToken)


		return next(w, r)
	}
}

// JWT検証
func verifyJWT(accessToken string) {
	// TODO: Supabaseの公開鍵を使用してJWT検証
}
