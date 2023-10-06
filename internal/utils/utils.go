package utils

import (
	"fmt"
	"math/rand"
	"os"
)

var (
	charset      = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	BasePath = "../../assets"
)

func RandomString(length int) string {
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}

	return string(result)
}

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

func GetAllFilesInDirectory(dirPath string) ([]string, error) {
	var files []string

	fileInfos, err := os.ReadDir(dirPath)
	if err != nil {
		return nil, err
	}

	for _, fileInfo := range fileInfos {
		if fileInfo.IsDir() {
			continue
		}
		files = append(files, fileInfo.Name())
	}

	return files, nil
}

func RandomNumber(a, b int) int {
	if a >= b {
		panic("Invalid range: a must be less than b")
	}

	return rand.Intn(b-a+1) + a
}
