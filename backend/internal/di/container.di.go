package di

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/virgilIw/koda-b6-final-fase/internal/controller"
	"github.com/virgilIw/koda-b6-final-fase/internal/repository"
	"github.com/virgilIw/koda-b6-final-fase/internal/service"
)

type Container struct {
	db *pgxpool.Pool

	authRepo       *repository.AuthRepository
	authService    *service.AuthService
	authController *controller.AuthController
}

func NewContainer(db *pgxpool.Pool) *Container {
	container := &Container{
		db: db,
	}

	container.initDependencies()
	return container
}

func (c *Container) initDependencies() {
	c.authRepo = repository.NewAuthRepository(c.db)
	c.authService = service.NewAuthService(c.authRepo)
	c.authController = controller.NewAuthController(c.authService)
}

func (c *Container) AuthController() *controller.AuthController {
	return c.authController
}
