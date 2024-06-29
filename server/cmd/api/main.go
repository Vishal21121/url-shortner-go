package main

import (
	"log"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/vishal21121/url-shortner-go/internal/database"
	"github.com/vishal21121/url-shortner-go/internal/server"
)

func main() {
	// connecting to database
	client, err := database.ConnectToDatabase("mongodb://localhost:27017")

	if err != nil {
		log.Fatal(err)
	}

	userHandler := server.UserHandler{
		UserCollection: client.Database("url-shortner").Collection("users"),
	}

	e := echo.New()

	// Middleware
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/health", func(c echo.Context) error {
		var jsonResponse struct {
			StatusCode int    `json:"statusCode"`
			Message    string `json:"message"`
		}

		jsonResponse.Message = "Api is running"
		jsonResponse.StatusCode = 200
		return c.JSON(200, jsonResponse)
	})

	userRouter := e.Group("/api/v1/users")
	userRouter.POST("/login", userHandler.LoginUser)
	userRouter.POST("/register", userHandler.RegisterUser)
	e.Logger.Fatal(e.Start(":8080"))
}
