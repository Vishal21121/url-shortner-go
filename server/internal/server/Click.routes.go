package server

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type ClickHandler struct {
	ClickCollection *mongo.Collection
}

func (collection *ClickHandler) GetAllClicks(c echo.Context) error {
	fmt.Println("got request")
	aliase := c.QueryParam("aliase")
	cursor, findErr := collection.ClickCollection.Find(c.Request().Context(), bson.M{"aliase": aliase})
	if findErr != nil {
		return c.JSON(500, map[string]any{
			"success": false,
			"data": map[string]any{
				"statusCode": 500,
				"message":    findErr.Error(),
			},
		})
	}
	var clicks []bson.M
	if cursoErr := cursor.All(c.Request().Context(), &clicks); cursoErr != nil {
		return c.JSON(500, map[string]any{
			"success": false,
			"data": map[string]any{
				"statusCode": 500,
				"message":    cursoErr.Error(),
			},
		})
	}
	return c.JSON(200, map[string]any{
		"data": map[string]any{
			"statusCode": 200,
			"data":       clicks,
		},
		"success": true,
	})
}
