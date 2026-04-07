package router

import (
	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/di"
)

func RouterAuth(app *gin.RouterGroup, c *di.Container) {
	controller := c.AuthController()

	app.POST("/login", controller.Login)
	app.POST("/register", controller.Register)
}
