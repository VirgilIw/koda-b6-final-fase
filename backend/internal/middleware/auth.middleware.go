package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/lib"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		// header harus diawali dengan text bearer
		if !strings.HasPrefix(authHeader, "Bearer ") {
			ctx.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "unauthorized"})
			ctx.Abort()
			return
		}
		// kembalikan token tanpa text bearer
		token := strings.TrimPrefix(authHeader, "Bearer ")
		claims, valid := lib.VerifyToken(token)
		if !valid {
			ctx.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "unauthorized"})
			ctx.Abort()
			return
		}

		ctx.Set("user_id", claims.Id)
		ctx.Next()
	}
}
