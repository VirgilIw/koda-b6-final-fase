package service

import (
	"context"
	"errors"

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
