package dto

import "time"

type ShortLinksResponse struct {
	ID          int       `json:"id"`
	OriginalURL string    `json:"original_url"`
	Slug        string    `json:"slug"`
	ShortURL    string    `json:"short_url"`
	ClickCount  int       `json:"click_count"`
	CreatedAt   time.Time `json:"created_at"`
}

type LinksResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Result  any    `json:"result"`
	Page    int    `json:"page,omitempty"`
	Limit   int    `json:"limit,omitempty"`
	HasNext bool   `json:"has_next,omitempty"`
	Error   string `json:"error,omitempty"`
}
