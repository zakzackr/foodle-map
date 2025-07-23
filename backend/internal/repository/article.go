package repository

import (
	"database/sql"
	"log/slog"
	"net/http"

	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors"
	"github.com/zakzackr/ramen-blog/backend/internal/model"
)

type ArticleRepository struct {
	db     *sql.DB
	logger *slog.Logger
}

func NewArticleRepository(db *sql.DB, logger *slog.Logger) *ArticleRepository {
	return &ArticleRepository{
		db:     db,
		logger: logger,
	}
}

// 記事一覧の取得
func (r *ArticleRepository) GetArticles() ([]*model.ArticleListItem, *apperrors.AppError) {
	r.logger.Info("記事一覧取得リポジトリ開始")

	//ゼロ値で初期化
	var articles []*model.ArticleListItem

	// queryを作成
	query := `
		SELECT id, author_id, title, like_count, stock_count, created_at, updated_at
		From articles
	`
	rows, err := r.db.Query(query)
	if err != nil {
		r.logger.Error("クエリ実行エラー", "error", err, "query", query)
		return nil, apperrors.NewAppError(
			"DATABASE_ERROR",
			"データベースエラーが発生しました",
			http.StatusInternalServerError,
			err,
		)
	}

	// 重要：リソースリーク防止
	// rows.Next()終了時に正常終了時に自動でCloseされるが、エラー終了時用に明示的にCloseを行う
	defer rows.Close()

	// 各レコードをループして取得
	for rows.Next() {
		article := &model.ArticleListItem{}

		// (*Rows) Scanは現在のレコードの値をターゲットにコピーする
		err := rows.Scan(
			&article.ID,
			&article.UserId,
			&article.Title,
			&article.LikeCount,
			&article.StockCount,
			// &article.ImageUrls,
			&article.CreatedAt,
			&article.UpdatedAt,
		)

		// Scan中のエラーを確認する
		if err != nil {
			r.logger.Error("行処理エラー", "error", err)
			return nil, apperrors.NewAppError(
				"SCAN_ERROR",
				"データの読み取りに失敗しました",
				http.StatusInternalServerError,
				err,
			)
		}

		articles = append(articles, article)
	}

	// ループ終了後：falseの原因を確認
	// 正常：次に読む行が存在しない
	// エラー：ループ中にエラーが発生
	// エラーの場合はエラーハンドリングを行う
	if err := rows.Err(); err != nil {
		return nil, apperrors.NewAppError(
			"ROWS_ERROR",
			"行の処理中にエラーが発生しました",
			http.StatusInternalServerError,
			err,
		)
	}

	// 正常終了
	r.logger.Info("記事一覧取得リポジトリ完了", "count", len(articles))
	return articles, nil
}

// 記事詳細の取得
func (r *ArticleRepository) GetArticleById(id int64) (*model.Article, *apperrors.AppError) {
	r.logger.Info("記事詳細取得リポジトリ開始", "authorId", id)

	//ゼロ値で初期化
	article := &model.Article{}

	// queryを作成
	query := `
		SELECT id, author_id, title, body, like_count, stock_count, created_at, updated_at
		FROM articles
		WHERE id = $1
	`

	row := r.db.QueryRow(query, id)
	err := row.Scan(
		&article.ID,
		&article.UserId,
		&article.Title,
		&article.Body,
		&article.LikeCount,
		&article.StockCount,
		// &article.ImageUrls,
		&article.CreatedAt,
		&article.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			r.logger.Error("sql.ErrNoRowsが発生", "error", err)
			return nil, apperrors.NewAppError(
				"ARTICLE_NOT_FOUND",
				"記事が見つかりませんでした。",
				http.StatusNotFound,
				err,
			)
		}
		return nil, apperrors.NewAppError(
			"DATABASE_ERROR",
			"データベースエラーが発生しました",
			http.StatusInternalServerError,
			err,
		)
	}

	r.logger.Info("記事詳細取得リポジトリ完了", "authorId", article.ID)
	return article, nil
}

// 記事の作成
func (r *ArticleRepository) CreateArticle(req *model.CreateArticleRequest, authorId int64) (*model.Article, *apperrors.AppError) {
	r.logger.Info("記事作成リポジトリ開始", "title", req.Title, "authorId", authorId)

	//ゼロ値で初期化
	article := &model.Article{}

	// queryの作成
	query := `
		INSERT INTO articles(author_id, title, body)
		VALUES ($1, $2, $3)
		RETURNING id, author_id, title, body, like_count, stock_count, created_at, updated_at
	`

	row := r.db.QueryRow(query, authorId, req.Title, req.Body)
	err := row.Scan(
		&article.ID,
		&article.UserId,
		&article.Title,
		&article.Body,
		&article.LikeCount,
		&article.StockCount,
		// &article.ImageUrls,
		&article.CreatedAt,
		&article.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			r.logger.Error("記事作成エラー", "error", err)
			return nil, apperrors.NewAppError(
				"CREATE_ARTICLE_ERROR",
				"記事の作成に失敗しました",
				http.StatusInternalServerError,
				err,
			)
		}
	}

	r.logger.Info("記事作成リポジトリ完了", "articleId", article.ID)
	return article, nil
}
