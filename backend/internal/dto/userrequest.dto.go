package dto

type CreateUserRequest struct {
	Name     string `form:"name" binding:"required,min=3,max=100"`
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required,min=6"`
}

type UpdateUserRequest struct {
	ID    int    `form:"id" binding:"required"`
	Name  string `form:"name" binding:"omitempty,min=3,max=100"`
	Email string `form:"email" binding:"omitempty,email"`
}
