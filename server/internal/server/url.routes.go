package server

import (
	"fmt"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/vishal21121/url-shortner-go/internal/types"
	"github.com/vishal21121/url-shortner-go/internal/validators"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UrlHandler struct {
	UrlCollection *mongo.Collection
}

func NewUrlCollection(collection *mongo.Collection) *UrlHandler {
	return &UrlHandler{UrlCollection: collection}
}

func (collection *UrlHandler) CreateUrl(c echo.Context, userCollection *UserHandler) error {
	var body types.UrlCreate
	bindErr := c.Bind(&body)
	if bindErr != nil {
		return types.ThrowError(400, bindErr.Error(), []string{})
	}
	if bodyValidationErr := c.Validate(body); bodyValidationErr != nil {
		errorMessages := validators.CreateUrlValidator(c, bodyValidationErr)
		return types.ThrowError(422, "Validation Error", errorMessages)
	}
	userId, _ := primitive.ObjectIDFromHex(body.UserId)

	var foundUser bson.M
	userCollection.UserCollection.FindOne(c.Request().Context(), bson.M{"_id": userId}).Decode(&foundUser)

	if foundUser == nil {
		return types.ThrowError(404, "User does not exist with the provided userId", []string{})
	}

	var urlFound bson.M
	collection.UrlCollection.FindOne(c.Request().Context(), bson.M{"aliase": body.Aliase}).Decode(&urlFound)

	if urlFound != nil {
		return types.ThrowError(409, "Please enter another aliase", []string{})
	}

	result, insertionErr := collection.UrlCollection.InsertOne(c.Request().Context(), bson.M{"aliase": body.Aliase, "redirectUrl": body.RedirectUrl, "clicked": 0, "userId": userId, "shortUrl": fmt.Sprintf("http://localhost:8080/%s", body.Aliase), "createdAt": time.Now()})
	if insertionErr != nil {
		return types.ThrowError(500, "Internal server error", []string{})
	}

	var insertedUrl bson.M
	collection.UrlCollection.FindOne(c.Request().Context(), bson.M{"_id": result.InsertedID}).Decode(&insertedUrl)

	return c.JSON(201, map[string]any{
		"data": map[string]any{
			"statusCode": 201,
			"data":       insertedUrl,
		},
		"success": true,
	})
}

func (collection *UrlHandler) FetchAllUrls(c echo.Context, userCollection *UserHandler) error {
	userId := c.QueryParam("userId")
	mongoUserId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return types.ThrowError(500, "Internal server error", []string{})
	}

	var userFound bson.M
	userCollection.UserCollection.FindOne(c.Request().Context(), bson.M{"_id": mongoUserId}).Decode(&userFound)
	if userFound == nil {
		return types.ThrowError(400, "User does not exist with the provided User id", []string{})
	}
	cursor, findErr := collection.UrlCollection.Find(c.Request().Context(), bson.M{"userId": mongoUserId})
	if findErr != nil {
		fmt.Println("error in finding the urls")
		return types.ThrowError(500, findErr.Error(), []string{})
	}

	var urls []bson.M
	if err := cursor.All(c.Request().Context(), &urls); err != nil {
		fmt.Println("error in decoding the urls")
		return types.ThrowError(500, err.Error(), []string{})
	}
	return c.JSON(200, map[string]any{
		"data": map[string]any{
			"statusCode": 200,
			"data":       urls,
		},
		"success": true,
	})
}
