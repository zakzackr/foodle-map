package errors

import (
	"fmt"
	"net/http"
)

// アプリケーション内部で使用されるカスタムエラー
type AppError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"-"`
	Err     error  `json:"-"`
}

// errorインターフェースを実装
func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

// コンストラクタ
func NewAppError(code, message string, status int, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Status:  status,
		Err:     err,
	}
}

// Unwrap はエラーチェーンをサポートします
// func (e *AppError) Unwrap() error {
//     return e.Err
// }

// func NewNotFoundError(message string) *AppError {
// 	return &AppError {
// 		Code:
// 	}
// }

// よく使用されるエラー
var (
	ErrArticleNotFound = &AppError{
		Code:    "ARTICLE_NOT_FOUND",
		Message: "記事が見つかりませんでした。",
		Status:  http.StatusNotFound,
	}
)
