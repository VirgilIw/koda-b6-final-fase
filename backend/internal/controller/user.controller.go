package controller

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/virgilIw/koda-b6-final-fase/internal/customerrors"
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

// GetCurrentUser godoc
// @Summary Get current user
// @Description Get logged-in user data from JWT
// @Tags Users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} dto.UserResponse
// @Failure 401 {object} dto.UserResponse
// @Failure 404 {object} dto.UserResponse
// @Failure 500 {object} dto.UserResponse
// @Router /api/users/me [get]
func (h *UserController) GetUserByID(ctx *gin.Context) {
	userIDVal, exists := ctx.Get("user_id")

	if !exists {
		ctx.JSON(http.StatusUnauthorized, dto.UserResponse{
			Success: false,
			Message: "unauthorized",
		})
		return
	}

	userID, ok := userIDVal.(int)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, dto.UserResponse{
			Success: false,
			Message: "invalid user",
		})
		return
	}

	result, err := h.service.GetUserByID(ctx.Request.Context(), userID)

	if err != nil {
		if errors.Is(err, customerrors.ErrUserNotFound) {
			ctx.JSON(http.StatusNotFound, dto.UserResponse{
				Success: false,
				Message: "user not found",
				Error:   err.Error(),
			})
			return
		}

		ctx.JSON(http.StatusInternalServerError, dto.UserResponse{
			Success: false,
			Message: "internal server error",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.UserResponse{
		Success: true,
		Message: "success get user",
		Result:  result,
	})
}

// GetUserByEmail godoc
// @Summary Get user by email
// @Description Get user data based on email
// @Tags Users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param email path string true "User Email"
// @Success 200 {object} dto.UserResponse
// @Failure 400 {object} dto.UserResponse
// @Failure 404 {object} dto.UserResponse
// @Failure 500 {object} dto.UserResponse
// @Router /api/users/email/{email} [get]
func (u *UserController) GetByEmail(ctx *gin.Context) {
	email := ctx.Param("email")

	result, err := u.service.GetByEmail(ctx.Request.Context(), email)

	if err != nil {
		if errors.Is(err, customerrors.ErrUserNotFound) {
			ctx.JSON(http.StatusNotFound, dto.UserResponse{
				Success: false,
				Message: "user not found",
				Error:   err.Error(),
			})
			return
		}

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
