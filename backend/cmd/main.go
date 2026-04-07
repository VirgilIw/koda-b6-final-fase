package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/virgilIw/koda-b6-final-fase/docs"
	"github.com/virgilIw/koda-b6-final-fase/router"
)

// @host      localhost:8888
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	docs.SwaggerInfo.Title = "Final Fase shortlink"
	docs.SwaggerInfo.Description = "Koda-B6-Final"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "shortlink.swagger.io"
	docs.SwaggerInfo.BasePath = "/v2"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	app := gin.Default()
	router.RouterMain(app)

	_ = godotenv.Load()

	port := os.Getenv("PORT")
	app.Run(fmt.Sprintf("localhost:%s", port))
}
