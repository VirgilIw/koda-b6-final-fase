package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/dto"
	"github.com/virgilIw/koda-b6-final-fase/internal/service"
)

type AuthController struct {
	service *service.AuthService
}

func NewAuthController(service *service.AuthService) *AuthController {
	return &AuthController{
		service: service,
	}
}

// Register godoc
// @Summary Register user
// @Description Register user
// @Tags Authentication
// @Accept json
// @Produce json
// @Param request body dto.AuthRegisterRequest true "Register Request"
// @Success 201 {object} dto.AuthRegisterResponse
// @Failure 400 {object} dto.AuthRegisterResponse
// @Failure 409 {object} dto.AuthRegisterResponse
// @Failure 500 {object} dto.AuthRegisterResponse
// @Router /auth/register [post]
func (a *AuthController) Register(ctx *gin.Context) {
	var req dto.AuthRegisterRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.AuthRegisterResponse{
			Success: false,
			Message: "bad request",
			Error:   "email not valid",
		})
		return
		// guarding method
	}

	if err := a.service.Register(ctx.Request.Context(), req); err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.AuthRegisterResponse{
			Success: false,
			Message: "internal server error",
			Error:   err.Error(), // err.error() buat cek error
		})
		return
	}

	ctx.JSON(http.StatusCreated, dto.AuthRegisterResponse{
		Success: true,
		Message: "register success",
	})

}
