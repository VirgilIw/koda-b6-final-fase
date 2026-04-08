package dto

import "time"

type UserDto struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

type UserResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
	Result  any    `json:"result"`
}

type UserData struct {
	Id    int    `json:"id"`
	Email string `json:"email"`
}

type UserById struct {
	Id        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Image     string    `json:"image"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
}
