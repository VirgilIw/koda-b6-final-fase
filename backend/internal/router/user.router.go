package router

import (
	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/di"
)

func RouterUser(app *gin.RouterGroup, c *di.Container) {
	controller := c.UserController()

	app.GET("/email/:email", controller.GetByEmail)
}
