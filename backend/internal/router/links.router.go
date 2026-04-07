package router

import (
	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/di"
	"github.com/virgilIw/koda-b6-final-fase/internal/middleware"
)

func RouterLinks(r *gin.RouterGroup, c *di.Container) {
	links := r.Group("/links")
	links.Use(middleware.AuthMiddleware())

	controller := c.LinksController()

	links.POST("", controller.CreateShortLink)
	links.GET("", controller.GetAllShortLinks)
}
