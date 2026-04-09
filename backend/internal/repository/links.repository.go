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

	if r.rdb != nil {
		keys, _ := r.rdb.Keys(ctx, fmt.Sprintf("links:user:%d:*", userID)).Result()
		if len(keys) > 0 {
			fmt.Println("DELETING CACHE KEYS:", keys)
			r.rdb.Del(ctx, keys...)
		}
	}

	return link, nil
}

func (r *LinksRepository) GetAllShortLinks(ctx context.Context, userID int, limit, offset int) ([]model.Link, error) {

	cachedKey := fmt.Sprintf("links:user:%d:limit:%d:offset:%d", userID, limit, offset)

	if r.rdb == nil {
		fmt.Println("REDIS NOT INITIALIZED")
	} else {
		fmt.Println("REDIS READY")
		fmt.Println("CHECK REDIS KEY:", cachedKey)
	}

	if r.rdb != nil {
		valueCache, err := r.rdb.Get(ctx, cachedKey).Result()
		if err == nil {
			var links []model.Link
			if err := json.Unmarshal([]byte(valueCache), &links); err == nil {
				fmt.Println("[CACHE HIT]")
				fmt.Println("USER ID:", userID)
				fmt.Println("LIMIT:", limit, "OFFSET:", offset)
				fmt.Println("TOTAL LINKS:", len(links))
				return links, nil
			}
		} else {
			fmt.Println("REDIS GET ERROR:", err)
		}
	}

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

	if r.rdb != nil && len(links) > 0 {
		data, err := json.Marshal(links)
		if err != nil {
			fmt.Println("JSON MARSHAL ERROR:", err)
		} else {
			err := r.rdb.Set(ctx, cachedKey, data, time.Hour).Err()
			if err != nil {
				fmt.Println("REDIS SET ERROR:", err)
			} else {
				fmt.Println("[CACHE SAVED]")
			}
		}
	}

	return links, nil
}

func (r *LinksRepository) GetAndIncrement(ctx context.Context, slug string) (model.Link, error) {
	tx, err := r.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return model.Link{}, fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	// 1. SELECT + lock
	querySelect := `
		SELECT id, user_id, original_url, slug, created_at, click_count
		FROM links
		WHERE slug = $1
		FOR UPDATE
	`

	rows, err := tx.Query(ctx, querySelect, slug)
	if err != nil {
		return model.Link{}, fmt.Errorf("select query: %w", err)
	}

	link, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[model.Link])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.Link{}, customerrors.ErrLinkNotFound
		}
		return model.Link{}, fmt.Errorf("collect select: %w", err)
	}

	// 2. UPDATE
	queryUpdate := `
		UPDATE links
		SET click_count = click_count + 1
		WHERE id = $1
		RETURNING click_count
	`

	var newClickCount int
	err = tx.QueryRow(ctx, queryUpdate, link.ID).Scan(&newClickCount)
	if err != nil {
		return model.Link{}, fmt.Errorf("update query: %w", err)
	}

	link.ClickCount = newClickCount

	if err := tx.Commit(ctx); err != nil {
		return model.Link{}, fmt.Errorf("commit: %w", err)
	}

	if r.rdb != nil {
		keys, _ := r.rdb.Keys(ctx, fmt.Sprintf("links:user:%d:*", link.UserID)).Result()
		if len(keys) > 0 {
			r.rdb.Del(ctx, keys...)
		}
	}

	return link, nil
}

func (r *LinksRepository) DeleteLinksById(ctx context.Context, idlinks, userId int) (bool, error) {
	query := `
		DELETE FROM links
		WHERE id = $1 AND user_id = $2
	`

	result, err := r.db.Exec(ctx, query, idlinks, userId)
	if err != nil {
		return false, err
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return false, nil
	}

	if r.rdb != nil {
		keys, _ := r.rdb.Keys(ctx, fmt.Sprintf("links:user:%d:*", userId)).Result()
		if len(keys) > 0 {
			fmt.Println("DELETING CACHE KEYS:", keys)
			r.rdb.Del(ctx, keys...)
		}
	}

	return true, nil
}
