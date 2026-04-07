package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/virgilIw/koda-b6-final-fase/docs"
	"github.com/virgilIw/koda-b6-final-fase/internal/config"
	"github.com/virgilIw/koda-b6-final-fase/internal/di"
	"github.com/virgilIw/koda-b6-final-fase/internal/router"
)

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Masukkan token dengan format: Bearer <token>
func main() {
	docs.SwaggerInfo.Title = "Final Fase shortlink"
	docs.SwaggerInfo.Description = "Koda-B6-Final"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = os.Getenv("APP_URL")
	docs.SwaggerInfo.BasePath = "/"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	_ = godotenv.Load()

	app := gin.Default()

	db, err := config.InitDB()

	if err != nil {
		log.Fatalf("failed connect database: %v", err)
	}

	container := di.NewContainer(db)
	router.RouterMain(app, container)

	port := os.Getenv("PORT")
	app.Run(fmt.Sprintf("localhost:%s", port))
}
