package controller

import (
	"errors"
	"fmt"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

// UpdateUserImage godoc
// @Summary Update user image
// @Description Update profile image for authenticated user
// @Tags Users
// @Accept multipart/form-data
// @Produce json
// @Param image formData file true "User image file"
// @Security BearerAuth
// @Success 200 {object} dto.UserResponse
// @Failure 400 {object} dto.UserResponse
// @Failure 401 {object} dto.UserResponse
// @Failure 500 {object} dto.UserResponse
// @Router /api/users/image [patch]
func (h *UserController) UpdateUserImage(c *gin.Context) {

	userIDJwt, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.UserResponse{
			Success: false,
			Message: "unauthorized",
		})
		return
	}

	userID, ok := userIDJwt.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, dto.UserResponse{
			Success: false,
			Message: "invalid user id",
		})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.UserResponse{
			Success: false,
			Message: "image is required",
		})
		return
	}

	if file.Size > 1<<20 {
		c.JSON(http.StatusBadRequest, dto.UserResponse{
			Success: false,
			Message: "image size must be less than 1MB",
		})
		return
	}

	// tetap boleh cek extension (optional tapi bagus)
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
		c.JSON(http.StatusBadRequest, dto.UserResponse{
			Success: false,
			Message: "invalid file extension",
		})
		return
	}

	//validasi MIME pakai isi file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.UserResponse{
			Success: false,
			Message: "failed to open file",
		})
		return
	}
	defer src.Close()

	buffer := make([]byte, 512)
	_, err = src.Read(buffer)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.UserResponse{
			Success: false,
			Message: "invalid file",
		})
		return
	}

	mimeType := http.DetectContentType(buffer)
	if mimeType != "image/jpeg" && mimeType != "image/png" {
		c.JSON(http.StatusBadRequest, dto.UserResponse{
			Success: false,
			Message: "only jpg and png allowed",
		})
		return
	}

	src.Seek(0, 0)

	fileName := uuid.New().String() + ext
	filePath := fmt.Sprintf("uploads/%s", fileName)

	// tetap pakai SaveUploadedFile (biar simple)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, dto.UserResponse{
			Success: false,
			Message: "failed to save image",
		})
		return
	}

	result, err := h.service.UpdateUserImage(
		c.Request.Context(),
		userID,
		filePath,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.UserResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.UserResponse{
		Success: true,
		Message: "success update image",
		Result:  result,
	})
}
