package customerrors

import "errors"

var (
	ErrSlugTaken    = errors.New("slug already taken")
	ErrLinkNotFound = errors.New("link not found")
	ErrUserNotFound = errors.New("user not found")
)
