package server

import (
	"context"
	"fmt"
	"log"

	"github.com/labstack/echo/v4"
	"github.com/vishal21121/url-shortner-go/internal/utils"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserHandler struct {
	UserCollection *mongo.Collection
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

func (userHandler *UserHandler) LoginUser(c echo.Context) error {
	body := LoginUserStruct{}
	err := c.Bind(&body)
	if err != nil {
		log.Fatal(err)
	}
	var foundUser map[string]any
	if len(body.Email) > 0 && len(body.Password) > 0 {
		userHandler.UserCollection.FindOne(context.Background(), map[string]interface{}{"email": body.Email}).Decode(&foundUser)

		return c.JSON(200, foundUser)
	}
	return nil
}

func (userHandler *UserHandler) RegisterUser(c echo.Context) error {
	// variable for unstructuring the data of the body
	body := RegisterUserStruct{}
	err := c.Bind(&body)
	if err != nil {
		fmt.Println("bad data received")
		return c.JSON(400, map[string]any{"success": false, "data": map[string]any{"statusCode": 400, "message": "Please provide proper fields"}})
	}

	// searching for the user with the provided email id in the database
	var foundUser map[string]any
	userHandler.UserCollection.FindOne(context.Background(), map[string]any{"email": body.Email}).Decode(&foundUser)

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
	result, insertionErr := userHandler.UserCollection.InsertOne(context.Background(), map[string]any{"username": body.Username, "password": string(hashedPassword), "email": body.Email, "isLoggedIn": false})

	if insertionErr != nil {
		fmt.Println("insertion issue")
		return c.JSON(500, map[string]any{"success": false, "data": map[string]any{"statusCode": 500, "message": "Internal server error"}})
	}

	// checking whether user is successfully created in the database
	var insertedUser map[string]any
	userHandler.UserCollection.FindOne(context.Background(), map[string]any{"_id": result.InsertedID}).Decode(&insertedUser)

	if insertedUser == nil {
		fmt.Println("after insertion")
		return c.JSON(500, map[string]any{"success": false, "data": map[string]any{"statusCode": 500, "message": "Internal server error"}})
	}

	delete(insertedUser, "password")

	// finally returning the userinfo
	return c.JSON(201, map[string]any{"success": true, "data": map[string]any{"statusCode": 201, "data": insertedUser}})
}
