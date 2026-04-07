package model

import "time"

type Link struct {
	ID          int       `db:"id"`
	UserID      int       `db:"user_id"`
	OriginalURL string    `db:"original_url"`
	Slug        string    `db:"slug"`
	ClickCount  int       `db:"click_count"`
	CreatedAt   time.Time `db:"created_at"`
}
