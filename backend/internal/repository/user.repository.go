package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/virgilIw/koda-b6-final-fase/internal/model"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (u *UserRepository) GetByEmail(ctx context.Context, email string) (model.User, error) {
	query := `
		SELECT 
			id,
			COALESCE(NULLIF(name, ''), '') AS name,
			email,
			password,
			created_at,
			updated_at
		FROM users
		WHERE email = $1;
	`

	rows, err := u.db.Query(ctx, query, email)
	if err != nil {
		return model.User{}, err
	}

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[model.User])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.User{}, errors.New("user not found")
		}
		return model.User{}, err
	}

	return user, nil
}
