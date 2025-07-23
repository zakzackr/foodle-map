package model

import "time"

// DB保存用のUserデータ
type User struct {
	ID             int64     `json:"id"`
	Username       string    `json:"username"`
	Display_name   string    `json:"displayName"`
	Email          string    `json:"email"`
	Password       string    `json:"password"`
	Bio            string    `json:"bio"`
	FollowersCount int       `json:"followersCount"`
	FollowingCount int       `json:"followingCount"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// TODO: 以下も作成すること
// login用のUserデータ
// register用のUserデータ
