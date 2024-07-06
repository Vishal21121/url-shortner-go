package validators

import (
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

func CreateUrlValidator(c echo.Context, validateErr any) []string {
	errorMessages := []string{}
	if validationErr, ok := validateErr.(validator.ValidationErrors); ok {
		for _, ve := range validationErr {
			if ve.Tag() == "required" {
				if ve.Field() == "RedirectUrl" {
					errorMessages = append(errorMessages, "Please provide redirectURl")
				} else if ve.Field() == "Aliase" {
					errorMessages = append(errorMessages, "Please provide Aliase for the url")
				} else {
					errorMessages = append(errorMessages, "Please provide UserId")
				}
			}
		}
	}
	return errorMessages
}
