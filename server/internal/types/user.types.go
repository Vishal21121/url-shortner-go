package types

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserRegister struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username   string             `json:"username"`
	Email      string             `json:"email"`
	Password   string             `json:"password"`
	IsLoggedIn bool               `json:"isLoggedIn"`
}

type RegisterUserStruct struct {
	Username string `json:"username" validate:"required,gte=3,lte=8"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,gte=8,lte=13"`
}
type LoginUserStruct struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}
