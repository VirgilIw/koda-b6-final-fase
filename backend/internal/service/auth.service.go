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
	repo *repository.AuthRepository
}

func NewAuthService(repo *repository.AuthRepository) *AuthService {
	return &AuthService{
		repo: repo,
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
