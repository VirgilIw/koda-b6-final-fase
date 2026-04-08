package router

import (
	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/di"
	"github.com/virgilIw/koda-b6-final-fase/internal/middleware"
)

func RouterUser(app *gin.RouterGroup, c *di.Container) {
	users := app.Group("/users")
	users.Use(middleware.AuthMiddleware())
	controller := c.UserController()

	users.GET("/email/:email", controller.GetByEmail)
	users.GET("/me", controller.GetUserByID)
}
