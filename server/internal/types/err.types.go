package types

import "fmt"

type ErrorResponse struct {
	StatusCode int
	Message    string
	Errors     []string
}

func (e *ErrorResponse) Error() string {
	return fmt.Sprintf("Code: %d, Message: %s", e.StatusCode, e.Message)
}

func ThrowError(StatusCode int, Message string, Errors []string) *ErrorResponse {
	return &ErrorResponse{
		StatusCode: StatusCode,
		Message:    Message,
		Errors:     Errors,
	}
}
