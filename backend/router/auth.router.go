package router

import (
	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/di"
)

func RouterAuth(app *gin.Engine, c *di.Container) {
	auth := app.Group("/auth")
	handler := c.AuthController()

	auth.POST("/register", handler.Register)
}
