package utils

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"

	"github.com/Implex-ltd/implex/internal/console"
)

var (
	BasePath = "../../assets"
	charset  = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
)

func ReadFile(filePath string) ([]string, error) {
	var lines []string

	file, err := os.Open(fmt.Sprintf("%s/%s", BasePath, filePath))
	if err != nil {
		return lines, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return lines, err
	}

	return lines, nil
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

	fileInfos, err := ioutil.ReadDir(fmt.Sprintf("%s/%s", BasePath, dirPath))
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

func RandomString(length int) string {
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}

	return string(result)
}

func CreateFolderIfNotExist(dirPath string) error {
	_, err := os.Stat(fmt.Sprintf("%s/%s", BasePath, dirPath))
	if os.IsNotExist(err) {
		console.Log(fmt.Sprintf("new folder: %s", dirPath))
		err := os.MkdirAll(fmt.Sprintf("%s/%s", BasePath, dirPath), os.ModePerm)
		if err != nil {
			return err
		}
	}
	return nil
}
