package router

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/virgilIw/koda-b6-final-fase/internal/di"
	"github.com/virgilIw/koda-b6-final-fase/internal/middleware"
)

func RouterMain(app *gin.Engine, c *di.Container) {
	app.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	app.Use(middleware.CorsMiddleware())

	RouterAuth(app, c)
}
