package router

import (
	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/di"
)

func RouterUser(app *gin.Engine, c *di.Container) {
	auth := app.Group("/users")
	handler := c.UserController()

	auth.GET("/email/:email", handler.GetByEmail)
}
