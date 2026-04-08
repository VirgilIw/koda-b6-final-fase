package model

import "time"

type User struct {
	Id        int        `db:"id"`
	Name      string     `db:"name"`
	Email     string     `db:"email"`
	Password  string     `db:"password"`
	Image     string     `db:"image"`
	CreatedAt time.Time  `db:"created_at"`
	UpdatedAt *time.Time `db:"updated_at"`
}

type UserById struct {
	Id        int        `db:"id"`
	Name      string     `db:"name"`
	Email     string     `db:"email"`
	Image     string     `db:"image"`
	Password  string     `db:"password"`
	CreatedAt time.Time  `db:"created_at"`
	UpdatedAt *time.Time `db:"updated_at"`
}
