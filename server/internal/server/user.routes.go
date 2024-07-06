package server

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/vishal21121/url-shortner-go/internal/types"
	"github.com/vishal21121/url-shortner-go/internal/utils"
	"github.com/vishal21121/url-shortner-go/internal/validators"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserHandler struct {
	UserCollection *mongo.Collection
}

func NewUserCollection(collection *mongo.Collection) *UserHandler {
	return &UserHandler{UserCollection: collection}
}

func (userHandler *UserHandler) LoginUser(c echo.Context) error {
	body := types.LoginUserStruct{}
	err := c.Bind(&body)
	if err != nil {
		return c.JSON(400, map[string]any{"success": false, "data": map[string]any{"statusCode": 400, "message": "Please provide proper fields"}})
	}
	if validateErr := c.Validate(body); validateErr != nil {
		errorMessages := validators.UserLoginValidator(c, validateErr)
		return types.ThrowError(422, "Validation failed", errorMessages)
	}

	var foundUser map[string]any
	userHandler.UserCollection.FindOne(c.Request().Context(), map[string]interface{}{"email": body.Email}).Decode(&foundUser)

	if foundUser == nil {
		return types.ThrowError(401, "Please provide correct credentials", []string{})
	}
	isValid, _ := utils.CheckPassword(foundUser["password"], body.Password)
	if !isValid {
		return types.ThrowError(401, "Please provide correct credentials", []string{})
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
		return types.ThrowError(400, "Please provide proper fields", []string{})
	}

	if validateErr := c.Validate(body); validateErr != nil {
		errorMessages := validators.UserRegisterValidator(c, validateErr)
		return types.ThrowError(422, "Validation failed", errorMessages)
	}

	// searching for the user with the provided email id in the database
	var foundUser map[string]any
	userHandler.UserCollection.FindOne(c.Request().Context(), bson.M{"email": body.Email}).Decode(&foundUser)

	if foundUser != nil {
		return types.ThrowError(409, "Please provide another email id", []string{})
	}

	userHandler.UserCollection.FindOne(c.Request().Context(), bson.M{"username": body.Username}).Decode(&foundUser)

	if foundUser != nil {
		return types.ThrowError(409, "Please provide another username", []string{})
	}

	// generating the hashed password
	hashedPassword, hashErr := utils.HashPassword(body.Password)
	if hashErr != nil {
		fmt.Println("hash error")
		return types.ThrowError(500, hashErr.Error(), []string{})
	}

	// inserting the user in the database
	result, insertionErr := userHandler.UserCollection.InsertOne(c.Request().Context(), bson.M{"username": body.Username, "password": string(hashedPassword), "email": body.Email, "isLoggedIn": false})

	if insertionErr != nil {
		fmt.Println("insertion issue")
		return types.ThrowError(500, insertionErr.Error(), []string{})
	}

	// checking whether user is successfully created in the database
	var insertedUser map[string]any
	userHandler.UserCollection.FindOne(c.Request().Context(), bson.M{"_id": result.InsertedID}).Decode(&insertedUser)

	if insertedUser == nil {
		fmt.Println("after insertion")
		return types.ThrowError(500, "Internal server error", []string{})
	}

	delete(insertedUser, "password")

	// finally returning the userinfo
	return c.JSON(201, map[string]any{"success": true, "data": map[string]any{"statusCode": 201, "data": insertedUser}})
}
