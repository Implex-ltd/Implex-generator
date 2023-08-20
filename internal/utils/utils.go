package utils

import (
	"fmt"
	"os"
)

var (
	BasePath = "../../assets"
)

func AppendFile(filePath string, line string) error {
	f, err := os.OpenFile(fmt.Sprintf("%s/%s", BasePath, filePath), os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = f.WriteString(line + "\n")
	if err != nil {
		return err
	}

	return nil
}