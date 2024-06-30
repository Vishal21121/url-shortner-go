package types

type UrlCreate struct {
	RedirectUrl string `json:"redirectUrl" validate:"required"`
	Aliase      string `json:"aliase" validate:"required"`
	UserId      string `json:"userId" validate:"required"`
}
