package service

import (
	"log/slog"
	"net/http"

	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors"
	"github.com/zakzackr/ramen-blog/backend/internal/model"
	"github.com/zakzackr/ramen-blog/backend/internal/repository"
)

type ArticleService struct {
	// DI
	articleRepo *repository.ArticleRepository
	logger      *slog.Logger
}

// コンストラクタ
func NewArticleService(articleRepo *repository.ArticleRepository, logger *slog.Logger) *ArticleService {
	return &ArticleService{
		articleRepo: articleRepo,
		logger:      logger,
	}
}

// 記事一覧の取得
func (s *ArticleService) GetArticles() ([]*model.ArticleListItem, *apperrors.AppError) {
	s.logger.Info("記事一覧取得サービス開始")
	articles, err := s.articleRepo.GetArticles()
	if err != nil {
		return nil, err
	}

	s.logger.Info("記事一覧取得サービス完了", "count", len(articles))
	return articles, nil
}

// 記事詳細の取得
func (s *ArticleService) GetArticleById(id int64) (*model.Article, *apperrors.AppError) {
	s.logger.Info("記事詳細取得サービス開始")

	// idのvalidation
	if id <= 0 {
		return nil, apperrors.NewAppError(
			"INVALID_ARTICLE_ID",
			"記事IDが適切ではありません。",
			http.StatusBadRequest,
			nil,
		)
	}

	article, err := s.articleRepo.GetArticleById(id)
	if err != nil {
		return nil, err
	}

	s.logger.Info("記事詳細取得サービス完了", "articleID", article.ID)
	return article, nil
}

// 記事の作成
func (s *ArticleService) CreateArticle(req *model.CreateArticleRequest, authorId int64) (*model.Article, *apperrors.AppError) {
	s.logger.Info("記事作成取得サービス開始")

	article, err := s.articleRepo.CreateArticle(req, authorId)

	if err != nil {
		return nil, err
	}

	s.logger.Info("記事作成取得サービス終了", "articleID", article.ID)
	return article, nil
}
