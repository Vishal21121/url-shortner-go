package validators

import (
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type CustomValidator struct {
	Validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.Validator.Struct(i); err != nil {
		return err
	}
	return nil
}

func UserLoginValidator(c echo.Context, validateErr any) []string {
	errorMessages := make([]string, 0)
	if validationErrors, ok := validateErr.(validator.ValidationErrors); ok {
		for _, ve := range validationErrors {
			if ve.Tag() == "email" {
				errorMessages = append(errorMessages, "Please provide correct email id")
			} else if ve.Tag() == "required" {
				if ve.Field() == "Email" {
					errorMessages = append(errorMessages, "Please provide email id")
				} else {
					errorMessages = append(errorMessages, "Please provide password")
				}
			}
		}
	}
	return errorMessages
}
func UserRegisterValidator(c echo.Context, validateErr any) []string {
	errorMessages := make([]string, 0)
	if validationErrors, ok := validateErr.(validator.ValidationErrors); ok {
		for _, ve := range validationErrors {
			if ve.Tag() == "email" {
				errorMessages = append(errorMessages, "Please provide correct email id")
			} else if ve.Tag() == "required" {
				if ve.Field() == "Email" {
					errorMessages = append(errorMessages, "Please provide email id")
				} else if ve.Field() == "Password" {
					errorMessages = append(errorMessages, "Please provide password")
				} else {
					errorMessages = append(errorMessages, "Please provide username")
				}
			} else if ve.Tag() == "gte" || ve.Tag() == "lte" {
				if ve.Field() == "Username" {
					errorMessages = append(errorMessages, "Username should be within 3 and 8 characters")
				} else {
					errorMessages = append(errorMessages, "Password should be within 8 and 13 characters")
				}
			}
		}
	}
	return errorMessages
}
