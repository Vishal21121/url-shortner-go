package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type UserRegister struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username   string             `json:"username"`
	Email      string             `json:"email"`
	Password   string             `json:"password"`
	IsLoggedIn bool               `json:"isLoggedIn"`
}

type RegisterUserStruct struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
type LoginUserStruct struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
