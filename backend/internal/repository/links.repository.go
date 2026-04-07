package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"github.com/virgilIw/koda-b6-final-fase/internal/customerrors"
	"github.com/virgilIw/koda-b6-final-fase/internal/model"
)

type LinksRepository struct {
	db  *pgxpool.Pool
	rdb *redis.Client
}

func NewLinksRepository(db *pgxpool.Pool, rdb *redis.Client) *LinksRepository {
	return &LinksRepository{
		db:  db,
		rdb: rdb,
	}
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
	cachedKey := fmt.Sprintf("links:user:%d:limit:%d:offset:%d", userID, limit, offset)

	valueCache, err := r.rdb.Get(ctx, cachedKey).Result()
	if err == nil {
		var links []model.Link
		if err := json.Unmarshal([]byte(valueCache), &links); err == nil {
			return links, nil
		}
	}

	query := `
	SELECT id, user_id, original_url, slug, created_at, click_count
	FROM links
	WHERE user_id = $1
	ORDER BY id ASC
	LIMIT $2 OFFSET $3
	`
	if r.rdb == nil {
		return nil, fmt.Errorf("redis client is nil")
	}

	if r.db == nil {
		return nil, fmt.Errorf("db is nil")
	}
	rows, err := r.db.Query(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("GetAllShortLinks query: %w", err)
	}
	defer rows.Close()

	links, err := pgx.CollectRows(rows, pgx.RowToStructByName[model.Link])
	if err != nil {
		return nil, fmt.Errorf("GetAllShortLinks collect: %w", err)
	}

	if data, err := json.Marshal(links); err == nil {
		r.rdb.Set(ctx, cachedKey, data, time.Minute*15)
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
