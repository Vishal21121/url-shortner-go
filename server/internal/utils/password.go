package utils

import "golang.org/x/crypto/bcrypt"

// takes password as string and generate the hashed password wih cost of 10
func HashPassword(password string) ([]byte, error) {
	hashedByte, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return nil, err
	}
	return hashedByte, nil
}

func CheckPassword(hashedPassword any, password string) (bool, error) {
	hashedPasswordStr, _ := hashedPassword.(string)
	error := bcrypt.CompareHashAndPassword([]byte(hashedPasswordStr), []byte(password))
	if error != nil {
		return false, error
	}
	return true, nil
}
