package dto

type ShortLinksRequest struct {
	OriginalURL string `json:"original_url" binding:"required,url"`
	Slug        string `json:"slug,omitempty"`
}
