package handler

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors"
	"github.com/zakzackr/ramen-blog/backend/internal/model"
	"github.com/zakzackr/ramen-blog/backend/internal/service"
)

type ArticleHandler struct {
	// DI
	articleService *service.ArticleService
	logger         *slog.Logger
}

// ArticleHandlerを作成
func NewArticleHandler(articleService *service.ArticleService, logger *slog.Logger) *ArticleHandler {
	return &ArticleHandler{
		articleService: articleService,
		logger:         logger,
	}
}

// 記事一覧取得ハンドラー
func (h *ArticleHandler) GetArticles(w http.ResponseWriter, r *http.Request) error {
	h.logger.Info("記事一覧取得リクエスト")

	articles, err := h.articleService.GetArticles()
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	return json.NewEncoder(w).Encode(map[string][]*model.ArticleListItem{"articles": articles})
}

// 記事詳細取得ハンドラー
func (h *ArticleHandler) GetArticle(w http.ResponseWriter, r *http.Request) error {
	h.logger.Info("記事詳細取得リクエスト")

	// パス内のarticleIdを取得
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)

	if err != nil {
		return apperrors.NewAppError(
			"INVALID_ARTICLE_ID",
			"記事IDが無効です",
			http.StatusBadRequest,
			err,
		)
	}

	// 記事詳細取得サービス関数の呼び出し
	article, appErr := h.articleService.GetArticleById(id)
	if appErr != nil {
		fmt.Println("errorあり")
		return appErr
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	// json.Encode()時のエラーもグローバルハンドラーで処理
	return json.NewEncoder(w).Encode(article)
}

// 記事作成ハンドラー
func (h *ArticleHandler) CreateArticle(w http.ResponseWriter, r *http.Request) error {
	h.logger.Info("記事投稿リクエスト")

	authorId := int64(1)
	var req model.CreateArticleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return apperrors.NewAppError(
			"INVALID_JSON",
			"JSONが無効です",
			http.StatusBadRequest,
			err,
		)
	}

	article, err := h.articleService.CreateArticle(&req, authorId)
	if err != nil {
		return err
	}

	w.Header().Set("Content-type", "application/json")
	// Write()がWriteHeader(http.StatusOK)を自動で呼ぶから、その前に明示的に呼び出す。
	w.WriteHeader(http.StatusCreated)
	return json.NewEncoder(w).Encode(article)
}
