package service

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/virgilIw/koda-b6-final-fase/internal/customerrors"
	"github.com/virgilIw/koda-b6-final-fase/internal/dto"
	"github.com/virgilIw/koda-b6-final-fase/internal/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (u *UserService) GetUserByID(ctx context.Context, id int) (dto.UserById, error) {
	data, err := u.repo.GetUserByID(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return dto.UserById{}, customerrors.ErrUserNotFound
		}
		return dto.UserById{}, err
	}

	result := dto.UserById{
		Id:        data.Id,
		Name:      data.Name,
		Email:     data.Email,
		Image:     data.Image,
		CreatedAt: data.CreatedAt,
	}

	return result, nil
}

func (u *UserService) GetByEmail(ctx context.Context, email string) (dto.UserDto, error) {
	if email == "" {
		return dto.UserDto{}, errors.New("email cannot be empty")
	}
	data, err := u.repo.GetByEmail(ctx, email)

	if err != nil {
		return dto.UserDto{}, err
	}

	result := dto.UserDto{
		Id:    data.Id,
		Name:  data.Name,
		Email: data.Email,
	}
	return result, nil
}
