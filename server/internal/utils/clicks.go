package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/mssola/user_agent"
)

type IPInfo struct {
	IP          string `json:"ip"`
	City        string `json:"city"`
	CountryName string `json:"country_name"`
}

func GetLocation(ip string) (IPInfo, error) {
	var locationInfo IPInfo
	response, err := http.Get(fmt.Sprintf("https://ipapi.co/%s/json", ip))
	if err != nil {
		return locationInfo, err
	}
	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		return locationInfo, err
	}
	error := json.Unmarshal(data, &locationInfo)
	fmt.Println(locationInfo)
	if error != nil {
		return locationInfo, error
	}
	return locationInfo, nil
}

func GetDeviceType(requestAgent string) string {
	ua := user_agent.New(requestAgent)
	isMobile := ua.Mobile()
	isDesktop := !isMobile
	if isDesktop {
		return "desktop"
	}
	return "mobile"
}
