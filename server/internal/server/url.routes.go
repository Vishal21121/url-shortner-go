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

func (collection *UrlHandler) CreateUrl(c echo.Context, userCollection *UserHandler) error {
	var body types.UrlCreate
	bindErr := c.Bind(&body)
	if bindErr != nil {
		return c.JSON(400, map[string]any{"success": false, "data": map[string]any{"statusCode": 400, "message": bindErr.Error()}})
	}
	if bodyValidationErr := c.Validate(body); bodyValidationErr != nil {
		errorMessages := validators.CreateUrlValidator(c, bodyValidationErr)
		return c.JSON(422, map[string]any{
			"data": map[string]any{
				"statusCode": 422,
				"error":      errorMessages,
			},
			"success": false,
		})
	}
	userId, _ := primitive.ObjectIDFromHex(body.UserId)

	var foundUser bson.M
	userCollection.UserCollection.FindOne(c.Request().Context(), bson.M{"_id": userId}).Decode(&foundUser)

	if foundUser == nil {
		return c.JSON(400, map[string]any{
			"data": map[string]any{
				"statusCode": 400,
				"message":    "User does not exist with the provided userId",
			},
		})
	}

	var urlFound bson.M
	collection.UrlCollection.FindOne(c.Request().Context(), bson.M{"aliase": body.Aliase}).Decode(&urlFound)

	if urlFound != nil {
		return c.JSON(400, map[string]any{
			"data": map[string]any{
				"statusCode": 400,
				"message":    "Please enter another aliase",
			},
		})
	}

	result, insertionErr := collection.UrlCollection.InsertOne(c.Request().Context(), bson.M{"aliase": body.Aliase, "redirectUrl": body.RedirectUrl, "clicked": 0, "userId": userId, "shortUrl": fmt.Sprintf("http://localhost:8080/%s", body.Aliase), "createdAt": time.Now()})
	if insertionErr != nil {
		return c.JSON(400, map[string]any{
			"data": map[string]any{
				"statusCode": 400,
				"message":    "Internal server error",
			},
		})
	}

	var insertedUrl bson.M
	collection.UrlCollection.FindOne(c.Request().Context(), bson.M{"_id": result.InsertedID}).Decode(&insertedUrl)

	return c.JSON(201, map[string]any{
		"data": map[string]any{
			"statusCode": 201,
			"data":       insertedUrl,
		},
	})
}
