package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type UrlCreate struct {
	RedirectUrl string `json:"redirectUrl" validate:"required"`
	Aliase      string `json:"aliase" validate:"required"`
	UserId      string `json:"userId" validate:"required"`
}

type Url struct {
	Id          primitive.ObjectID `bson:"_id"`
	Aliase      string             `bson:"aliase"`
	RedirectUrl string             `bson:"redirectUrl"`
	ShortUrl    string             `bson:"shortUrl"`
	CreatedAt   primitive.DateTime `bson:"createdAt"`
	Clicked     int                `bson:"clicked"`
	UserId      primitive.ObjectID `bson:"userId"`
}
