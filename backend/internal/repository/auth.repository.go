package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/virgilIw/koda-b6-final-fase/internal/dto"
)

type AuthRepository struct {
	db *pgxpool.Pool
}

func NewAuthRepository(db *pgxpool.Pool) *AuthRepository {
	return &AuthRepository{
		db: db,
	}
}

func (a *AuthRepository) Register(ctx context.Context, req dto.AuthRegisterRequest) error {
	query := `
	insert into users (email, password)
	values($1, $2)
`

	_, err := a.db.Exec(ctx, query, req.Email, req.Password)
	if err != nil {
		var pgErr *pgconn.PgError

		if errors.As(err, &pgErr) {
			if pgErr.Code == "23505" {
				return errors.New("email already exists")
			}
		}

		return err
	}

	return nil
}
