package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5/pgconn"
	gonanoid "github.com/matoous/go-nanoid/v2"

	"github.com/virgilIw/koda-b6-final-fase/internal/customerrors"
	"github.com/virgilIw/koda-b6-final-fase/internal/dto"
	"github.com/virgilIw/koda-b6-final-fase/internal/model"
	"github.com/virgilIw/koda-b6-final-fase/internal/repository"
)

type LinksService struct {
	repo    *repository.LinksRepository
	baseURL string
}

func NewLinksService(repo *repository.LinksRepository, baseURL string) *LinksService {
	return &LinksService{repo: repo, baseURL: baseURL}
}

func (s *LinksService) CreateShortLinks(ctx context.Context, userID int, req dto.ShortLinksRequest) (dto.ShortLinksResponse, error) {
	const slugAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	slug := req.Slug

	if slug == "" {
		var err error
		slug, err = gonanoid.Generate(slugAlphabet, 6)
		if err != nil {
			return dto.ShortLinksResponse{}, fmt.Errorf("generate slug: %w", err)
		}
	}

	link, err := s.repo.CreateShortLinks(ctx, userID, req.OriginalURL, slug)
	if err != nil {
		fmt.Println("ERROR SERVICE:", err)
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return dto.ShortLinksResponse{}, customerrors.ErrSlugTaken
		}
		return dto.ShortLinksResponse{}, fmt.Errorf("create short link: %w", err)
	}

	return dto.ShortLinksResponse{
		ID:          link.ID,
		OriginalURL: link.OriginalURL,
		Slug:        link.Slug,
		ShortURL:    fmt.Sprintf("%s/r/%s", s.baseURL, link.Slug),
	}, nil
}

func (s *LinksService) GetAndIncrement(ctx context.Context, slug string) (model.Link, error) {
	return s.repo.GetAndIncrement(ctx, slug)
}

func (s *LinksService) GetAllShortLinks(ctx context.Context, userID int, limit, offset int) ([]dto.ShortLinksResponse, error) {
	links, err := s.repo.GetAllShortLinks(ctx, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("get all short links: %w", err)
	}

	var result []dto.ShortLinksResponse
	for _, link := range links {
		result = append(result, dto.ShortLinksResponse{
			ID:          link.ID,
			OriginalURL: link.OriginalURL,
			Slug:        link.Slug,
			ShortURL:    fmt.Sprintf("%s/r/%s", s.baseURL, link.Slug),
			ClickCount:  link.ClickCount,
			CreatedAt:   link.CreatedAt,
		})
	}

	return result, nil
}
