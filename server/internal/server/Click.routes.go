package server

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/vishal21121/url-shortner-go/internal/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type ClickHandler struct {
	ClickCollection *mongo.Collection
}

func NewClickCollection(collection *mongo.Collection) *ClickHandler {
	return &ClickHandler{ClickCollection: collection}
}

func (collection *ClickHandler) GetAllClicks(c echo.Context) error {
	fmt.Println("got request")
	aliase := c.QueryParam("aliase")
	cursor, findErr := collection.ClickCollection.Find(c.Request().Context(), bson.M{"aliase": aliase})
	if findErr != nil {
		return types.ThrowError(500, findErr.Error(), []string{})
	}
	var clicks []bson.M
	if cursoErr := cursor.All(c.Request().Context(), &clicks); cursoErr != nil {
		return types.ThrowError(500, cursoErr.Error(), []string{})
	}
	return c.JSON(200, map[string]any{
		"data": map[string]any{
			"statusCode": 200,
			"data":       clicks,
		},
		"success": true,
	})
}
