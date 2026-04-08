package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/virgilIw/koda-b6-final-fase/internal/customerrors"
	"github.com/virgilIw/koda-b6-final-fase/internal/dto"
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

func (u *UserRepository) CreateUser(ctx context.Context, req dto.CreateUserRequest) (model.User, error) {
	query := `
		INSERT INTO users (
			name,
			email,
			password,
			image
		)
		VALUES ($1, $2, $3, $4)
		RETURNING 
			id,
			COALESCE(NULLIF(name, ''), '') AS name,
			email,
			password,
			COALESCE(NULLIF(image, ''), '') AS image,
			created_at,
			updated_at;
	`

	rows, err := u.db.Query(
		ctx,
		query,
		req.Name,
		req.Email,
		req.Password,
	)

	if err != nil {
		return model.User{}, err
	}

	result, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[model.User])
	if err != nil {
		return model.User{}, err
	}

	return result, nil
}

func (u *UserRepository) GetUserByID(ctx context.Context, id int) (model.UserById, error) {
	query := `
		SELECT
			id,
			COALESCE(NULLIF(name, ''), '') AS name,
			email,
			password,
			COALESCE(NULLIF(image, ''), '') AS image,
			created_at,
			updated_at
		FROM users
		WHERE id = $1;
		`

	rows, err := u.db.Query(ctx, query, id)

	if err != nil {
		return model.UserById{}, err
	}

	result, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[model.UserById])

	if err != nil {
		return model.UserById{}, err
	}
	return result, err
}

func (u *UserRepository) GetByEmail(ctx context.Context, email string) (model.User, error) {
	query := `
		SELECT 
			id,
			COALESCE(NULLIF(name, ''), '') AS name,
			email,
			password,
			COALESCE(NULLIF(image, ''), '') AS image,
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

func (u *UserRepository) UpdateUserImage(ctx context.Context, userID int, imagePath string) (model.User, error) {

	query := `
		UPDATE users
		SET 
			image = $1,
			updated_at = NOW()
		WHERE id = $2
		RETURNING 
			id,
			COALESCE(NULLIF(name, ''), '') AS name,
			email,
			password,
			image,
			created_at,
			updated_at;
	`

	rows, err := u.db.Query(ctx, query, imagePath, userID)
	if err != nil {
		return model.User{}, err
	}

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[model.User])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.User{}, customerrors.ErrUserNotFound
		}
		return model.User{}, err
	}

	return user, nil
}
