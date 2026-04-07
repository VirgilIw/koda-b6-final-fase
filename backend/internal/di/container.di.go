package di

import (
	"os"

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

	userRepo       *repository.UserRepository
	userService    *service.UserService
	userController *controller.UserController

	linksRepo       *repository.LinksRepository
	linksService    *service.LinksService
	linksController *controller.LinksController
}

func NewContainer(db *pgxpool.Pool) *Container {
	container := &Container{
		db: db,
	}

	container.initDependencies()
	return container
}

func (c *Container) initDependencies() {
	// user
	c.userRepo = repository.NewUserRepository(c.db)
	c.userService = service.NewUserService(c.userRepo)
	c.userController = controller.NewUserController(c.userService)

	// auth
	c.authRepo = repository.NewAuthRepository(c.db)
	c.authService = service.NewAuthService(c.authRepo, c.userRepo)
	c.authController = controller.NewAuthController(c.authService)

	port := os.Getenv("APP_URL")

	baseURL := port

	c.linksRepo = repository.NewLinksRepository(c.db)
	c.linksService = service.NewLinksService(c.linksRepo, baseURL)
	c.linksController = controller.NewLinksController(c.linksService)
}

func (c *Container) AuthController() *controller.AuthController {
	return c.authController
}

func (c *Container) UserController() *controller.UserController {
	return c.userController
}

func (c *Container) LinksController() *controller.LinksController {
	return c.linksController
}
