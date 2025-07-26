package middleware

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jwt"
	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors"
)

// JWT認証用ミドルウェア
type AuthMiddleware struct {
	logger *slog.Logger
}

// ContextのKeyとなる非公開Key型
type ctxKey string
const userIdKey ctxKey = "userId"

// JWKSのキャッシュ機構
var (
	jwksCache *jwk.Cache  // 公開鍵情報jwks.Setをcacheするcontainer
	once sync.Once  // 関数が一回のみ実行されることを担保する機能を提供
)

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
	jwks, err := getJWKS()
	if err != nil {
		return "", fmt.Errorf("JWKSの取得に失敗しました: %w", err)
	}

	// // 期待値の設定
	supabaseURL := os.Getenv("SUPABASE_URL")
	if supabaseURL == "" {
		return "", fmt.Errorf("SUPABASE_URLが存在しません: %w", err)
	}

	expectedIssuer := supabaseURL + "/auth/v1"
	expectedAudience := "authenticated"

	// lestrrat-go/jwxによるJWT検証
	// 引数にParseOption, ValidationOptionを持つ
	token, err := jwt.Parse(
		[]byte(accessToken),
		// 公開鍵を渡す
		jwt.WithKeySet(jwks),
		// 発行者の検証
		jwt.WithIssuer(expectedIssuer),
		// 利用者の検証
		jwt.WithAudience(expectedAudience),
		// payloadのparseに成功した時のみJWTの検証を行うdate(true)の指定で、
		// defaultでenabled
		jwt.WithValidate(true),  
		// Clock skew許容範囲（1分までサーバー間の時間のズレを許容）
		jwt.WithAcceptableSkew(time.Minute),
		// 必須クレームの存在チェック
		jwt.WithRequiredClaim(jwt.SubjectKey),
		jwt.WithRequiredClaim(jwt.IssuedAtKey),
		jwt.WithRequiredClaim(jwt.ExpirationKey),
	)

	if err != nil {
		return "", fmt.Errorf("トークンの検証に失敗しました: %w", err)
	}

	// userIDを取得
	sub := token.Subject()
	if sub == "" {
		return "", fmt.Errorf("トークン内のSubjectクレームが空です")
	}

	return sub, nil
}

// SupabaseからJWKSを取得
func getJWKS()(jwk.Set, error) {
	supabaseURL:= os.Getenv("SUPABASE_URL")

	if supabaseURL == "" {
		return nil, fmt.Errorf("SUPABASE_URLが存在しません")
	}

	jwksURL := supabaseURL + "/.well-known/jwks.json"

	// 一度だけcacheを初期化
	// Doは引数のfuncを一回だけ実行
	once.Do(func() {
		// jwk.Cacheオブジェクトを生成
		jwksCache = jwk.NewCache(context.Background())  

		// JwksをFetchする前にURLをセットする必要あり
		// jwk.WithMinRefreshInterval()は、ResponseヘッダのCache-Control, max-ageと
		// 比較して長い方をキャッシュ期間として採用。Fallback用

		// WithRefreshInterval()を指定すると、この値が最優先
		jwksCache.Register(jwksURL, jwk.WithMinRefreshInterval(1*time.Hour))  
	})

	// キャッシュからJwksを取得
	return jwksCache.Get(context.Background(), jwksURL)
}
