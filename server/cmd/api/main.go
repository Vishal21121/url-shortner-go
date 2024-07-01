package main

import (
	"fmt"
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/vishal21121/url-shortner-go/internal/database"
	"github.com/vishal21121/url-shortner-go/internal/server"
	"github.com/vishal21121/url-shortner-go/internal/types"
	"github.com/vishal21121/url-shortner-go/internal/utils"
	"github.com/vishal21121/url-shortner-go/internal/validators"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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

	urlHandler := server.UrlHandler{
		UrlCollection: client.Database("url-shortner").Collection("urls"),
	}

	type ClickHandler struct {
		ClickCollection *mongo.Collection
	}
	clickHandler := ClickHandler{ClickCollection: client.Database("url-shortner").Collection("click")}

	e := echo.New()

	// Middleware
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Validator = &validators.CustomValidator{Validator: validator.New()}

	e.GET("/api/v1/health", func(c echo.Context) error {
		var jsonResponse struct {
			StatusCode int    `json:"statusCode"`
			Message    string `json:"message"`
		}

		jsonResponse.Message = "Api is running"
		jsonResponse.StatusCode = 200
		return c.JSON(200, jsonResponse)
	})

	e.GET("/:alias", func(c echo.Context) error {
		alias := c.Param("alias")
		ipAddress := c.RealIP()
		location, err := utils.GetLocation(ipAddress)
		if err != nil {
			return c.JSON(500, map[string]any{
				"success": false,
				"data": map[string]any{
					"statusCode": 500,
					"message":    "Internal server error",
				},
			})
		}
		deviceType := utils.GetDeviceType(c.Request().UserAgent())
		_, insertionErr := clickHandler.ClickCollection.InsertOne(c.Request().Context(), bson.M{"aliase": alias, "city": location.City, "country": location.CountryName, "deviceType": deviceType})

		if insertionErr != nil {
			return c.JSON(500, map[string]any{
				"success": false,
				"data": map[string]any{
					"statusCode": 500,
					"message":    "Internal server error",
				},
			})
		}
		// update the count
		var url types.Url
		urlHandler.UrlCollection.FindOneAndUpdate(c.Request().Context(), bson.M{"aliase": alias}, bson.M{"$inc": bson.M{"clicked": 1}}, options.FindOneAndUpdate().SetReturnDocument(options.After)).Decode(&url)

		fmt.Println("url", url)

		// redirect to the redirectURL
		return c.Redirect(301, url.RedirectUrl)
	})

	userRouter := e.Group("/api/v1/users")
	userRouter.POST("/login", userHandler.LoginUser)
	userRouter.POST("/register", userHandler.RegisterUser)

	urlRouter := e.Group("/api/v1/urls")
	urlRouter.POST("/create", func(c echo.Context) error {
		return urlHandler.CreateUrl(c, &userHandler)
	})
	urlRouter.GET("/get", func(c echo.Context) error {
		return urlHandler.FetchAllUrls(c, &userHandler)
	})
	e.Logger.Fatal(e.Start(":8080"))
}
