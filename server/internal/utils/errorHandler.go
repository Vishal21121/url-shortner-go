package utils

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/vishal21121/url-shortner-go/internal/types"
)

func CustomErrorHandler(err error, c echo.Context) {
	if customErr, ok := err.(*types.ErrorResponse); ok {
		c.JSON(customErr.StatusCode, map[string]any{
			"success": false,
			"data": map[string]any{
				"message": customErr.Message,
				"errors":  customErr.Errors,
			},
		})
		return
	}
	c.JSON(http.StatusInternalServerError, map[string]any{
		"success": false,
		"data": map[string]any{
			"message": "Internal server error",
			"errors":  []string{err.Error()},
		},
	})
	return
}
