package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/dto"
	"github.com/virgilIw/koda-b6-final-fase/internal/service"
)

type UserController struct {
	service *service.UserService
}

func NewUserController(service *service.UserService) *UserController {
	return &UserController{
		service: service,
	}
}

// GetUserByEmail godoc
// @Summary Get user by email
// @Description Get user data based on email
// @Tags Users
// @Accept json
// @Produce json
// @Param email path string true "User Email"
// @Success 200 {object} dto.UserResponse
// @Failure 400 {object} dto.UserResponse
// @Failure 404 {object} dto.UserResponse
// @Failure 500 {object} dto.UserResponse
// @Router /api/email/{email} [get]
func (u *UserController) GetByEmail(ctx *gin.Context) {
	email := ctx.Param("email")

	result, err := u.service.GetByEmail(ctx.Request.Context(), email)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.UserResponse{
			Success: false,
			Message: "internal server error",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.UserResponse{
		Success: true,
		Message: "success get data by email",
		Result:  result,
	})
}
