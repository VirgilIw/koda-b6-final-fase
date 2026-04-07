package service

import (
	"context"
	"errors"
	"unicode"

	"github.com/virgilIw/koda-b6-final-fase/internal/dto"
	"github.com/virgilIw/koda-b6-final-fase/internal/lib"
	"github.com/virgilIw/koda-b6-final-fase/internal/repository"
)

type AuthService struct {
	repo     *repository.AuthRepository
	repoUser *repository.UserRepository
}

func NewAuthService(repo *repository.AuthRepository, repoUser *repository.UserRepository) *AuthService {
	return &AuthService{
		repo:     repo,
		repoUser: repoUser,
	}
}

// helper function
func isValidPassword(pass string) bool {
	hasUpper := false
	hasNumber := false

	for _, req := range pass {
		if unicode.IsUpper(req) {
			hasUpper = true
		}
		if unicode.IsDigit(req) {
			hasNumber = true
		}
	}

	return hasUpper && hasNumber
}

func (a *AuthService) Register(ctx context.Context, req dto.AuthRegisterRequest) error {
	if !isValidPassword(req.Password) {
		return errors.New("password must contain at least 1 uppercase letter and 1 number")
	}

	hash, err := lib.HashPassword(req.Password)
	if err != nil {
		return err
	}

	req.Password = hash

	if err := a.repo.Register(ctx, req); err != nil {
		return err
	}

	return nil
}

func (a *AuthService) Login(ctx context.Context, req dto.AuthLoginRequest) (dto.LoginAllData, error) {
	user, err := a.repoUser.GetByEmail(ctx, req.Email)
	if err != nil {
		return dto.LoginAllData{}, errors.New("invalid email or password")
	}

	if !lib.VerifyPassword(req.Password, user.Password) {
		return dto.LoginAllData{}, errors.New("invalid email or password")
	}

	token, err := lib.GenerateToken(user.Id, user.Email)
	if err != nil {
		return dto.LoginAllData{}, err
	}

	return dto.LoginAllData{
		Token: token,
		User: dto.UserData{
			Id:    user.Id,
			Email: user.Email,
		},
	}, nil
}
