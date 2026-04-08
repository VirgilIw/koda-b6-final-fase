package dto

type AuthRegisterResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}
type AuthLoginResponse struct {
	Success bool         `json:"success"`
	Message string       `json:"message"`
	Error   string       `json:"error,omitempty"`
	Result  LoginAllData `json:"result"`
}

type LoginAllData struct {
	Token string   `json:"token"`
	User  UserData `json:"user"`
}
