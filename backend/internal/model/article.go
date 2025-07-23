package model

import "time"

// 記事詳細用のArticleデータ
type Article struct {
	ID         int64  `json:"id"`
	UserId     int64  `json:"authorId"`
	Title      string `json:"title"`
	Body       string `json:"body"`
	LikeCount  int    `json:"likeCount"`
	StockCount int    `json:"stockCount"`
	// ImageUrls  []string  `json:"imageUrls,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// 記事一覧用のArticleデータ
type ArticleListItem struct {
	ID         int64  `json:"id"`
	UserId     int64  `json:"authorId"`
	Title      string `json:"title"`
	LikeCount  int    `json:"likeCount"`
	StockCount int    `json:"stockCount"`
	// ImageUrls  []string  `json:"imageUrls,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// 記事投稿用のArticleデータ
type CreateArticleRequest struct {
	Title string `json:"title"`
	Body  string `json:"body"`
	// ImageUrls  []string  `json:"imageUrls, omitempty""`
}
