package server

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/vishal21121/url-shortner-go/internal/types"
	"github.com/vishal21121/url-shortner-go/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserHandler struct {
	UserCollection *mongo.Collection
}

func (userHandler *UserHandler) LoginUser(c echo.Context) error {
	body := types.LoginUserStruct{}
	err := c.Bind(&body)
	if err != nil {
		return c.JSON(400, map[string]any{"success": false, "data": map[string]any{"statusCode": 400, "message": "Please provide proper fields"}})
	}
	var foundUser map[string]any
	userHandler.UserCollection.FindOne(c.Request().Context(), map[string]interface{}{"email": body.Email}).Decode(&foundUser)

	if foundUser == nil {
		return c.JSON(401, map[string]any{"success": false, "data": map[string]any{"statusCode": 401, "message": "Please provide correct credentials"}})
	}
	isValid, _ := utils.CheckPassword(foundUser["password"], body.Password)
	if !isValid {
		return c.JSON(401, map[string]any{"success": false, "data": map[string]any{"statusCode": 401, "message": "Please provide correct credentials"}})
	}

	var updatedUser bson.M
	userHandler.UserCollection.FindOneAndUpdate(c.Request().Context(), map[string]any{"email": body.Email}, bson.M{"$set": bson.M{"isLoggedIn": true}}, options.FindOneAndUpdate().SetReturnDocument(options.After)).Decode(&updatedUser)

	delete(foundUser, "password")
	return c.JSON(200, map[string]any{"success": true, "data": map[string]any{"statusCode": 200, "data": foundUser}})
}

func (userHandler *UserHandler) RegisterUser(c echo.Context) error {
	// variable for unstructuring the data of the body
	body := types.RegisterUserStruct{}
	err := c.Bind(&body)
	if err != nil {
		fmt.Println("bad data received")
		return c.JSON(400, map[string]any{"success": false, "data": map[string]any{"statusCode": 400, "message": "Please provide proper fields"}})
	}

	// searching for the user with the provided email id in the database
	var foundUser map[string]any
	userHandler.UserCollection.FindOne(c.Request().Context(), bson.M{"email": body.Email}).Decode(&foundUser)

	if foundUser != nil {
		return c.JSON(401, map[string]any{"success": false, "data": map[string]any{"statusCode": 401, "message": "Please provide another email id"}})
	}

	// generating the hashed password
	hashedPassword, hashErr := utils.HashPassword(body.Password)
	if hashErr != nil {
		fmt.Println("hash error")
		return c.JSON(500, map[string]any{"success": false, "data": map[string]any{"statusCode": 500, "message": "Internal server error"}})
	}

	// inserting the user in the database
	result, insertionErr := userHandler.UserCollection.InsertOne(c.Request().Context(), bson.M{"username": body.Username, "password": string(hashedPassword), "email": body.Email, "isLoggedIn": false})

	if insertionErr != nil {
		fmt.Println("insertion issue")
		return c.JSON(500, map[string]any{"success": false, "data": map[string]any{"statusCode": 500, "message": "Internal server error"}})
	}

	// checking whether user is successfully created in the database
	var insertedUser map[string]any
	userHandler.UserCollection.FindOne(c.Request().Context(), bson.M{"_id": result.InsertedID}).Decode(&insertedUser)

	if insertedUser == nil {
		fmt.Println("after insertion")
		return c.JSON(500, map[string]any{"success": false, "data": map[string]any{"statusCode": 500, "message": "Internal server error"}})
	}

	delete(insertedUser, "password")

	// finally returning the userinfo
	return c.JSON(201, map[string]any{"success": true, "data": map[string]any{"statusCode": 201, "data": insertedUser}})
}
