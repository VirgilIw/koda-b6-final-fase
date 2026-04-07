package controller

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/virgilIw/koda-b6-final-fase/internal/customerrors"
	"github.com/virgilIw/koda-b6-final-fase/internal/dto"
	"github.com/virgilIw/koda-b6-final-fase/internal/service"
)

type LinksController struct {
	service *service.LinksService
}

func NewLinksController(service *service.LinksService) *LinksController {
	return &LinksController{service: service}
}

func getUserID(ctx *gin.Context) (int, error) {
	val, exists := ctx.Get("user_id")
	if !exists {
		return 0, errors.New("unauthorized")
	}

	id, ok := val.(int)
	if !ok {
		return 0, errors.New("invalid user id")
	}

	return id, nil
}

// GetAllShortLinks godoc
// @Summary Get all short links
// @Description Get paginated short links for authenticated user
// @Tags Links
// @Security BearerAuth
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Limit per page" default(4)
// @Success 200 {object} dto.LinksResponse "Links fetched successfully"
// @Failure 401 {object} dto.LinksResponse "Unauthorized"
// @Failure 500 {object} dto.LinksResponse "Internal server error"
// @Router /api/links [get]
func (c *LinksController) GetAllShortLinks(ctx *gin.Context) {
	userID, err := getUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, dto.LinksResponse{
			Success: false,
			Message: "unauthorized",
			Error:   err.Error(),
		})
		return
	}

	pageStr := ctx.DefaultQuery("page", "1")
	limitStr := ctx.DefaultQuery("limit", "4")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 4
	}
	if limit > 100 {
		limit = 100
	}

	offset := (page - 1) * limit

	links, err := c.service.GetAllShortLinks(ctx.Request.Context(), userID, limit, offset)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.LinksResponse{
			Success: false,
			Message: "failed to get links",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.LinksResponse{
		Success: true,
		Message: "links fetched successfully",
		Result:  links,
	})
}

// CreateShortLink godoc
// @Summary Create short link
// @Description Create a new short link for authenticated user
// @Tags Links
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body dto.ShortLinksRequest true "Short Link Request"
// @Success 201 {object} dto.LinksResponse "Link created successfully"
// @Failure 400 {object} dto.LinksResponse "Invalid request body"
// @Failure 401 {object} dto.LinksResponse "Unauthorized"
// @Failure 409 {object} dto.LinksResponse "Slug already taken"
// @Failure 500 {object} dto.LinksResponse "Internal server error"
// @Router /api/links [post]
func (c *LinksController) CreateShortLink(ctx *gin.Context) {
	var req dto.ShortLinksRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.LinksResponse{
			Success: false,
			Message: "invalid request body",
			Error:   err.Error(),
		})
		return
	}

	userID, err := getUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, dto.LinksResponse{
			Success: false,
			Message: "unauthorized",
			Error:   err.Error(),
		})
		return
	}

	res, err := c.service.CreateShortLinks(ctx.Request.Context(), userID, req)
	if err != nil {
		if errors.Is(err, customerrors.ErrSlugTaken) {
			ctx.JSON(http.StatusConflict, dto.LinksResponse{
				Success: false,
				Message: "slug already taken",
				Error:   err.Error(),
			})
			return
		}

		ctx.JSON(http.StatusInternalServerError, dto.LinksResponse{
			Success: false,
			Message: "failed to create short link",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, dto.LinksResponse{
		Success: true,
		Message: "link created successfully",
		Result:  res,
	})
}

// Redirect godoc
// @Summary Redirect to original URL
// @Description Redirect user to original URL using slug (requires authentication)
// @Tags Links
// @Security BearerAuth
// @Param slug path string true "Short link slug"
// @Success 302 "Redirect to original URL"
// @Failure 401 {object} dto.LinksResponse "Unauthorized"
// @Failure 404 {object} dto.LinksResponse "Link not found"
// @Failure 500 {object} dto.LinksResponse "Internal server error"
// @Router /r/{slug} [get]
func (c *LinksController) Redirect(ctx *gin.Context) {
	slug := ctx.Param("slug")

	link, err := c.service.GetShortLinks(ctx.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, customerrors.ErrLinkNotFound) {
			ctx.JSON(http.StatusNotFound, dto.LinksResponse{
				Success: false,
				Message: "link not found",
				Error:   err.Error(),
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, dto.LinksResponse{
			Success: false,
			Message: "internal server error",
			Error:   err.Error(),
		})
		return
	}

	// FIX: pakai request context
	if err = c.service.IncrementClick(ctx.Request.Context(), link.ID); err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.LinksResponse{
			Success: false,
			Message: "internal server error",
			Error:   err.Error(),
		})
		return
	}

	ctx.Redirect(http.StatusFound, link.OriginalURL)
}
