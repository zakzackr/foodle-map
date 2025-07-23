package main

import (
	"os"
	"net/http"

	"github.com/zakzackr/ramen-blog/backend/internal/app"
)


func main() {
	// app構造体の作成
	// ルーティング設定
	api := app.New()
	logger := api.Logger()  

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	// HTTPサーバーを起動
	logger.Info("Server starting", "port", port)
	if err := http.ListenAndServe(":"+port, api); err != nil {
		logger.Error("Server failed", "error", err)
		os.Exit(1)  
	}
}
