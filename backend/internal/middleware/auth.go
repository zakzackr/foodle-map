package middleware

import (
	"context"
	"log/slog"
	"net/http"
	"strings"

	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors"
	// "github.com/golang-jwt/jwt/v5"
	// "github.com/lestrrat-go/jwx/v2/jwk"
)

// JWT認証用ミドルウェア
type AuthMiddleware struct {
	logger *slog.Logger
}

// ContextのKeyとなる非公開Key型
type ctxKey string
const userIdKey ctxKey = "userId"


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
				"UNAUTHORIZED",
				"認証が必要です",
				http.StatusUnauthorized,
				nil,
			)
		}

		accessToken := strings.TrimPrefix(authHeader, "Bearer")

		// JWT検証
		userId, err := verifyJWT(accessToken)
		if err != nil {
			return apperrors. NewAppError(
				"INVALID_ACCESS_TOKEN",
				"無効なトークンです",
				http.StatusUnauthorized,
				nil,
			)
		}

		// ContextにuserIDをセット
		// リクエストスコープ内でuserIDを共有
		ctx := context.WithValue(r.Context(), userIdKey, userId)
		r = r.WithContext(ctx)

		return next(w, r)
	}
}

// JWT検証
func verifyJWT(accessToken string) (string, error) {
	// TODO: Supabaseの公開鍵を使用してJWT検証

	// JWKSをSupabaseから取得する
	// jwks := getJWKS()


	return "", nil
}

// func getJWKS(jwk.Set, error) {

// }
