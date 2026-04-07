package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/virgilIw/koda-b6-final-fase/internal/customerrors"
	"github.com/virgilIw/koda-b6-final-fase/internal/model"
)

type LinksRepository struct {
	db *pgxpool.Pool
}

func NewLinksRepository(db *pgxpool.Pool) *LinksRepository {
	return &LinksRepository{db: db}
}

func (r *LinksRepository) CreateShortLinks(ctx context.Context, userID int, originalURL string, slug string) (model.Link, error) {
	query := `
		INSERT INTO links (user_id, original_url, slug)
		VALUES ($1, $2, $3)
		RETURNING id, user_id, original_url, slug, created_at, click_count
	`

	rows, err := r.db.Query(ctx, query, userID, originalURL, slug)
	if err != nil {
		return model.Link{}, fmt.Errorf("CreateShortLinks query: %w", err)
	}

	link, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[model.Link])
	if err != nil {
		return model.Link{}, fmt.Errorf("CreateShortLinks collect: %w", err)
	}

	return link, nil
}

func (r *LinksRepository) GetShortLinks(ctx context.Context, slug string) (model.Link, error) {
	query := `
		SELECT id, user_id, original_url, slug, created_at, click_count
		FROM links
		WHERE slug = $1
	`

	rows, err := r.db.Query(ctx, query, slug)
	if err != nil {
		return model.Link{}, fmt.Errorf("GetShortLinks query: %w", err)
	}
	defer rows.Close()

	link, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[model.Link])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.Link{}, customerrors.ErrLinkNotFound
		}
		return model.Link{}, fmt.Errorf("GetShortLinks collect: %w", err)
	}

	return link, nil
}

func (r *LinksRepository) GetAllShortLinks(ctx context.Context, userID int, limit, offset int) ([]model.Link, error) {
	query := `
		SELECT id, user_id, original_url, slug, created_at, click_count
		FROM links
		WHERE user_id = $1
		ORDER BY id ASC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.Query(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("GetAllShortLinks query: %w", err)
	}
	defer rows.Close()

	links, err := pgx.CollectRows(rows, pgx.RowToStructByName[model.Link])
	if err != nil {
		return nil, fmt.Errorf("GetAllShortLinks collect: %w", err)
	}

	return links, nil
}

func (r *LinksRepository) IncrementClick(ctx context.Context, linkID int) error {
	query := `
		UPDATE links 
		SET click_count = click_count + 1 
		WHERE id = $1
	`

	cmdTag, err := r.db.Exec(ctx, query, linkID)
	if err != nil {
		return fmt.Errorf("IncrementClick exec: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("IncrementClick: no rows updated for linkID %d", linkID)
	}

	return nil
}
